import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

// Database Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'chat_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Initialize Database Table
async function initDb() {
  try {
    const connection = await pool.getConnection();
    await connection.query(`
      CREATE TABLE IF NOT EXISTS user_chats (
        user_id VARCHAR(255) PRIMARY KEY,
        ip_address VARCHAR(45),
        messages JSON,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    connection.release();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
}

initDb();

app.use(express.json());

// API Route to save chat logs (Mimic PHP API)
app.post('/api.php', async (req, res) => {
  const { messages, user_id } = req.body;
  
  // Get IP address
  const ip = (req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || '').split(',')[0].trim();

  if (!user_id) {
    return res.status(400).json({ error: 'Missing user_id' });
  }

  if (!messages) {
    return res.status(400).json({ error: 'Missing messages' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO user_chats (user_id, ip_address, messages)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE messages = VALUES(messages), ip_address = VALUES(ip_address)`,
      [user_id, ip, JSON.stringify(messages)]
    );
    
    res.json({ success: true, message: 'Chat saved successfully' });
  } catch (error) {
    console.error('Error saving chat log:', error);
    res.status(500).json({ error: 'Failed to save chat log' });
  }
});

// API Route to get chat logs (Mimic PHP API)
app.get('/api.php', async (req, res) => {
  const user_id = req.query.user_id as string;

  if (!user_id) {
    return res.status(400).json({ error: 'Missing user_id' });
  }

  try {
    const [rows] = await pool.query<any[]>(
      'SELECT messages FROM user_chats WHERE user_id = ?',
      [user_id]
    );

    if (rows.length > 0) {
      res.json({ success: true, messages: rows[0].messages });
    } else {
      res.json({ success: false, message: 'No chat found' });
    }
  } catch (error) {
    console.error('Error fetching chat log:', error);
    res.status(500).json({ error: 'Failed to fetch chat log' });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, 'dist')));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
