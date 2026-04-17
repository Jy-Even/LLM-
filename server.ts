import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import sqlite3Pkg from 'sqlite3';
const sqlite3 = sqlite3Pkg.verbose();
import { open } from 'sqlite';
import cors from 'cors';

console.log('Server process starting...');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDb() {
  console.log('Initializing database...');
  try {
    const db = await open({
      filename: './database.sqlite',
      driver: sqlite3.Database
    });
    console.log('Database connection opened.');
    
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
    console.log('Database tables verified/created.');
    return db;
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}

async function startServer() {
  try {
    console.log('Starting server initialization...');
    const app = express();
    const PORT = 3000;

    app.use(express.json());
    app.use(cors());

    // 1. Health check mapped early
    app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

    // 2. Init DB
    const db = await initDb();
    console.log('Database initialization successful.');

    // 3. API Routes
    console.log('Registering API routes...');
    
    app.get('/api/wiki', async (req, res) => {
      try {
        const pages = await db.all('SELECT * FROM wiki_pages ORDER BY updated_at DESC');
        for (const page of pages) {
          const tags = await db.all(
            'SELECT name FROM tags t JOIN page_tags pt ON t.id = pt.tag_id WHERE pt.page_id = ?',
            page.id
          );
          page.tags = tags.map((t: any) => t.name);
        }
        res.json(pages);
      } catch (e) {
        res.status(500).json({ error: 'Failed to fetch wiki' });
      }
    });

    app.post('/api/wiki', async (req, res) => {
      const { id, title, content, snippet, source, type, relevance, author, tags } = req.body;
      await db.run(
        `INSERT OR REPLACE INTO wiki_pages (id, title, content, snippet, source, type, relevance, author, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        [id, title, content, snippet, source, type, relevance, author]
      );

      if (tags && Array.isArray(tags)) {
        await db.run('DELETE FROM page_tags WHERE page_id = ?', id);
        for (const tagName of tags) {
          await db.run('INSERT OR IGNORE INTO tags (name) VALUES (?)', tagName);
          const tag = await db.get('SELECT id FROM tags WHERE name = ?', tagName);
          await db.run('INSERT INTO page_tags (page_id, tag_id) VALUES (?, ?)', [id, tag.id]);
        }
      }
      res.json({ status: 'success', id });
    });

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

    app.get('/api/search', async (req, res) => {
      const { q } = req.query;
      const results = await db.all(
        'SELECT * FROM wiki_pages WHERE title LIKE ? OR content LIKE ? LIMIT 10',
        [`%${q}%`, `%${q}%`]
      );
      res.json(results);
    });

    // 4. Vite / Static mapping
    if (process.env.NODE_ENV !== 'production') {
      console.log('Initializing Vite middleware...');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
      console.log('Vite middleware ready.');
    } else {
      console.log('Setting up static file serving for production...');
      const distPath = path.join(process.cwd(), 'dist');
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }

    // 5. Finally bind port LAST so requests don't 404 while setting up
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server process listening on port ${PORT}`);
    });

  } catch (err) {
    console.error('FATAL ERROR during server startup:', err);
    process.exit(1);
  }
}

// Global handlers to prevent silent crashes
process.on('uncaughtException', (err) => {
  console.error('Unhandled Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
