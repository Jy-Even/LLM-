import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function initDb() {
  console.log('Initializing database (better-sqlite3)...');
  try {
    const db = new Database('./database.sqlite');
    console.log('Database connection opened.');
    
    // Create tables if they don't exist
    db.exec(`
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

      CREATE TABLE IF NOT EXISTS chat_sessions (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        date TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS chat_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE
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

    // 2. Init DB synchronously
    const db = initDb();
    console.log('Database initialization successful.');

    // 3. API Routes
    console.log('Registering API routes...');
    
    app.get('/api/wiki', (req, res) => {
      try {
        const pages = db.prepare('SELECT * FROM wiki_pages ORDER BY updated_at DESC').all() as any[];
        const tagStmt = db.prepare('SELECT name FROM tags t JOIN page_tags pt ON t.id = pt.tag_id WHERE pt.page_id = ?');
        for (const page of pages) {
          const tags = tagStmt.all(page.id) as any[];
          page.tags = tags.map((t: any) => t.name);
        }
        res.json(pages);
      } catch (e) {
        console.error('Failed to fetch wiki:', e);
        res.status(500).json({ error: 'Failed to fetch wiki' });
      }
    });

    app.post('/api/wiki', (req, res) => {
      try {
        const { id, title, content, snippet, source, type, relevance, author, tags } = req.body;
        
        db.prepare(`
          INSERT OR REPLACE INTO wiki_pages (id, title, content, snippet, source, type, relevance, author, updated_at) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        `).run(id, title, content, snippet, source, type, relevance, author);

        if (tags && Array.isArray(tags)) {
          db.prepare('DELETE FROM page_tags WHERE page_id = ?').run(id);
          const insertTag = db.prepare('INSERT OR IGNORE INTO tags (name) VALUES (?)');
          const getTag = db.prepare('SELECT id FROM tags WHERE name = ?');
          const linkTag = db.prepare('INSERT INTO page_tags (page_id, tag_id) VALUES (?, ?)');
          
          for (const tagName of tags) {
            insertTag.run(tagName);
            const tag = getTag.get(tagName) as any;
            if (tag) linkTag.run(id, tag.id);
          }
        }
        res.json({ status: 'success', id });
      } catch (e) {
        console.error('Failed to post wiki:', e);
        res.status(500).json({ error: 'Failed to save wiki' });
      }
    });

    app.get('/api/chat', (req, res) => {
      try {
        const { sessionId } = req.query;
        let messages;
        if (sessionId) {
          messages = db.prepare('SELECT * FROM chat_history WHERE session_id = ? ORDER BY created_at ASC').all(sessionId);
        } else {
          messages = db.prepare('SELECT * FROM chat_history ORDER BY created_at ASC').all();
        }
        res.json(messages);
      } catch (e) {
        console.error('Failed to get chat:', e);
        res.status(500).json({ error: 'Failed to fetch chat logs' });
      }
    });

    app.post('/api/chat', (req, res) => {
      try {
        const { role, content, sessionId } = req.body;
        const result = db.prepare('INSERT INTO chat_history (role, content, session_id) VALUES (?, ?, ?)').run(role, content, sessionId || null);
        res.json({ status: 'success', id: result.lastInsertRowid });
      } catch (e) {
        console.error('Failed to save chat:', e);
        res.status(500).json({ error: 'Failed to save chat log' });
      }
    });

    app.get('/api/chat/sessions', (req, res) => {
      try {
        const sessions = db.prepare('SELECT * FROM chat_sessions ORDER BY created_at DESC').all();
        res.json(sessions);
      } catch (e) {
        console.error('Failed to fetch sessions:', e);
        res.status(500).json({ error: 'Failed to fetch chat sessions' });
      }
    });

    app.post('/api/chat/sessions', (req, res) => {
      try {
        const { id, title, date } = req.body;
        db.prepare('INSERT OR REPLACE INTO chat_sessions (id, title, date) VALUES (?, ?, ?)').run(id, title, date);
        res.json({ status: 'success', id });
      } catch (e) {
        console.error('Failed to save session:', e);
        res.status(500).json({ error: 'Failed to save chat session' });
      }
    });

    app.delete('/api/chat/sessions/:id', (req, res) => {
      try {
        const { id } = req.params;
        db.prepare('DELETE FROM chat_sessions WHERE id = ?').run(id);
        res.json({ status: 'success' });
      } catch (e) {
        console.error('Failed to delete session:', e);
        res.status(500).json({ error: 'Failed to delete session' });
      }
    });

    app.get('/api/search', (req, res) => {
      try {
        const { q } = req.query;
        const param = `%${q}%`;
        const results = db.prepare('SELECT * FROM wiki_pages WHERE title LIKE ? OR content LIKE ? LIMIT 10').all(param, param);
        res.json(results);
      } catch (e) {
        console.error('Failed to search text:', e);
        res.status(500).json({ error: 'Failed to search' });
      }
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
