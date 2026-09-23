# RTS Labs Coding Demonstration 2024

Interview challenge from Ryan (Talent Acquisition, RTS Labs). You have **5 business days**. They expect ~2–3 hours of work, not a rushed submission. Reviewers will look at **both the code and a live deployed app**.

## Core product

Build and deploy a **Next.js** app that:

1. **Sign up** — create an account and persist it in a database
2. **Log in** — authenticate against stored credentials
3. **Log out** — end the session
4. **Stock lookup (signed-in only)** — form takes a stock symbol and returns the **opening price**
   - Suggested API: [Finnhub](https://finnhub.io); another source is fine
   - This functionality must be **unavailable unless the user is signed in**

Make it look finished with **Tailwind** (or equally careful CSS).

## What they are grading

- Start and **deploy** an app yourself
- **Database**: save and retrieve (at least users)
- **Routing + views**: request/response flow a user can follow
- **External API** integration (stock quote)
- **Tests**: at least a few **happy-path** tests proving:
  - sign up works
  - log in works
  - searching for a stock symbol works

**TDD is required.** Write the Vitest happy-path tests first, then the implementation until they pass. Minimum coverage: sign up, log in, stock symbol search.

## Constraints and submission notes

- Do **not** have AI complete the entire challenge. Use it as a tool.
- On submit, include a short note: **which parts AI helped with vs. which you did yourself**.
- If something is ambiguous, they want you to ask — nothing is designed as a trick.

## Stack

- **App:** Next.js (App Router)
- **DB:** Postgres via Prisma
- **Auth:** Auth.js (Credentials provider + Prisma adapter; email + hashed password)
- **Quotes:** Finnhub `/quote` field `o` (session open), key only on the server
- **UI:** Tailwind
- **Tests:** Vitest, written first (TDD)
- **Local run:** Docker Compose (Next.js app + Postgres)
- **CI:** GitHub Action with a Postgres service container; install deps and run Vitest
- **Prod:** Next.js on **Vercel**; Postgres on **Neon** (`DATABASE_URL`)
- **Source:** public GitHub repo on your account (reviewers need the code)

## Where Postgres lives

Vercel does not host Postgres. Same schema, three places, one `DATABASE_URL`:

- **Your machine / reviewer:** Compose service `postgres` (e.g. `postgresql://rts:rts@postgres:5432/rts`)
- **GitHub Actions:** workflow `services: postgres` so TDD tests hit a real DB
- **Production:** a Neon free-tier database; Vercel env var `DATABASE_URL` points at it

Do not put a Postgres container on Vercel. Neon is the hosted DB; Compose is only for local/reviewer runs.

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

Locally `pg` is Compose. In prod `pg` is Neon. In CI `pg` is the Actions service.

## Tickets (code in this order)

Each ticket is one sitting. Do not start the next until the current one is done. TDD tickets are marked RED (write a failing test) or GREEN (make it pass).

1. **Scaffold** — `npx create-next-app` with App Router + Tailwind. Empty `/` page is enough.
2. **git init** — repo in this project folder; `.gitignore` covers `.env`, `node_modules`, and secrets. First commit.
3. **GitHub** — public repo on your account (`gh repo create`), push `main` with `-u`. Later tickets commit and push as you go so CI can run.
4. **Vitest** — config + `npm test`. No feature tests yet.
5. **Compose Postgres** — `postgres` service, `.env.example` with `DATABASE_URL`, `AUTH_SECRET`, `FINNHUB_API_KEY`. App container comes later (ticket 18).
6. **Prisma User** — `email` unique, `passwordHash`. Migrate against the Compose DB.
7. **RED signup** — test that registering an email/password inserts a user (hashed, not plaintext).
8. **GREEN signup** — server action + `/signup` page. Duplicate email fails clearly.
9. **RED login** — test that those credentials produce a session.
10. **GREEN login** — Auth.js Credentials + Prisma adapter + `/login` page.
11. **RED logout** — test that logout clears the session.
12. **GREEN logout** — button/action that signs out.
13. **Protect quote** — `/quote` redirects to `/login` when there is no session.
14. **RED quote** — signed-in test user submits `AAPL` (or similar); assert opening price. Mock Finnhub so CI does not need a live key.
15. **GREEN Finnhub** — server-only client, `/quote` field `o`. Key never sent to the browser.
16. **GREEN quote UI** — form on `/quote`, show the open price; simple error for bad symbols / API down.
17. **Tailwind** — make signup, login, and quote look like one product.
18. **Dockerfile** — Compose runs app + Postgres; `docker compose up` is enough for a reviewer.
19. **CI** — Action with a Postgres service: install, migrate, `npm test` on push.
20. **Deploy** — Neon project + Vercel project; wire env vars; confirm signup → login → quote on the live URL.
21. **README** — how to run via Compose, env vars, live URL, GitHub URL, which parts AI helped with vs you.

Never commit `.env` or the Finnhub key. Public repo so RTS can review the code.

## Ticket steps (detail)

High-level list above is the map. Use this section when you sit down to code a ticket. Stop when the **Done when** line is true.

### Ticket 1 — Scaffold

1. In `rts-challenge`, run `npx create-next-app@latest .` (App Router, TypeScript, Tailwind, ESLint).
2. Confirm `npm run dev` serves a page at `http://localhost:3000`.
3. Leave the default home page for now.

**Done when:** the Next.js + Tailwind app starts locally.

### Ticket 2 — git init

1. `git init` in the project root (skip if create-next-app already did).
2. Confirm `.gitignore` includes `.env`, `.env*.local`, `node_modules`, `.next`.
3. First commit of the scaffold only.

**Done when:** `git status` is clean and there is one commit.

### Ticket 3 — GitHub

1. `gh auth status` (log in if needed).
2. `gh repo create` — public, this folder as the source, push `main` (or `master`) with `-u`.
3. Open the GitHub URL and confirm the files are there. No `.env`.

**Done when:** `git remote -v` points at your public GitHub repo and `main` is on origin.

### Ticket 4 — Vitest

1. Install `vitest` (and `@vitejs/plugin-react` if you will test components later).
2. Add `vitest.config.ts` (Node environment is enough for API/action tests).
3. Add `"test": "vitest"` to `package.json`.
4. Add a throwaway `true === true` test, run `npm test`, then delete that test.

**Done when:** `npm test` runs Vitest successfully.

### Ticket 5 — Compose Postgres

1. Add `docker-compose.yml` with a `postgres:16` service, user/password/db `rts`, port `5432`, named volume.
2. Add `.env.example` with `DATABASE_URL=postgresql://rts:rts@localhost:5432/rts`, `AUTH_SECRET=`, `FINNHUB_API_KEY=`.
3. Copy to `.env` locally (never commit `.env`).
4. `docker compose up -d postgres` and confirm the container is healthy.

**Done when:** Postgres is reachable on localhost:5432 and `.env.example` is committed.

### Ticket 6 — Prisma User

1. Install `prisma` and `@prisma/client`. `npx prisma init`.
2. Model `User`: `id`, unique `email`, `passwordHash`, `createdAt`. Add Auth.js adapter tables when you hit ticket 10 if the adapter needs them (`Account`, `Session`, `VerificationToken`).
3. `npx prisma migrate dev --name init` against Compose Postgres.
4. Add a small `lib/prisma.ts` singleton (or `src/lib/prisma.ts` if you later add a `src/` folder).

**Done when:** `User` exists in the Compose DB and Prisma Client generates.

### Ticket 7 (RED) — Sign-up test

1. Add `lib/auth/signup.ts` as a named export you can call from tests (the server action will wrap it later).
2. Write `lib/auth/signup.test.ts`: call sign-up with email/password; assert a row exists; assert `passwordHash` is not the raw password.
3. Run `npm test` — it must **fail** (function missing or throws).

**Done when:** the sign-up test is red for the right reason.

### Ticket 8 (GREEN) — Sign-up

1. Implement `signup`: hash with bcrypt, insert via Prisma, throw a clear error on duplicate email.
2. Add `app/signup/page.tsx` — email + password form posting to a server action that calls `signup`.
3. Re-run the ticket 7 test until green.
4. Manual check: submit the form, user appears in the DB.

**Done when:** test is green and `/signup` creates a user.

### Ticket 9 (RED) — Login test

1. Write `lib/auth/login.test.ts`: create a user via `signup`, then authenticate with the same credentials; assert success. Wrong password should fail (optional extra assert).
2. Run `npm test` — login assertion must **fail**.

**Done when:** the login test is red.

### Ticket 10 (GREEN) — Login / Auth.js

1. Install `next-auth` (Auth.js) and the Prisma adapter. Set `AUTH_SECRET` in `.env`.
2. Credentials provider: look up user by email, `bcrypt.compare` on `passwordHash`.
3. Add `app/login/page.tsx` and Auth.js route handler (`app/api/auth/[...nextauth]/route.ts` or the Auth.js v5 equivalent).
4. Re-run ticket 9 until green. Manual: log in after signing up.

**Done when:** test is green and `/login` starts a session.

### Ticket 11 (RED) — Logout test

1. Write a test: sign up, log in, log out, assert session is gone (or `auth()` returns null).
2. Run `npm test` — must **fail**.

**Done when:** the logout test is red.

### Ticket 12 (GREEN) — Logout

1. Add a server action or `signOut()` button in the chrome (header on `/` or `/quote`).
2. Make the ticket 11 test pass.
3. Manual: log in, click log out, session is gone.

**Done when:** test is green and a user can log out in the UI.

### Ticket 13 — Protect /quote

1. Add `app/quote/page.tsx` (placeholder is fine).
2. In the page or middleware: if no session, `redirect("/login")`.
3. Manual: logged-out visit to `/quote` lands on `/login`; logged-in visit stays.

**Done when:** the quote route is session-gated.

### Ticket 14 (RED) — Quote test

1. Add `lib/stocks/getOpeningPrice.ts` (export you can mock).
2. Write `lib/stocks/getOpeningPrice.test.ts`: mock `fetch` (or the Finnhub module) to return `{ o: 150.25 }` for `AAPL`; assert the function returns `150.25`.
3. Run `npm test` — must **fail**.

**Done when:** the quote test is red. No live Finnhub key in CI.

### Ticket 15 (GREEN) — Finnhub client

1. Implement `getOpeningPrice(symbol)`: `GET https://finnhub.io/api/v1/quote?symbol=...&token=...` using `FINNHUB_API_KEY`. Read field `o`.
2. Throw/return a typed error if symbol is empty, `o` is `0`/missing, or the request fails.
3. File must be server-only (`import "server-only"` or no client import).
4. Ticket 14 test green.

**Done when:** mocked test passes and a local call with a real key can fetch `AAPL`.

### Ticket 16 (GREEN) — Quote UI

1. Form on `/quote`: symbol input, submit server action calling `getOpeningPrice`.
2. Show opening price on success. Show a short message on invalid symbol or API error.
3. Keep the page behind the ticket 13 session check.

**Done when:** signed-in user can submit `AAPL` and see an opening price.

### Ticket 17 — Tailwind

1. Shared layout: app name, nav (Sign up / Log in, or Quote + Log out when signed in).
2. Style `/signup`, `/login`, `/quote` as one product (card, spacing, focus states). No new features.

**Done when:** the three pages look finished on desktop.

### Ticket 18 — Dockerfile + Compose app

1. `Dockerfile` for the Next.js app (deps, build or `next dev` for local review — prefer production `next start` if env is straightforward).
2. Add an `app` service to Compose: depends on `postgres`, passes `DATABASE_URL` as `postgresql://rts:rts@postgres:5432/rts`, plus `AUTH_SECRET` and `FINNHUB_API_KEY` from `.env`.
3. Document `docker compose up --build`. Confirm signup still works against Compose Postgres.

**Done when:** a reviewer can run the stack with one Compose command.

### Ticket 19 — CI

1. `.github/workflows/test.yml`: on push, Postgres service (`postgres:16`, same creds as Compose).
2. Steps: checkout, Node, `npm ci`, `npx prisma migrate deploy`, `npm test`.
3. Use CI `DATABASE_URL` pointing at the service. No Finnhub key required (quotes are mocked).
4. Push and confirm the Action is green.

**Done when:** the latest push shows a passing GitHub Action.

### Ticket 20 — Deploy

1. Create a Neon free project; copy `DATABASE_URL`.
2. `npx prisma migrate deploy` against Neon.
3. Create a Vercel project from the GitHub repo. Set `DATABASE_URL`, `AUTH_SECRET`, `FINNHUB_API_KEY`, `AUTH_URL` / `NEXTAUTH_URL` if required.
4. Hit the live URL: sign up → log in → quote `AAPL` → log out.

**Done when:** the deployed app completes the happy path.

### Ticket 21 — README

1. What the app is and the stack.
2. How to run with Compose; how to run tests.
3. Env var table (`DATABASE_URL`, `AUTH_SECRET`, `FINNHUB_API_KEY`).
4. Live URL + GitHub URL.
5. AI-usage note: which parts AI helped vs you wrote.

**Done when:** a stranger can run and review the app from the README alone.

## Out of scope

- Password reset, OAuth, roles, watchlists, charts, historical data, rate limiting beyond a simple safeguard
- Kubernetes, Spark/Hadoop, ML features, extra clouds or infra-as-code
