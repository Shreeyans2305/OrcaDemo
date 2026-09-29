import { translateMaritimeText } from '../../src/server/hackclubService';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { text, sourceLang = 'en', targetLang = 'en' } = body || {};
    if (!text) {
      return res.status(200).json({ translatedText: '' });
    }
    const translatedText = await translateMaritimeText(text, sourceLang, targetLang);
    return res.status(200).json({ translatedText });
  } catch (error: any) {
    console.error('Vercel API translate error:', error);
    return res.status(200).json({ translatedText: req.body?.text || '' });
  }
}
