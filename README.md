# StewardOS

Your personal operating system for consistency, truth, and execution.

This replaces the earlier habit-tracker scaffold. The app itself — routines,
agenda, goal hierarchy, gratitude scans, weekly reviews, points/rewards, AI
Steward — is the original StewardOS build, migrated onto Next.js + Supabase
so it persists across devices under your account instead of one browser's
localStorage.

## Stack

- **Next.js 15** (App Router) + TypeScript
- **Supabase** — Postgres, Auth, Row Level Security
- **Tailwind CSS v4**
- **motion** (Framer Motion's successor) — animations
- Rule-based AI Steward engine (`src/lib/steward-engine.ts`) — **no external
  AI provider, no API key, no per-call cost**

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in your Supabase URL + anon key
```

Run `supabase/schema.sql` in your Supabase project's SQL editor, then:

```bash
npm run dev
```

## What changed from the original StewardOS build

**Stack:** Vite + Express + Google Gemini + localStorage → Next.js (App
Router) + Supabase, matching your Ejika.ng/BigAuntie stack.

**Persistence — the one deliberate architectural trade-off:** the whole
`AppState` (routines, goals, journals, reviews, points, settings — every
field in `src/types.ts`) is stored as a single JSONB document per user in
one `app_states` table, not normalized into ~15 separate tables. This was
the pragmatic call: StewardOS's own logic (`App.tsx`) already treats state
as one cohesive tree that loads and saves atomically, so mirroring that in
Postgres ported the app over with almost no changes to the parts you'd
already built, at the cost of not being able to run SQL queries *across*
users' data. That only matters once this opens up to other people and you
want cross-user analytics (leaderboards, aggregate consistency stats) — at
that point, split the specific fields you need out of the blob into real
columns or companion tables. Nothing about this design blocks that later;
it's exactly the kind of change RLS-protected tables handle well.

**AI Steward — Gemini removed, not replaced with another vendor.** You said
you don't want to depend on Gemini and might train your own model later.
Every place that called the Gemini API now calls a local, deterministic
rules engine instead (`src/lib/steward-engine.ts`), reached through the
same five API routes the components already call
(`/api/ai/steward-chat`, `/api/ai/recovery-action`,
`/api/ai/interpretation-coach`, `/api/ai/access-protocol`,
`/api/ai/pattern-analysis`). Each function in that file has a narrow,
typed return shape matching exactly what its component expects — that's
the seam. When you're ready to plug in a trained model, you swap the
function body for a call to it; nothing in any component changes.

**Auth added:** email/password via Supabase Auth, gated by
`src/middleware.ts`. Sign-out lives next to Settings in the top nav.

## Bugs found and fixed during migration

`npx tsc --noEmit` on the original code (which Vite's build never actually
ran, since esbuild strips types without checking them) turned up four
real, pre-existing bugs in `DashboardView.tsx` — field names that never
matched `types.ts`:

| Was | Should be |
|---|---|
| `appState.failureLogs` | `appState.failurePatternLogs` |
| `goals5Year[0]?.visionStatement` | `goals5Year[0]?.vision` |
| `appState.monthlyRoles` | `appState.monthlyRoleGoals` |
| `role.currentOutputUnits` / `monthlyTargetUnits` / `outputUnitName` | `role.currentOutputCount` / `targetOutputCount` / `outputLabel` |

All four meant those dashboard stats were silently broken (rendering
`undefined`) in the original app. Fixed here; worth remembering that
`tsc --noEmit` is a cheap, valuable check to run on any AI Studio-generated
project before trusting it.

I also noticed the original `AiStewardDrawer` read `data.reply` from the
chat endpoint while the original Express server sent back `data.text` —
another pre-existing mismatch. The new engine returns `reply` to match
what the component actually reads.

## Architecture

```
src/
  app/
    page.tsx              Mounts <App /> (the whole StewardOS UI)
    (auth)/login, signup   Supabase auth pages
    api/ai/*/route.ts      Five endpoints, each a thin wrapper around
                          lib/steward-engine.ts
  App.tsx                  Original StewardOS shell — largely untouched,
                          now sourcing state from useAppState() instead
                          of localStorage
  components/              Original StewardOS views/modals, unchanged
                          except the DashboardView bug fixes above and
                          a sign-out button added to Navigation
  hooks/
    useAppState.ts          Loads AppState from Supabase on mount, saves
                          (debounced 800ms) on every change
    useAuth.ts              Thin wrapper around Supabase auth
  lib/
    steward-engine.ts       The rule-based AI Steward — see above
    supabase/               client.ts (browser) vs server.ts (Server
                          Components) — separate because cookie
                          handling differs between them
  services/
    storage.ts              Now just pure JSON export/import/reset
                          helpers — no longer touches localStorage;
                          Supabase persistence lives in useAppState
    auth.service.ts         Sign up / in / out
  types.ts                  Original StewardOS domain types, unchanged
  data/initialData.ts        Original default state, unchanged
supabase/
  schema.sql                app_states table + RLS policies
```

## Next steps worth knowing about

- **Reminders (18:00 Gratitude Scan, 20:20 hard stop):** not yet wired
  to actual browser notifications — the UI countdown timers exist
  (`Navigation.tsx`), but a real push/notification layer would need the
  Notifications API (with permission prompt) or a scheduled server job.
- **Screen time tracking:** `ScreenTimeLog` exists in the type model but
  isn't yet fed from anywhere real — currently manual entry only.
- **Training your own model:** once you have one, it plugs in at
  `src/lib/steward-engine.ts` — same five function signatures, same
  return shapes, no component changes needed.
