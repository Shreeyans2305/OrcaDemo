# ORCA - Marine Ecosystem Reasoning with Collaborative Agents

Voice-first, multilingual, explainable marine decision-support mobile prototype for fishermen and coastal authorities.
Powered by **Hack Club AI** (`openai/gpt-4o-mini`), real-time Open-Meteo ocean forecasts, INCOIS PFZ front discovery, and deterministic geospatial boundary safety geofencing.

---

## Features
- **Hack Club AI Multi-Agent Reasoning**: Real-time maritime queries with structured JSON evidence, explainability chains, and regional translations (Tamil, Hindi, Marathi, Telugu, etc.).
- **Live Metocean Ingestion**: Wave height, swell, wind gusts, and Sea Surface Temperature (SST) thermal front clustering.
- **Safety Boundary Geofencing**: International Maritime Boundary Line (IMBL) proximity calculations with audible/visual alerts.
- **Mobile-First Experience**: Optimized touch UI, bottom navigation tab bar, iOS safe-area support, and an interactive **Presentation Device Mockup Frame** for hackathon slide/PPT screen demonstrations.
- **Zero-Config Vercel Deployment**: Serverless API routes in `/api` and instant SPA rewrite support.

---

## Running Locally

**Prerequisites:** Node.js (v18+) or Bun

1. **Install dependencies:**
   ```bash
   bun install
   # or
   npm install
   ```

2. **Configure environment:**
   Verify `.env` has your Hack Club API key:
   ```env
   HACKCLUB_API_KEY=sk-hc-v1-266cbf02ece2acec14403d85dea3605825e6caa8652e004877ab5418cf26e2ce"
   ```

3. **Run local server & dev app:**
   ```bash
   bun run dev
   # or
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## Deploying to Vercel

1. Push your repository to GitHub.
2. In the [Vercel Dashboard](https://vercel.com):
   - Click **Add New Project** & import your repo.
   - Framework preset: **Vite**
   - Build Command: `bun run build` or `npm run build`
   - Output Directory: `dist`
3. Add Environment Variable in Vercel:
   - `HACKCLUB_API_KEY`: `sk-hc-v1-...`
4. Click **Deploy**! Your app and its `/api/*` endpoints will be live instantly.
