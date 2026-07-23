# TransferHub — Serie A Edition (PRD)

## Prodotto
App operativa calciomercato **mobile-first**, dark/glass, feel "FIFA/Football Manager". Perimetro dati: **SOLO Serie A** (20 squadre, ~96 giocatori curati, 20 allenatori). Lingua: Italiano.
Rebrand da "MemoryTransfer" (tema chiaro Fantacalcio, ora archiviato) deciso dall'utente il 2026-07-21.

## Stack & Architettura
- Backend FastAPI + MongoDB. NESSUN LLM (matchmaker e dossier deterministici → zero crediti).
- Frontend React (CRA), Tailwind, dark theme (`index.css` app-bg + .glass), bottom nav.
- Seed curato in `backend/seed_data.py` (SEED_VERSION per re-seed). Bump versione per aggiornare i dati.

## Dati (fasce a 3 livelli, non numeriche)
- Squadre: `wealth_tier` = Budget Alto | Bilanciato | Autofinanziamento (+ budget_m, wage_space_m)
- Giocatori: `value_tier` = Top | Media | Accessibile (+ salary, market_value, extracomunitario)
- Matchmaker output: Alta (verde) | Media (giallo) | Bassa (rosso)
- Colori status notizie: grigio=rumor, giallo=trattativa, verde=ufficiale.

## Endpoint backend
- GET /api/teams, /api/players (q,team,role,tier), /api/coaches, /api/profile/{id} (player o coach + team_info + timeline)
- POST /api/matchmaker {player_query, team_query} → feasibility + db_status (fonti collegate/verificate)
- GET /api/news/live?q=&limit= → **Google News RSS reale** (gratis), con flag verified Tier1 + stage/colore da titolo
- GET /api/news/videos → video MOCK (YouTube-style)
- Tier1 auto-verificate: Fabrizio Romano, Sky Sport, Gianluca Di Marzio, Gazzetta.

## Frontend (implementato 2026-07-21, verificato con screenshot, 0 errori runtime)
- **BottomNav**: Dashboard | Profili | Workspace.
- **Dashboard**: Matchmaker sticky (2 input + MATCH SCOOP → modale fattibilità con micro-loading 0.5s + stato DB) · ricerca notizie per qualunque keyword/fonte · pill ALL/POST/VIDEO · feed live (post Google News reali + video mock) · fonte ben visibile + spunta verde Tier1 + status bar + "Vai a".
- **Profili**: tab Giocatori/Allenatori, ricerca + filtro squadra, card con cutout stilizzato + fascia valore.
- **ProfileScreen**: split view (cutout + anagrafica, --- se manca dato) + badge fascia/extracom + **Linea Evolutiva** (stepper cronologico con fonti verificate) + bottone Salva (watchlist).
- **Workspace**: scelta ruolo persistente (localStorage) → **Direttore Sportivo** (budget/ingaggi editabili, acquisto/cessione, alert deficit rosso, rosa a cassetti per ruolo, "Vedi Rosa Finale") · **Giornalista** (watchlist colonne da localStorage + "Esporta Dossier" testo copiabile con anagrafiche + news verificate).

