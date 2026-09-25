# RTS Stock Lookup

A small Next.js app for the RTS Labs coding demonstration. You create an account, log in, and look up a stock’s opening price for the current day. Quotes are available only while you are signed in.

**Live app:** https://rts-app-mu.vercel.app
**Source:** https://github.com/ajbarbati/RTS-App

## Stack

- Next.js 16 (App Router) and TypeScript
- Postgres with Prisma 7
- Auth.js v5 (Credentials provider, JWT sessions, bcrypt-hashed passwords)
- Finnhub `/quote` for today’s open (`o`). The API key stays on the server.
- Tailwind CSS v4
- Vitest
- Docker Compose for local Postgres and the app
- GitHub Actions for lint and tests
- Production: Next.js on Vercel, Postgres on Neon

```mermaid
flowchart LR
  browser[Browser]
  nextApp[Next.js]
  finnhub[Finnhub]
  pg[(Postgres)]
  browser --> nextApp
  nextApp --> pg
  nextApp --> finnhub
```

## Run it locally with Docker

Prerequisites: [Docker Desktop](https://www.docker.com/products/docker-desktop/) and a free [Finnhub API key](https://finnhub.io/register).

From the repo root:

```powershell
Copy-Item .env.example .env
```

On macOS or Linux, use `cp .env.example .env` instead.

Fill in `.env`:

- `AUTH_SECRET`: generate one with `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
- `FINNHUB_API_KEY`: your Finnhub key

Leave `DATABASE_URL` as the example value. Compose overrides it for the app container so it talks to the `postgres` service.

```powershell
docker compose up --build
```

Open http://localhost:3000. Sign up, log in, look up a symbol such as `AAPL`, then log out. The first start runs database migrations before the app listens.

## Run it without Docker for the app

Use this when you want Next.js on the host and only Postgres in Docker. You need Node.js 22, npm, and Docker Desktop.

```powershell
Copy-Item .env.example .env
```

Set `AUTH_SECRET` and `FINNHUB_API_KEY` as above. Keep `DATABASE_URL` as `postgresql://rts:rts@localhost:5432/rts`.

```powershell
docker compose up -d postgres
npm ci
npx prisma migrate dev
npm run dev
```

Open http://localhost:3000.

## Tests

Postgres has to be running, and `.env` needs `DATABASE_URL` pointing at it (`docker compose up -d postgres` from the section above). `npx prisma migrate dev` also generates the Prisma client, which is not committed.

```powershell
npm test
```

Signup and login tests use that real database. Each test creates a user with a unique email and deletes its rows afterward.

Finnhub and Auth.js are mocked. Quote tests stub `fetch`, so they do not call Finnhub or need an API key. Auth.js `auth()`, `signIn()`, and `signOut()` only work inside a real Next.js request, which a Vitest run does not have, so those calls are mocked and the tests check the credential logic, `requireUser()`, and that actions invoke Auth.js with the right arguments. The browser session itself is checked by using the app.

## Environment variables

| Name | Where it comes from |
|---|---|
| `DATABASE_URL` | Local host runs and CI: `postgresql://rts:rts@localhost:5432/rts`. The Compose app service sets `postgresql://rts:rts@postgres:5432/rts`. Production: the Neon **pooled** connection string. |
| `AUTH_SECRET` | A random 32-byte secret you generate (command above). Production uses its own secret, set in Vercel. Auth.js signs the session JWT with it. |
| `AUTH_TRUST_HOST` | Set to `true` in `.env` and in Compose so Auth.js accepts the local host. Vercel detects the host, so this variable is not set there. |
| `FINNHUB_API_KEY` | A free key from [finnhub.io](https://finnhub.io/register). It is read only in server code. |

Do not commit `.env`.


