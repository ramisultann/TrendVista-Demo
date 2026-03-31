## Live demo (Public)

### Live URL
- `https://trend-vista-demo.vercel.app/`

### Recommended setup (safe + recruiter-friendly)
This demo is designed to be **public** without exposing proprietary backend logic:
- **Frontend-only** deployment (Vercel)
- **DEMO_MODE** uses built-in mock data (no database, no collectors, no scraping)
- **Demo login button** in demo mode (public access, but professional SaaS flow)

### Deploy steps (Vercel)
1. Create a new Vercel project from your repo.
2. Set the **Root Directory** to `frontend/`.
3. Add an environment variable:
   - `NEXT_PUBLIC_DEMO_MODE=true`
4. Deploy.

### Notes
- If `NEXT_PUBLIC_DEMO_MODE` is enabled, the frontend bypasses auth and serves data from `frontend/src/demo/mockData.ts`.
- This avoids any ToS issues with live social ingestion in a public demo.

