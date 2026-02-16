# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Reservo is a multi-tenant sports field reservation platform (T3 Stack). Users browse and book sports courts; owners manage fields and reservations; admins control tenants, roles, and permissions.

## Commands

```bash
# Development (starts Docker PostgreSQL, waits for DB, pushes schema, runs Next.js with Turbo)
pnpm dev

# Individual steps
pnpm db:start          # Docker PostgreSQL on port 5433
pnpm dev:next          # Next.js dev server with --turbo

# Database
pnpm db:push           # Push Prisma schema to DB (no migration file)
pnpm db:generate       # Create migration with prisma migrate dev
pnpm db:migrate        # Deploy migrations (prisma migrate deploy)
pnpm db:seed           # Seed with tsx prisma/seed.ts
pnpm db:reset          # Reset DB (prisma migrate reset)
pnpm db:studio         # Prisma Studio GUI
pnpm db:update         # Reset + seed in one command
pnpm db:stop           # Stop Docker containers
pnpm db:down           # Remove Docker containers
pnpm db:clean          # Remove containers + volumes

# Code quality
pnpm lint              # Biome lint
pnpm lint:fix          # Biome lint with auto-fix
pnpm check             # Biome check (lint + format)
pnpm check:write       # Biome check with auto-fix
pnpm typecheck         # tsc --noEmit
pnpm commit            # Commitizen conventional commit

# Build
pnpm build             # Next.js production build
pnpm preview           # Build + start
```

Pre-commit hook runs `lint-staged` (Biome check with auto-fix) via Husky. Commit messages validated by commitlint (conventional commits: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert).

## Architecture

### Tech Stack
- **Next.js 15** (App Router, Turbopack) + **React 19** + **TypeScript 5.9** (strict mode, `noUncheckedIndexedAccess`)
- **tRPC 11** (type-safe API) + **TanStack React Query**
- **Prisma 6.5** (PostgreSQL 16 via Docker on port 5433)
- **Better Auth** (email/password + Google OAuth, JWT sessions — 7-day expiry)
- **Tailwind CSS 4** + **Radix UI** primitives + **shadcn/ui** pattern in `src/components/ui/`
- **next-intl** for i18n (ES, EN, PT) — static translations in `src/locales/{en,es,pt}/`

### Source Layout

```
src/
├── app/
│   ├── (public)/          # Landing, field browsing (/canchas), legal pages
│   ├── (authenticated)/   # Dashboard routes (owner, admin, profile, roles, users)
│   ├── (signin)/          # Auth pages (signin, signup, forgot-password, etc.)
│   └── api/
│       ├── trpc/          # tRPC HTTP handler
│       └── auth/          # Better Auth API routes
├── server/
│   ├── context.ts         # tRPC context (session, user, tenant, rbac from Better Auth)
│   ├── trpc.ts            # Procedure definitions (5 auth levels, see below)
│   └── routers/           # _app.ts merges: user, rbac, field, reservation, tenant,
│                          #   feature, companyInfo, translation, sportCenter, payment, metrics
├── services/
│   └── rbacService.ts     # RBAC helpers (role hierarchy, permission checks)
├── hooks/
│   ├── useTRPC.tsx        # tRPC client provider + `trpc` instance
│   ├── useRBAC.ts         # Client-side role checking
│   ├── useUser.ts         # Current user hook
│   └── useTranslation.tsx # Translation hook
├── lib/
│   ├── auth.ts            # Better Auth server config
│   ├── auth-client.ts     # Better Auth client instance
│   ├── db.ts              # Prisma client singleton
│   ├── mailer.ts          # Email sending (Nodemailer)
│   └── zod/               # Auto-generated Zod schemas (prisma-zod-generator)
├── components/
│   ├── ui/                # shadcn/ui base components
│   ├── dashboard/         # Dashboard-specific components
│   ├── fields/            # Field management components
│   ├── reservation/       # Reservation components (calendar, modals)
│   └── landing/           # Landing page sections
├── middlewares/
│   ├── authBase.ts        # Auth & permission middleware factories
│   └── rbac.ts            # RBAC convenience wrappers
└── locales/{en,es,pt}/    # i18n JSON files (common, dashboard, fields, home, landing)
```

### Key Patterns

**tRPC procedures** — 5 auth levels in `src/server/trpc.ts`:
- `publicProcedure` — no auth required
- `protectedProcedure` — requires authenticated user
- `tenantStaffProcedure` — requires TENANT_STAFF role or higher
- `tenantAdminProcedure` — requires TENANT_ADMIN role or higher
- `sysAdminProcedure` — requires SYS_ADMIN role

Note: `adminProcedure` and `superAdminProcedure` exist as deprecated aliases.

**tRPC client usage** (React): import `trpc` from `@/hooks/useTRPC` and use `trpc.routerName.procedureName.useQuery()` / `.useMutation()`.

**Path aliases**: Both `@/*` and `~/*` map to `src/`.

**Multi-tenancy**: Users belong to a Tenant. The tenant context is resolved in `src/server/context.ts` from the session. Most data is scoped by tenantId.

**RBAC**: Role hierarchy: `sys_admin` > `tenant_admin` > `tenant_staff` > `client`. Roles are defined by `UserRoleType` enum. Permissions combine an action (CREATE/READ/UPDATE/DELETE/MANAGE) with a resource. Check access via `rbacService.ts` — use `hasPermissionOrManage()` which checks both MANAGE and specific action permissions.

**Prisma Zod generator**: Running `prisma generate` auto-generates Zod schemas to `src/lib/zod/` from the Prisma schema. Use these for input validation in tRPC routers.

### Database

Docker PostgreSQL: `localhost:5433`, user `dev`, password `dev123`, database `reservo_dev`.

Key domain models: `Tenant`, `User`, `Field` (sports courts with pricing/schedules), `Reservation` (1-hour slots, supports guest bookings), `Payment`, `SportCenter` (groups fields), `Schedule` (weekly hours per field), `Feature` (amenities catalog), `Notification`, `OperatingSchedule`.

Key enums: `UserRoleType` (SYS_ADMIN, TENANT_ADMIN, TENANT_STAFF, CLIENT), `Sport` (FOOTBALL, TENNIS, BASKETBALL, VOLLEYBALL, FUTSAL), `TenantPlan` (FREE, BASIC, PROFESSIONAL, ENTERPRISE), `SportCenterStatus` (ACTIVE, PENDING, REJECTED, SUSPENDED).

Reservation flow: PENDING → CONFIRMED → COMPLETED/NO_SHOW or CANCELLED.

### Code Style

- **Biome** for linting and formatting (not ESLint/Prettier)
- 2-space indent, double quotes, semicolons, trailing commas (ES5), arrow parens always
- Biome rules: `noUnusedVariables` = error, `noExplicitAny` = warn, organize imports enabled
- Conventional commits enforced via Commitizen + commitlint
- Comments in the codebase are often in Spanish
