# ArcFusion Monorepo

A Turborepo-based monorepo for the ArcFusion demo, built with Webpack Module Federation.

## Structure

- Apps (Webpack Module Federation)
  - Host: `hosts/knowesis` (port 3000)
  - Remotes:
    - `remotes/ask_ai` (port 3001)
    - `remotes/home` (port 3002)
    - `remotes/overview` (port 3003)
    - `remotes/stories` (port 3004)
- Packages
  - `packages/ui` (shared Fluent UI components, themes)
  - `packages/store` (shared Zustand stores)

## Prerequisites

- Node.js >= 18
- pnpm 9 (repo uses `packageManager: pnpm@9.0.0`)

Install pnpm (one-time):

```bash
npm i -g pnpm@9
```

## Install dependencies

From the repo root:

```bash
pnpm install
```

## Environment

The host (`hosts/knowesis`) reads remote URLs from an `.env` file. Create `hosts/knowesis/.env` with:

```bash
# hosts/knowesis/.env

AUTH0_DOMAIN=
AUTH0_CLIENT_ID=

REMOTE_URL_ASK_AI=http://localhost:3001
REMOTE_URL_HOME=http://localhost:3002
REMOTE_URL_OVERVIEW=http://localhost:3003
REMOTE_URL_STORIES=http://localhost:3004
```

Notes:

- The host auto-loads this file via `dotenv` and injects it into the client using `dotenv-webpack`.
- If you change ports, update this file accordingly.

## Development

### Option A: Run everything in parallel (recommended)

This starts host + all remotes (and package watchers) concurrently:

```bash
pnpm dev:all
```

Then open the host:

```
http://localhost:3000
```

### Option B: Run apps individually (separate terminals)

- Ask AI remote:

```bash
pnpm --filter @arcfusion/ask_ai dev
```

- Home remote:

```bash
pnpm --filter @arcfusion/home dev
```

- Overview remote:

```bash
pnpm --filter @arcfusion/overview dev
```

- Stories remote:

```bash
pnpm --filter @arcfusion/stories dev
```

- Host (Knowesis):

```bash
pnpm --filter @arcfusion/knowesis dev
```

Packages (optional, if you want to run just the package watchers):

```bash
pnpm --filter @arcfusion/ui dev
pnpm --filter @arcfusion/store dev
```

## Build

Build everything:

```bash
pnpm build
```

Build an individual app/package:

```bash
pnpm --filter @arcfusion/knowesis build
pnpm --filter @arcfusion/ask_ai build
pnpm --filter @arcfusion/home build
pnpm --filter @arcfusion/overview build
pnpm --filter @arcfusion/stories build
pnpm --filter @arcfusion/ui build
pnpm --filter @arcfusion/store build
```

## Useful scripts (root)

- `pnpm dev:all`: Start all apps in dev (parallel)
- `pnpm d:knowesis`: Start only the host (depends on remotes running)
- `pnpm build`: Build all
- `pnpm lint`: Lint (if configured per package)
- `pnpm format`: Prettier format
- `pnpm check-types`: Type check

## Ports

- Host (Knowesis): 3000
- Remotes: Ask AI 3001, Home 3002, Overview 3003, Stories 3004

## Troubleshooting

- If the host can’t load a remote, verify `hosts/knowesis/.env` values and that each remote is running on the expected port.
- After changing `.env`, restart the host dev server.
- Clear the browser cache or do a hard refresh if module federation artifacts seem stale.

## Tech stack

- Build tooling: Turborepo, pnpm workspaces
- Apps: React 19, Webpack 5, Module Federation
- UI: Fluent UI (v9)
- State: Zustand
- Charts: Recharts (Overview)
