## TrendVista (Public Showcase)

TrendVista is a **production-ready SaaS platform** that helps local food & beverage businesses in the Greater Toronto Area (GTA) turn social chatter into **actionable menu + marketing insights**.

Because TrendVista is being developed for **commercial use**, the full source code lives in a private repository. This public repository is a **recruiter-friendly showcase**: product story, architecture, security decisions, and demos—without exposing proprietary implementation details.

### What it does
- **Aggregates** social signals from sources like Instagram, TikTok, and Reddit
- Runs **NLP** (sentiment, keyword extraction, trend detection)
- Presents insights in a **real-time dashboard** (trends, sentiment, top topics, recent insights)

### Tech stack (high level)
- **Backend**: FastAPI (Python), PostgreSQL, Redis, JWT auth
- **NLP**: Transformers (Hugging Face), spaCy (and supporting tooling)
- **Frontend**: Next.js + TypeScript, Tailwind, Recharts

### Highlights recruiters care about
- **Security-first backend**: OWASP-aligned validation/sanitization, audit logging, security headers, JWT auth
- **Distributed rate limiting**: Redis-backed rate limiting designed for horizontal scaling
- **Modular data-collection architecture**: collectors per platform with shared interfaces
- **Clear separation of concerns**: API routes, services, schemas, models, and infra boundaries

### Demo
- **Live demo**: (add link after deploy) `https://<your-vercel-app>.vercel.app`
- **Screenshots/GIFs**: see `assets/`
- **Product walk-through**: see `docs/PRODUCT.md`
- **Deployment**: see `docs/LIVE_DEMO.md`

### Repo contents
- `docs/`: product write-up, architecture, security, API surface (high-level)
- `assets/`: screenshots, diagrams, short clips (no code)

### Access to private repo
If you’re reviewing me for a role and would like to see implementation details, I can share a **read-only code walkthrough** (screenshare) and/or a sanitized code sample upon request.

### Contact
- **Owner**: Rami Sultan
- **GitHub**: replace with your profile URL
