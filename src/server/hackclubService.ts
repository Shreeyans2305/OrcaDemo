import dotenv from 'dotenv';
dotenv.config();

export const HACKCLUB_API_URL = 'https://ai.hackclub.com/proxy/v1/chat/completions';
export const DEFAULT_MODEL = process.env.HACKCLUB_MODEL || 'openai/gpt-4o-mini';

// Default key fallback ensures seamless hackathon PPT live demo even before setting Vercel env
export const FALLBACK_API_KEY = 'sk-hc-v1-266cbf02ece2acec14403d85dea3605825e6caa8652e004877ab5418cf26e2ce';

export function getApiKey(): string {
  return process.env.HACKCLUB_API_KEY || FALLBACK_API_KEY;
}

export interface MaritimeQueryParams {
  query: string;
  language?: string;
  vessel?: string;
  userPos?: { lat: number; lng: number };
  contextData?: any;
}

export interface MaritimeAgentResponse {
  summary: string;
  nativeSummary: string;
  severity: 'green' | 'yellow' | 'red';
  keyEvidence: Array<{
    label: string;
    value: string | number;
    unit: string;
    threshold?: string | number;
    source: string;
  }>;
  reasoningSteps: string[];
  followUps: string[];
}

/**
 * Calls Hack Club AI proxy with strict JSON schema for maritime reasoning
 */
export async function queryMaritimeAgent(params: MaritimeQueryParams): Promise<MaritimeAgentResponse> {
  const { query, language = 'en', vessel = 'mechanised', userPos, contextData } = params;
  const apiKey = getApiKey();

  const systemPrompt = `You are ORCA (Marine EcOsystem Reasoning with Collaborative Agents), an expert oceanographic and maritime decision-support AI for fishermen, coastal vessels, and maritime authorities.

Your role:
1. Provide a direct, highly explainable, numbers-backed recommendation based on metocean conditions, vessel limits, and boundaries.
2. Always cite significant wave height (m), wind gusts (knots/km/h), and distance to boundaries (km).
3. Explicitly explain WHY an action is safe or unsafe based on the vessel limits (artisanal: 1.5m waves; mechanised: 2.5m waves; deepsea: 3.5m waves).
4. If user language is regional (Tamil 'ta', Hindi 'hi', Marathi 'mr', Telugu 'te', etc.), provide the 'summary' in English and 'nativeSummary' accurately translated into that language.
5. DO NOT use emojis.
6. Output strictly valid JSON matching this schema:
{
  "summary": "Plain-text concise evidence-backed summary in English",
  "nativeSummary": "Localized summary in the user's language (${language})",
  "severity": "green" | "yellow" | "red",
  "keyEvidence": [
    {"label": "Significant Wave Height", "value": 1.4, "unit": "m", "threshold": 1.5, "source": "Open-Meteo High-Res"}
  ],
  "reasoningSteps": ["step 1", "step 2", "step 3"],
  "followUps": ["question 1", "question 2"]
}`;

  const userContent = `User Location: Lat ${userPos?.lat ?? 9.28}, Lng ${userPos?.lng ?? 79.31}
Vessel Class: ${vessel}
Target Language: ${language}
User Query: "${query}"

Metocean & Geospatial Real-Time Context:
${JSON.stringify(contextData ?? {}, null, 2)}`;

  const response = await fetch(HACKCLUB_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent },
      ],
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Hack Club AI API error (${response.status}): ${errorText}`);
  }

  const json = await response.json();
  const rawContent = json?.choices?.[0]?.message?.content || '{}';
  const parsed = JSON.parse(rawContent) as MaritimeAgentResponse;
  return parsed;
}

/**
 * High-accuracy translation using Hack Club AI
 */
export async function translateMaritimeText(text: string, sourceLang: string, targetLang: string): Promise<string> {
  if (!text || sourceLang === targetLang) return text;
  const apiKey = getApiKey();

  const systemPrompt = `You are a precision maritime oceanographic translator. Translate the text from language code '${sourceLang}' to language code '${targetLang}'. Retain precise units (meters, knots, km, degrees C, hPa, IMBL). Do NOT use emojis. Output strictly valid JSON: {"translatedText": "..."}`;

  const response = await fetch(HACKCLUB_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text },
      ],
      temperature: 0.1,
    }),
  });

  if (!response.ok) {
    return text;
  }

  const json = await response.json();
  const raw = json?.choices?.[0]?.message?.content || '{}';
  const parsed = JSON.parse(raw);
  return parsed.translatedText || text;
}
