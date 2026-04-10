# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start development server at http://localhost:3000
npm run build     # Production build
npm run lint      # Run ESLint
```

### Prisma

```bash
npx prisma migrate dev        # Run migrations (requires DATABASE_URL env var)
npx prisma migrate deploy     # Apply migrations in production
npx prisma generate           # Regenerate client after schema changes
```

The Prisma client is generated into `app/generated/prisma/` (gitignored). After pulling changes that modify the schema, run `prisma generate`.

## Architecture

**Stack:** Next.js 16 (App Router) + Prisma 7 + PostgreSQL + Tailwind CSS 4

**Database connection:** `lib/prisma.ts` exports a singleton `PrismaClient` using `PrismaPg` adapter (native pg driver). Reads `DATABASE_URL` from environment. The singleton pattern prevents connection exhaustion in dev hot-reload.

**Prisma config:** `prisma.config.ts` at the root loads env via `dotenv/config` and points to `prisma/schema.prisma`. The generated client outputs to `app/generated/prisma/` rather than the default location.

**Data mutations:** Server Actions are used for all writes. Inline `"use server"` actions live inside page components (e.g. `createPlant` in `app/plants/page.tsx`), and standalone actions live in `app/plants/actions.ts` (e.g. `deletePlant`). All mutations call `revalidatePath` to refresh data.

**Current data model:** A single `Plant` model with `id`, `name` (unique, stored lowercase), `type` (enum: Vegetables, Fruits, Cereals, Legumes, NutsAndSeeds, HerbsAndSpices), and `createdAt`.

**Environment:** Requires a `.env` file with `DATABASE_URL` pointing to a PostgreSQL instance. The `.env*` files are gitignored.
