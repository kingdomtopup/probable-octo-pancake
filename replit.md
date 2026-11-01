# Workspace

## Overview

pnpm workspace monorepo using TypeScript. NOKORMC Top Up Store - a gaming top-up website for Mobile Legends Bang Bang diamonds, Free Fire diamonds, and Mobile Legend License.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite, Tailwind CSS, framer-motion, qrcode.react

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   └── nokormc/            # NOKORMC Top Up Store (React + Vite)
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## NOKORMC Features

- **Games**: Mobile Legends Bang Bang (diamonds), Free Fire (diamonds), Mobile Legend License
- **ID Verification**: Verify player ID before top-up
- **Payment**: ABA PayWay KHQR integration (sandbox)
  - Merchant ID: ec474370
  - API URL: https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/purchase
- **Order tracking**: Orders stored in PostgreSQL
- **Social links**: Facebook, TikTok, Telegram, Discord, YouTube
- **Contact**: nokormc@gmail.com
- **Created by**: KOB PANHA

## Database Schema

- `orders` table: game, playerId, serverId, playerName, productId, productName, amount, price, status, transactionId, createdAt

## API Endpoints

- `GET /api/healthz` - Health check
- `POST /api/topup/verify-id` - Verify player ID
- `GET /api/topup/products?game=mlbb|freefire` - Get products
- `POST /api/payment/create` - Create ABA QR payment
- `GET /api/payment/check/:transactionId` - Check payment status
- `POST /api/orders` - Create order
- `GET /api/orders` - List orders

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references.

## Packages

### `artifacts/nokormc` (`@workspace/nokormc`)

React + Vite frontend at `/` (root path).

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes in `src/routes/`.

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL.
