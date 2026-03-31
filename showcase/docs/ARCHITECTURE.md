## Architecture (Public, high-level)

### Goals
- **Scalable ingestion + processing** of social content
- **Security-first API** suitable for production
- **Extensible collectors** (new platforms can be added with minimal coupling)

### High-level flow
1. **Collectors** ingest relevant public content (platform-specific)
2. Raw content is stored in a database
3. **NLP processors** run sentiment + keyword extraction + trend aggregation
4. Processed insights are exposed via a **FastAPI** backend
5. A **Next.js** dashboard queries the API and visualizes trends

### Components
- **Data collection layer**
  - Modular collector interface per platform
  - Rate-limit aware ingestion and retry/backoff behavior
- **Processing layer**
  - Batch-oriented NLP jobs for throughput
  - Confidence scoring and normalization of outputs
- **API layer**
  - AuthN/AuthZ (JWT)
  - Input validation and consistent error contracts
- **Frontend**
  - Protected routes, dashboard pages, charts

### Scaling notes
- Redis-backed primitives (rate limiting, caching, queues) enable horizontal scaling.
