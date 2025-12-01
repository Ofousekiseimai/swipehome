# SwipeHome Web MVP Architecture

## Goals
- Deliver end-to-end tenant and host flows for the MVP while keeping the codebase ready for a future native mobile client.
- Separate domain features (auth, listings, matches, chat) from shared UI and service layers.
- Keep all network access behind an API abstraction so that switching from mock data to Supabase/Firebase is a drop-in change.

## Proposed Structure
```
src/
  app/
    providers/          # Global context providers (query client, auth store, theme)
    router/             # Route definitions & guards
  features/
    auth/
      components/
      hooks/
      services/
    profiles/
    listings/
    matches/
    chat/
  shared/
    components/         # Buttons, inputs, layout primitives
    hooks/
    lib/                # Utilities (formatters, validators)
  services/
    api/                # REST/GraphQL clients & adapters
    storage/            # Upload helpers (Supabase Storage / Firebase)
  mocks/
    handlers/           # Mock Service Worker handlers for dev
    data/               # Seed data copied from current dummyData.js
```

> During the transition we will keep existing components under `src/components` and migrate them feature-by-feature to the new structure.

## State Management
- **TanStack Query** for all server state (listings, swipes, matches, messages).
- **Zustand** store for lightweight client state (session, feature flags, UI filters).
- Remove bespoke React Contexts once the new providers are wired.

## API Layer
- `services/api/client.ts` exports a thin wrapper over `fetch` (later replace with Supabase SDK).
- Feature services (e.g. `services/api/listings.ts`) describe request/response contracts with JSDoc typedefs.
- Mock layer powered by MSW to unblock UI while backend endpoints are implemented.

## Auth Flow (Phase 1)
1. Email/password login against mock endpoint (`POST /auth/login`).
2. Persisted session in `localStorage` via `zustand` middleware.
3. Guarded routes handled in the central router.

## Listings Flow (Phase 1)
- Host dashboard consumes `GET /listings?ownerId=...`.
- Listing form posts to mock API and writes to zustand cache so the UI updates instantly.
- Tenant feed fetches paginated listings plus preference filters.

## Matching Flow (Phase 2)
- Swipe actions call `POST /swipes`.
- Optimistic updates ensure the next card slides immediately.
- `useMatchStream` subscribes to WebSocket / Supabase channel (mocked for now) for real-time updates.

## Chat (Phase 3)
- WebSocket channel per match, falling back to polling in the mock layer.
- Messages local cache keyed by `matchId`.

## Testing & Tooling
- Unit: React Testing Library + Jest (already in CRA).
- Integration: add Cypress smoke suite once routing stabilises.
- CI: GitHub Actions workflow to run lint, unit, and build (to be added later).

## Next Steps
1. Introduce `app/providers` with QueryClient + Auth store and migrate current contexts gradually.
2. Extract existing dummy data into `mocks/data` and expose via mock API functions.
3. Wrap current pages/components with the new hooks (`useListings`, `useSession`) while keeping behaviour intact.
