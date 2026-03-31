# TrendVista Frontend

Next.js frontend for TrendVista social media trend analysis platform.

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`

## Project Structure

```
frontend/
├── src/
│   ├── app/          # Next.js app router pages
│   ├── components/   # React components
│   ├── lib/          # Utilities and API client
│   └── hooks/        # Custom React hooks
├── public/           # Static assets
└── package.json      # Dependencies
```

## Development

- **Development server**: `npm run dev`
- **Build**: `npm run build`
- **Production server**: `npm start`
- **Linting**: `npm run lint`

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **State Management**: Zustand, React Query
- **Charts**: Recharts
- **HTTP Client**: Axios


