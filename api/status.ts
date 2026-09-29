import { getApiKey, DEFAULT_MODEL } from '../src/server/hackclubService';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return res.status(200).json({
    status: 'online',
    provider: 'Hack Club AI Proxy',
    model: DEFAULT_MODEL,
    configured: !!getApiKey(),
    timestamp: new Date().toISOString(),
  });
}
