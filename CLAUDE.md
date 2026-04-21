# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm run dev          # Next.js dev server at localhost:3000
pnpm run build        # Production build
pnpm run start        # Production server
pnpm run test         # Jest (jest-environment-jsdom)
pnpm run lint         # ESLint
pnpm run lint-fix     # ESLint with auto-fix
pnpm run format       # Prettier over all ts/tsx/js/jsx/json
pnpm run storybook    # Storybook dev at port 6006
```

Run a single test file:
```bash
pnpm run test -- src/schemas/BuyBoxFormSchema.test.ts
```

## Architecture

### Pages Router (Next.js)
Pages live under `src/content/` organized by dashboard area, not `src/pages/`. The Next.js pages directory handles routing; `src/content/` contains the heavy page-level components rendered by those pages.

Key dashboard areas in `src/content/Dashboards/`:
- `BuyBox/` — buy box list, statistics, leads
- `Analytics/` — property detail analytics (comps, rent comps, property facts)
- `Admin/` — admin tooling
- `Crypto/` — legacy dashboard scaffold (not core to the product)

Layouts: `src/layouts/SidebarLayout/` and `src/layouts/BaseLayout/`.

### State Management
Two parallel systems are in use — prefer RTK Query services for new data-fetching code:

- **RTK Query services** (`src/store/services/`) — `analysisApi`, `buyboxApiService`, `buyboxAnalysisApi`, `locationApiService`, `propertiesApiService`, `userApi`, `offersApi`
- **Redux slices** (`src/store/slices/`) — `authSlice`, `buyBoxesSlice`, `filterSlice`, `locationSlice`, `mapSlice`, `propertiesSlice`, `searchSlice`, `expensesSlice`
- Typed dispatch/selector hooks in `src/store/hooks.ts`

### API Layer
`src/api/` contains thin axios clients used outside RTK Query (legacy paths). All routes proxy through Next.js `/api/` to avoid CORS — the backend host is never called directly from the browser. Route constants live in `src/api/routes.ts`.

### Auth
- AWS Amplify (`src/lib/amplify.ts`) handles Cognito sessions via `@aws-amplify/adapter-nextjs`
- `src/hooks/useAuth.tsx` exposes the auth state
- `src/config/auth.ts` holds Cognito configuration constants

### Forms & Validation
- React Hook Form + Zod schemas in `src/schemas/`
- `BuyBoxFormSchema.ts` / `BuyBoxSchemas.ts` — buy box wizard validation
- `OfferFormDataSchema.ts` / `OfferSchemas.ts` — offer creation flow
- Field defaults in `src/schemas/defaults.ts`

### UI Component Strategy
- **MUI v5** (`@mui/material`) for layout, data grids, pickers
- **Radix UI** primitives for headless components (accordion, dialog, dropdown, popover, etc.)
- **Tailwind CSS** for utility classes alongside MUI's Emotion styling
- Custom MUI theme in `src/theme/base.ts`
- Path alias: `@/*` → `./src/*`

### Maps
- Mapbox GL (`mapbox-gl` / `react-map-gl`) for the interactive property map
- Google Maps (`@react-google-maps/api`) for address autocomplete
- Turf.js for geospatial calculations (circles, buffers)
- Map state managed via `src/store/slices/mapSlice.ts`

### Analytics / Observability
- PostHog (`src/lib/posthog.ts`) for product analytics; configured in `next.config.js` with a rewrite to PostHog's ingestion URL

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_DEALS_SERVICE_HOST=
NEXT_PUBLIC_BUY_BOX_SERVICE_HOST=
NEXT_PUBLIC_MAPBOX_TOKEN=
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_COGNITO_USER_POOL_ID=
NEXT_PUBLIC_COGNITO_CLIENT_ID=
NEXT_PUBLIC_COGNITO_REGION=
```
