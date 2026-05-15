# PEN-AIs App

This project has two parts:

1. Frontend website: Vite + React
2. Backend server: Express API at `server.js`

## How to run

Open one terminal:

```bash
npm install
npm run dev
```

Open a second terminal in the same folder:

```bash
npm run server
```

Frontend usually opens at:

```text
http://localhost:5173
```

Backend runs at:

```text
http://localhost:3001
```

## AI writing endpoint

The frontend sends requests to:

```text
POST http://localhost:3001/api/write
```

With JSON:

```json
{
  "text": "your paragraph here",
  "action": "refine"
}
```

Supported actions:

- refine
- expand
- summarize
- grammar
- tone

## Optional OpenAI setup

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Then add your key:

```text
OPENAI_API_KEY=your_key_here
```

The server currently works in mock mode even without an API key.
