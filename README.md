# Petrel Panel

Petrel Panel is a SaaS game server management panel for provisioning and managing container-based game servers through `petrel-wings` agents running on host nodes.

This repository is the **single source of truth** for full-stack local startup. All Docker Compose orchestration (panel + postgres + wings) lives here.

## Prerequisites

- Node.js 20+
- PostgreSQL
- Docker (for running the local database via Compose)

## Full-stack startup (Docker Compose)

This is the recommended way to run the entire stack locally.

1. Copy and review environment variables:

```bash
cp .env.example .env
```

Edit `.env` and set `BETTER_AUTH_SECRET` to a random string. All other defaults are suitable for local development.

2. Start all services:

```bash
docker compose up --build -d
```

3. Open the panel in your browser at **http://localhost:3000**.

> **Important:** always use `http://localhost:3000`, not `http://127.0.0.1:3000`.  
> See [CSRF / origin troubleshooting](#csrf--origin-troubleshooting) below.

### Default admin account

When `SEED_DEFAULT_ADMIN=true` (the default in `.env.example`), the panel seeds a default admin user on first start:

| Field    | Value              |
|----------|--------------------|
| Email    | `admin@admin.com`  |
| Password | `admin`            |

> **Security warning:** change the default password immediately in any non-local environment. Set `SEED_DEFAULT_ADMIN=false` in production.

### Wings configuration

`ops/wings-config.yml` is mounted read-only into the wings container. Edit the `token` field with a real node token generated from the panel admin UI before deploying to a real host.

---

## Local development (without Docker)

### Setup

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env
```

Optionally set `ADMIN_EMAILS` as a comma-separated list to enable admin navigation items.

3. Start PostgreSQL with Docker Compose:

```bash
npm run db:start
```

4. Generate the Better Auth database schema (creates `src/lib/server/db/auth.schema.ts`):

```bash
npm run auth:schema
```

5. Apply database schema:

```bash
npm run db:push
```

6. Start the development server:

```bash
npm run dev
```

## Useful Scripts

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run check` — Svelte + TypeScript checks
- `npm run lint` — Prettier + ESLint
- `npm run db:push` — push Drizzle schema to DB
- `npm run auth:schema` — generate Better Auth schema file

## Tech Stack

- SvelteKit (SSR)
- Better Auth (email/password + GitHub OAuth)
- Drizzle ORM + PostgreSQL
- Tailwind CSS v4
- Paraglide i18n
- TypeScript

## Docker

Build the production image:

```bash
docker build -t petrel-panel .
```

Run the container:

```bash
docker run -p 3000:3000 --env-file .env petrel-panel
```

Runtime environment variables `DATABASE_URL`, `ORIGIN`, and `BETTER_AUTH_SECRET` are required.

The Docker build uses placeholder values only to allow compilation; always provide real secrets and connection values at runtime.

## CSRF / origin troubleshooting

SvelteKit enforces that the `Origin` header on form/API requests matches the `ORIGIN` environment variable configured for the server. A mismatch causes a **403 Forbidden** error on auth endpoints (sign-in, sign-up, etc.).

**Common mistake:** browsing to `http://127.0.0.1:3000` while `ORIGIN=http://localhost:3000` is set (or vice versa). Even though `127.0.0.1` and `localhost` resolve to the same address, browsers treat them as different origins.

**Fix:** always open the panel at exactly the URL that matches `ORIGIN` in your `.env`:

```
ORIGIN=http://localhost:3000  →  open http://localhost:3000
```

Never mix `localhost` and `127.0.0.1` in the same session.
