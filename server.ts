import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { queryMaritimeAgent, translateMaritimeText, getApiKey, DEFAULT_MODEL } from './src/server/hackclubService';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

/**
 * Health & API status
 */
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    provider: 'Hack Club AI Proxy',
    model: DEFAULT_MODEL,
    configured: !!getApiKey(),
    timestamp: new Date().toISOString(),
  });
});

/**
 * Server-side Hack Club AI Maritime Agent Query Endpoint
 */
app.post('/api/agent/query', async (req, res) => {
  try {
    const result = await queryMaritimeAgent(req.body);
    return res.json(result);
  } catch (error: any) {
    console.error('Server-side Hack Club AI generation error:', error);
    return res.status(500).json({ error: error?.message || 'Agent generation failed' });
  }
});

/**
 * Server-side Multilingual Translation Endpoint via Hack Club AI
 */
app.post('/api/agent/translate', async (req, res) => {
  const { text, sourceLang = 'en', targetLang = 'en' } = req.body;

  if (!text) {
    return res.json({ translatedText: '' });
  }

  try {
    const translatedText = await translateMaritimeText(text, sourceLang, targetLang);
    return res.json({ translatedText });
  } catch (err: any) {
    console.error('Translation error:', err);
    return res.json({ translatedText: text });
  }
});

// Setup Vite development middlewares or serve production dist
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ORCA Marine Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
