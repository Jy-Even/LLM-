import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDb() {
  const db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });

  // Create tables if they don't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS wiki_pages (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      snippet TEXT,
      source TEXT,
      type TEXT,
      relevance INTEGER,
      author TEXT,
      citations INTEGER DEFAULT 0,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS page_tags (
      page_id TEXT,
      tag_id INTEGER,
      FOREIGN KEY(page_id) REFERENCES wiki_pages(id),
      FOREIGN KEY(tag_id) REFERENCES tags(id)
    );

    CREATE TABLE IF NOT EXISTS chat_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  return db;
}

async function startServer() {
  const app = express();
  const PORT = 3000;
  const db = await initDb();

  app.use(express.json());
  app.use(cors());

  // API Routes
  
  // Wiki Pages
  app.get('/api/wiki', async (req, res) => {
    const pages = await db.all('SELECT * FROM wiki_pages ORDER BY updated_at DESC');
    // Fetch tags for each page
    for (const page of pages) {
      const tags = await db.all(
        'SELECT name FROM tags t JOIN page_tags pt ON t.id = pt.tag_id WHERE pt.page_id = ?',
        page.id
      );
      page.tags = tags.map(t => t.name);
    }
    res.json(pages);
  });

  app.post('/api/wiki', async (req, res) => {
    const { id, title, content, snippet, source, type, relevance, author, tags } = req.body;
    await db.run(
      `INSERT OR REPLACE INTO wiki_pages (id, title, content, snippet, source, type, relevance, author, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [id, title, content, snippet, source, type, relevance, author]
    );

    // Handle tags
    if (tags && Array.isArray(tags)) {
      // Clear existing tags
      await db.run('DELETE FROM page_tags WHERE page_id = ?', id);
      for (const tagName of tags) {
        await db.run('INSERT OR IGNORE INTO tags (name) VALUES (?)', tagName);
        const tag = await db.get('SELECT id FROM tags WHERE name = ?', tagName);
        await db.run('INSERT INTO page_tags (page_id, tag_id) VALUES (?, ?)', [id, tag.id]);
      }
    }

    res.json({ status: 'success', id });
  });

  // Chat History
  app.get('/api/chat', async (req, res) => {
    const messages = await db.all('SELECT * FROM chat_history ORDER BY created_at ASC');
    res.json(messages);
  });

  app.post('/api/chat', async (req, res) => {
    const { role, content } = req.body;
    const result = await db.run(
      'INSERT INTO chat_history (role, content) VALUES (?, ?)',
      [role, content]
    );
    res.json({ status: 'success', id: result.lastID });
  });

  // Search Results (Mock for now, normally would interface with an vector db or FTS)
  app.get('/api/search', async (req, res) => {
    const { q } = req.query;
    // Simple mock search return
    const results = await db.all(
      'SELECT * FROM wiki_pages WHERE title LIKE ? OR content LIKE ? LIMIT 10',
      [`%${q}%`, `%${q}%`]
    );
    res.json(results);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Database is ready.`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
