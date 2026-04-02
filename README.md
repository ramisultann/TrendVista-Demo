## TrendVista — Public Live Demo

This repository contains a **public live demo** of TrendVista — a product that turns social chatter into **actionable trend + sentiment insights** for local businesses.

### What TrendVista is
TrendVista is a trend intelligence dashboard for operators and marketers. It helps answer questions like:
- What topics are **rising** right now?
- What’s **polarizing** (sentiment shifting)?
- What should we **promote**, **adjust**, or **fix** this week based on feedback signals?

### How it works (high level)
- **Collect**: Social posts and comments are gathered across multiple platforms.
- **Analyze**: NLP pipelines extract **sentiment**, **keywords**, and group signals into topics/trends.
- **Surface**: The UI highlights the most important changes with charts and an insights feed you can skim fast.

### What you’ll see in the demo
- **Sentiment Trend**: a time-series view showing how sentiment changes over time
- **Sentiment Breakdown**: positive / neutral / negative distribution
- **Trending Topics**: a ranked list with “rising/falling” directional changes
- **Recent Insights**: short, readable summaries with sentiment + extracted keywords

### Live demo
- **Production**: `https://trend-vista-demo.vercel.app/`

### What this demo is (and isn’t)
- **Is**: a frontend-only Next.js app running in **DEMO_MODE** with curated mock data (no backend required)
- **Isn’t**: a full production deployment (no live collectors, no real integrations, no private services)

### What’s intentionally not included
- Real-time collectors / integrations (Instagram/TikTok/Reddit ingestion)
- Production backend, databases, queues, auth, billing, and internal tooling

### What’s included
- `frontend/`: Next.js demo app (runs in **DEMO_MODE** with mock data; no backend required)
- `showcase/`: public-facing docs/overview (optional, can be removed if you want demo-only)

### Run locally
```bash
cd frontend
npm install
NEXT_PUBLIC_DEMO_MODE=true npm run dev
```

### Deploy (Vercel)
- Root directory: `frontend/`
- Env var: `NEXT_PUBLIC_DEMO_MODE=true`

