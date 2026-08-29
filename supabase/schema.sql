-- StewardOS persistence: one row per user, the entire AppState (routines,
-- goals, journals, reviews, points, settings, etc.) stored as a single
-- JSONB document.
--
-- Why one JSONB blob instead of ~15 normalized tables? StewardOS's app
-- logic (App.tsx) already treats its whole state as one cohesive tree
-- that loads and saves atomically — that's a deliberate, reasonable
-- design for a personal system with no cross-record queries needed
-- day-to-day. Mirroring that in Postgres means the entire frontend
-- ports over with almost no changes, at the cost of not being able to
-- run SQL queries *across* the JSON (e.g. "average consistency score
-- across all users"). If you later want that — leaderboards, aggregate
-- analytics once this opens up to other users — that's the point to
-- split specific fields (e.g. stewardPoints, currentStreakNeverZero)
-- into real columns or companion tables. Nothing here blocks that later.

create table app_states (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null,
  updated_at timestamptz not null default now()
);

alter table app_states enable row level security;

create policy "Users can view their own app state"
  on app_states for select
  using (auth.uid() = user_id);

create policy "Users can insert their own app state"
  on app_states for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own app state"
  on app_states for update
  using (auth.uid() = user_id);
