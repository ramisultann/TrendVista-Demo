## Security (Public)

TrendVista is built with “security by default” principles to be production-ready.

### Authentication
- JWT-based auth with configurable expirations
- Password hashing with modern algorithms (implementation private)

### Input validation & sanitization
- Schema-based validation (reject unexpected fields)
- Sanitization to reduce XSS risk and unsafe content persistence

### Rate limiting
- IP-based and user-based limits
- Redis-backed design for distributed enforcement across instances
- Stricter limits on authentication endpoints

### Headers & hardening
- Security headers (CSP, HSTS, frame protections, MIME protections, etc.)
- Structured audit logging for sensitive actions (auth events)

### Secrets management
- No hardcoded secrets; environment-driven configuration (details private)
