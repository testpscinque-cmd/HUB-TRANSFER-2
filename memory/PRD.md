# TransferMemory — L'Anagrafe del Calciomercato

## Original Problem Statement
High-performance B2B operational dashboard for football (soccer) transfer-rumor journalists, agents and media operators. A centralized "second brain" replacing chaotic WhatsApp chats / Excel: preserves historical memory, contractual details and timeline coherence of transfer sagas. Built for the Fabrizio Romano x Emergent Challenge.

## User Choices
- No authentication (direct dashboard access)
- AI-powered Consistency Checker (Claude Sonnet 4.6 via Emergent LLM key)
- Preloaded realistic demo data
- Bilingual interface (English + Italian) with a language toggle
- Design agent full creative freedom → "Italian Sports Pop" dark theme (Navy #0D1B2A, Volt #39FF14, Magenta #FF007F)

## Architecture
- **Backend** FastAPI + MongoDB (motor). Collections: `profiles`, `rumors`, `sources`. UUID string IDs.
  - Endpoints: `/api/profiles`, `/api/profiles/{id}`, `/api/profiles/{id}/rumors`, `POST /api/rumors`, `/api/sources`, `POST /api/sources`, `POST /api/profiles`, `/api/stats`, `POST /api/consistency-check`.
  - Auto-seeds 5 profiles, 6 sources, 12 rumors on startup (idempotent).
  - AI consistency check uses `emergentintegrations` LlmChat → anthropic `claude-sonnet-4-6`, returns strict JSON (has_contradiction, severity, bilingual message + advice). Graceful fallback if LLM unavailable.
- **Frontend** React 19 + Tailwind + lucide-react + sonner. 3-panel command center.
  - `App.js` orchestrates state. `lib/i18n.js` (EN/IT), `lib/api.js`, `lib/stages.js`.
  - Components: Header, PanelA (search + ContractCard + roster + new-rumor btn), Timeline (Panel B), PanelC (ConsistencyWidget + SourceDirectory), NewRumorDialog.

## Implemented (2026-07-02)
- 3-panel dashboard: predictive search, contract card, vertical color-coded rumor timeline, source directory with reliability bars.
- New Rumor dialog with AI consistency audit + persistence.
- AI contradiction detection verified (e.g. free-transfer claim vs active contract → HIGH severity + advice).
- Bilingual EN/IT toggle across all labels.
- Backend: 12/12 pytest passed. Frontend core flows verified via UI.

## Core Requirements (static)
- Preserve transfer saga history chronologically per profile.
- Flag rumors that contradict verified contract data.
- Show source reliability to weigh tips.

## Backlog / Remaining
- P1: Editable profiles/sources UI (CRUD forms) — currently seed + add-rumor only.
- P1: Delete/edit rumors; timeline node editing.
- P2: Filter/sort timeline by stage or source; export saga to PDF/markdown.
- P2: Pagination on profiles/rumors endpoints.
- P2: Dashboard analytics (deals by stage, source accuracy over time).

## Implemented (2026-07-02) — v3 Restructure + AI Radar
- Multi-view app: left Sidebar nav (Dashboard / AI Radar / Profiles / Log Rumor / Sources / Logout) + top global search + language toggle.
- Dashboard = "Latest News" feed (recent rumors across all profiles) + stats + Hot cards.
- Profiles view: grid with Player/Coach role tabs + club filter; distinct coach (cyan) vs player styling.
- Profile detail: header w/ crest, tabs Timeline (cronologia) + Career (career path with club monogram crests & years), Contract Data aside. Back button.
- Club crests = text monograms (colored, no real logos) via lib/clubs.js.
- NEW AI Radar module (simulated global media scanner): Radar Feed (anomaly alerts, Investigate/Dismiss, LIVE Claude "Simulate Scan"), Working Pipeline kanban (Contatti Avviati→Trattativa→Fonti Verificate→Here We Go) with stage moves, Verification Checklist with toggleable tasks. Backend: global_alerts / pipeline / verification_tasks collections; investigate auto-creates pipeline + tasks.
- Seed bumped to v3: 12 profiles (8 players + 4 coaches w/ career_history), 9 sources, 28 rumors, 5 alerts, 4 pipeline, 5 tasks. Idempotent via seed_version meta.
- Verified: 34/34 backend tests + all frontend flows pass (iteration_2).

## Implemented (2026-07-02) — v4 Rename + Article Export + Fake Google Login
- Renamed brand TransferMemory → **MemoryTransfer** (sidebar, login, page title, API root).
- **AI Article Draft export**: POST /api/profiles/{id}/article-draft?lang= — Claude turns a profile's rumor timeline into a publication-ready draft (title + body), shown in a modal with Copy (ArticleDraftDialog.jsx, "Export Draft" button in ProfileView). EN/IT aware.
- **Simulated Google login** (LoginScreen.jsx): client-side only, NO real auth/OAuth/backend — "Continue with Google" gates the app; Logout returns to it. Persisted via localStorage `mt_authed`.

## Implemented (2026-07-04) — v8 Directive: Fonte Zero, Consistency Badge, Trust Audit, Streak Lab
- **Fonte Zero AI Radar**: alert cards show metadata only + green "🔗 Verify Original Source" link (external_link_url, target=_blank). No article text scraped.
- **Contract Mismatch badge** (fuchsia, tooltip) on Dashboard & Profile timeline when a Player's rumor implies a free transfer but contract year > current year (lib/consistency.js, Player-scoped).
- **Sources Trust Audit**: blue verified check for score>85 + "Apply for Verification" mock modal.
- **Streak Lab** (isolated view, sidebar 🔥): mock Google gateway → arena (current/best streak, active daily challenge, SÌ/NO vote with correct++/wrong-reset + toasts) → Top Tipsters leaderboard. Endpoints: /api/challenges/active, /api/streak/me, /api/streak/leaderboard, POST /api/streak/vote.
- Data expanded: 21 profiles (Serie A/B/C + estero, verified_status), 32 rumors, 7 alerts, 6 tipsters, 3 challenges. Twitter-style timestamps everywhere. SEED_VERSION=8.
- Verified: 45/45 backend tests + all frontend flows pass (iteration_3). AI (Claude) live, no mocks.

## Next Tasks
1. Per-source real "Original Source" URLs (source_url on Rumor) instead of google search.
2. Profile/source management UI; rumor & pipeline edit/delete; kanban drag-and-drop.
3. Extract a useTransferMemory hook (App.js growing).