## Backlog / P1 (prossimi passi)
- VIDEO scanner reale (serve chiave YouTube Data API — chiedere all'utente).
- Ampliare rose (tutti i ~500 giocatori) e dati contrattuali reali (API-Football se chiave disponibile).
- Cutout PNG reali dei giocatori (ora avatar monogramma stilizzati, come concordato).
- Watchlist: creazione colonne custom + bookmark diretto delle news dal feed (ora si salvano i profili).
- Legare la timeline profilo alle news live per keyword (ora usa UPDATES seed per le saghe principali).

## Note
- Update 2026-07-24 (v2 impatto contest):
  - **Hero home ridisegnato** (bold, headline grande + foto stadio + stats) per una thumbnail 16:9 d'impatto nella griglia contest.
  - **News molto arricchite**: +18 post curati con testate nuove (DAZN, Pedullà, SportItalia, TMW, Corriere dello Sport, Relevo, The Athletic, L'Équipe, Il Mattino…); TIER1 ampliato; 40+ item nel feed.
  - **Video con anteprima foto** + 2 video in più.
  - **Avatar tinta-squadra ovunque** (`TEAM_COLORS`/`teamColor`; PlayerCutout prop `team`).
  - **DS trattativa**: modale con **costo cartellino + ingaggio** (acquisto E cessione) applicati a budget/monte ingaggi; **giocatore custom fuori Serie A**.
  - **Giornalista**: **Breaking Studio** (annunci pronti stile Romano, copia + "Su X") + **colonna Screening Live a destra** con salva scoop.
  - Ripristinate **Streak Lab** e **Verified** in nav.
- Update 2026-07-24 (upgrade "best of old+new", budget elevato):
  - **Backend feed curato**: `CURATED_NEWS` (~25 post stile X: Romano, Sky, Di Marzio, Gazzetta…) in `seed_data.py`; `/news/live` fonde curati + Google News (ricerca SEMPRE popolata); nuovo `/news/official`.
  - **Dashboard**: hero compatto con foto stadio + stat pills (Giocatori/Trattative/Ufficiali/Fonti); striscia **Ufficialità** (Here we go); **card notizie bianche stile X** (avatar fonte + spunta + orario visibile + chip giocatore); Matchmaker→"Vedi notizie collegate"; modali in **portal** (fix risultato in mezzo alla pagina); auto-refresh.
  - **Profili/Database**: filtri Ruolo/Nazione/Fascia responsive (fix dipendenze useMemo + flex-wrap mobile).
  - **ProfileScreen**: riscritto **dark coerente** (FIX bug schermata bianca del rollback) con avatar grigio FIFA, **Termometro trattativa**, banner **Here we go**, timeline evolutiva, Simula DS + Salva→Giornalista.
  - **bits.jsx**: `PlayerCutout` ora silhouette grigia stile FIFA; nuovo `Thermometer`.
  - **Workspace DS**: **campo da gioco** (formazione POR/DIF/CEN/ATT) + **campi editabili** (nome/ingaggio/valore, matita→salva).
  - **Tema** più chiaro/pop; rimosso toggle Light mode; nav ridotta alle 3 sezioni core (Home/Database/Workspace) anche su mobile.
  - **PENDENTI (non fatti)**: traduzione EN/IT completa (i18n, lavoro grosso); Dossier PDF (era stato tolto da un rollback, non reinserito).
- Update 2026-07-21 (rebrand + link consegna):
  - **Rebrand "HUB TRANSFER"** (HUB verde) ovunque: SideNav, hero Dashboard mobile, titolo Dashboard desktop (ex "Dashboard").
  - **Collegamenti dal profilo**: badge "Simula DS →" sulla squadra → apre Workspace in modalità DS; pulsante "Salva" → salva in Watchlist (Radar) e apre Workspace Giornalista (via `th_role` in localStorage + `go`).
- Update 2026-07-21 (rose + ciliegina):
  - **Rose DS ampliate**: DB da 96 → **212 giocatori** (8-15 per squadra, tutte le 20 rose piene con titolari + riserve principali). SEED_VERSION 30 → **31** (re-seed Mongo automatico allo start del backend).
  - **Ciliegina "Here we go!"**: badge verde pulsante alla Fabrizio Romano sulle news con stato **Ufficiale + fonte verificata** (`herewego-*`).
  - **Layout desktop**: sezioni allineate a sinistra (`lg:mx-0 lg:pl-10`, non più centrate).
- Update 2026-07-21 (batch UI/FIFA):
  - **Sidebar desktop** (`SideNav.jsx`, visibile da `lg:`) con logo + nav verticale; bottom nav resta su mobile (`lg:hidden`). Contenuto shiftato con `lg:pl-60`.
  - **Dashboard FIFA/EA**: hero con gradient verde neon + griglia campo + badge LIVE pulsante; news card con accento colorato a sinistra per stato + flag pill (Rumor/Trattativa/Ufficiale) + hover-lift.
  - **Auto-refresh feed**: polling 60s, badge "N nuove notizie · tocca per aggiornare" che carica il feed fresco senza sostituirlo automaticamente (`new-news-badge`).
  - **Workspace**: sostituito "Cambia ruolo" con toggle segmentato **DS | Giornalista** (`role-toggle-ds`/`role-toggle-journalist`).
  - **Giornalista**: barra di ricerca rifatta (full-width prominente, riga "Salva in lista" separata) + **flag** (badge squadra + chip ruolo colorato POR/DIF/CEN/ATT; chip "Scoop" per news salvate) su risultati e watchlist.
- Fix 2026-07-21: "Esporta Dossier" (Giornalista) — mancava il modale che mostra il testo generato; aggiunto modale con textarea + "Copia negli appunti" (fallback execCommand per iframe). Verificato con screenshot e2e. Icona ruolo Giornalista resa neutra (niente blu).
- App già in PRODUZIONE (redeploy necessario per pubblicare le modifiche + aggiornare la thumbnail in griglia). Preview = ambiente di sviluppo.
- Nessuna autenticazione (rimossa nel pivot). Nessuna chiave richiesta finché i video restano mock.
