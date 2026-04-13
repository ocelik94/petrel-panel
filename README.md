# Petrel Panel

Petrel Panel is a SaaS game server management panel for provisioning and managing container-based game servers through `petrel-wings` agents running on host nodes.

## Prerequisites

- Node.js 20+
- PostgreSQL
- Docker (for running the local database via Compose)

## Setup

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

5. Start the development server:

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
