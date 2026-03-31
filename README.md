## TrendVista — Public Live Demo

This repository contains a **public, recruiter-friendly live demo** of TrendVista.

### Live demo
- **Production**: `https://trend-vista-demo.vercel.app/`

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

