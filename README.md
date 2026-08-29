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

