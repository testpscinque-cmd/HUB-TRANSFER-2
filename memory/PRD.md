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

## Next Tasks
1. Add profile & source management UI.
2. Rumor edit/delete.
3. Saga export for article drafting.
