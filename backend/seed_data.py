"""Demo data for MemoryTransfer — v4 (2026 window, expanded, minor leagues, Twitter-style times)."""

SEED_VERSION = 8

_A = "https://images.pexels.com/photos/10349959/pexels-photo-10349959.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
_B = "https://images.pexels.com/photos/14741747/pexels-photo-14741747.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"

PIPELINE_STAGES = ["Contatti Avviati", "Trattativa", "Fonti Verificate", "Here We Go"]


def _p(**kw):
    return kw


PROFILES = [
    # ---------------- SERIE A PLAYERS ----------------
    _p(id="p-yildiz", full_name="Kenan Yildiz", role="Player", position="Attacking Midfielder", current_club="Juventus", league="Serie A",
       contract_expiry="2029-06-30", estimated_salary="€3.5M / year", representation_agency="IAM Football", nationality="Turkey", age=21, market_value="€90M",
       internal_notes="Crown jewel of the new Juventus. Premier League giants monitoring. Juve consider him untouchable but no clause.",
       image=_A, career_history=[{"club": "Bayern Munich", "from": 2020, "to": 2022}, {"club": "Juventus", "from": 2022, "to": None}]),
    _p(id="p-nicopaz", full_name="Nico Paz", role="Player", position="Attacking Midfielder", current_club="Como", league="Serie A",
       contract_expiry="2028-06-30", estimated_salary="€2M / year", representation_agency="Real Madrid (buy-back)", nationality="Argentina", age=21, market_value="€70M",
       internal_notes="Real Madrid hold a buy-back clause (~€9M rising). Tottenham & Como fighting to keep him. Key 2026 saga.",
       image=_B, career_history=[{"club": "Real Madrid", "from": 2022, "to": 2024}, {"club": "Como", "from": 2024, "to": None}]),
    _p(id="p-castro", full_name="Santiago Castro", role="Player", position="Centre-Forward", current_club="Bologna", league="Serie A",
       contract_expiry="2028-06-30", estimated_salary="€1.5M / year", representation_agency="IDP", nationality="Argentina", age=21, market_value="€40M",
       internal_notes="Breakout striker. Buy-back interest from River Plate noted. Premier & Serie A rivals tracking.",
       image=_A, career_history=[{"club": "Vélez Sarsfield", "from": 2022, "to": 2024}, {"club": "Bologna", "from": 2024, "to": None}]),
    _p(id="p-lookman", full_name="Ademola Lookman", role="Player", position="Winger", current_club="Atalanta", league="Serie A",
       contract_expiry="2027-06-30", estimated_salary="€4M / year", representation_agency="CAA Base", nationality="Nigeria", age=28, market_value="€55M",
       internal_notes="Pushed for a move in 2025; PSG & Premier interest persists into 2026. Atalanta valuation high.",
       image=_B, career_history=[{"club": "Charlton", "from": 2015, "to": 2017}, {"club": "Everton", "from": 2017, "to": 2019}, {"club": "RB Leipzig", "from": 2019, "to": 2020}, {"club": "Atalanta", "from": 2022, "to": None}]),
    _p(id="p-kean", full_name="Moise Kean", role="Player", position="Centre-Forward", current_club="Fiorentina", league="Serie A",
       contract_expiry="2029-06-30", estimated_salary="€4.5M / year", representation_agency="Alessandro Lucci", nationality="Italy", age=26, market_value="€50M",
       internal_notes="Release clause reportedly active in a short window. Saudi & Premier League circling.",
       image=_A, career_history=[{"club": "Juventus", "from": 2016, "to": 2019}, {"club": "PSG", "from": 2019, "to": 2021}, {"club": "Everton", "from": 2020, "to": 2021}, {"club": "Fiorentina", "from": 2024, "to": None}]),
    _p(id="p-lucca", full_name="Lorenzo Lucca", role="Player", position="Centre-Forward", current_club="Napoli", league="Serie A",
       contract_expiry="2030-06-30", estimated_salary="€2.5M / year", representation_agency="Giuffredi", nationality="Italy", age=25, market_value="€35M",
       internal_notes="Rose from Serie C (Palermo) & Serie B (Pisa) to Napoli. Backup role under review for 2026.",
       image=_B, career_history=[{"club": "Palermo", "from": 2019, "to": 2021}, {"club": "Pisa", "from": 2021, "to": 2022}, {"club": "Udinese", "from": 2022, "to": 2025}, {"club": "Napoli", "from": 2025, "to": None}]),
    _p(id="p-pioesposito", full_name="Francesco Pio Esposito", role="Player", position="Centre-Forward", current_club="Inter", league="Serie A",
       contract_expiry="2030-06-30", estimated_salary="€1.2M / year", representation_agency="Tullio Tinti", nationality="Italy", age=20, market_value="€30M",
       internal_notes="Serie B top scorer with Spezia in 2025, now integrated at Inter. Loan-vs-stay debate for 2026.",
       image=_A, career_history=[{"club": "Spezia", "from": 2024, "to": 2025}, {"club": "Inter", "from": 2025, "to": None}]),
    # ---------------- SERIE B PLAYERS (SERIE MINORI) ----------------
    _p(id="p-brunori", full_name="Matteo Brunori", role="Player", position="Centre-Forward", current_club="Palermo", league="Serie B",
       contract_expiry="2027-06-30", estimated_salary="€0.8M / year", representation_agency="Independent", nationality="Italy", age=31, market_value="€6M",
       internal_notes="Palermo captain & talisman. Serie A clubs (Cagliari, Parma) monitor if promotion fails.",
       image=_B, career_history=[{"club": "Juventus U23", "from": 2019, "to": 2020}, {"club": "Pescara", "from": 2020, "to": 2021}, {"club": "Palermo", "from": 2021, "to": None}]),
    _p(id="p-coda", full_name="Massimo Coda", role="Player", position="Centre-Forward", current_club="Sampdoria", league="Serie B",
       contract_expiry="2026-06-30", estimated_salary="€0.7M / year", representation_agency="Independent", nationality="Italy", age=37, market_value="€1.2M",
       internal_notes="Prolific Serie B veteran. Contract expiring 2026 — free-agent watch for promotion chasers.",
       image=_A, career_history=[{"club": "Benevento", "from": 2017, "to": 2020}, {"club": "Lecce", "from": 2020, "to": 2022}, {"club": "Genoa", "from": 2022, "to": 2023}, {"club": "Cremonese", "from": 2023, "to": 2024}, {"club": "Sampdoria", "from": 2024, "to": None}]),
    _p(id="p-biasci", full_name="Tommaso Biasci", role="Player", position="Centre-Forward", current_club="Catanzaro", league="Serie B",
       contract_expiry="2027-06-30", estimated_salary="€0.4M / year", representation_agency="Independent", nationality="Italy", age=31, market_value="€3M",
       internal_notes="Catanzaro's Serie B goal machine. Several second-tier clubs interested; low fee.",
       image=_B, career_history=[{"club": "Carrarese", "from": 2018, "to": 2021}, {"club": "Catanzaro", "from": 2022, "to": None}]),
    _p(id="p-cerri", full_name="Alberto Cerri", role="Player", position="Centre-Forward", current_club="Como", league="Serie A",
       contract_expiry="2026-06-30", estimated_salary="€0.9M / year", representation_agency="Independent", nationality="Italy", age=29, market_value="€2.5M",
       internal_notes="Journeyman striker; Serie B suitors (Palermo, Bari) if not renewed by Como.",
       image=_A, career_history=[{"club": "Cagliari", "from": 2018, "to": 2021}, {"club": "SPAL", "from": 2021, "to": 2022}, {"club": "Como", "from": 2022, "to": None}]),
    # ---------------- SERIE C PLAYERS (SERIE MINORI) ----------------
    _p(id="p-patierno", full_name="Cosimo Patierno", role="Player", position="Centre-Forward", current_club="Avellino", league="Serie C",
       contract_expiry="2027-06-30", estimated_salary="€0.2M / year", representation_agency="Independent", nationality="Italy", age=34, market_value="€0.8M",
       internal_notes="Serie C top scorer with Avellino. Promotion push; Serie B clubs scouting.",
       image=_B, career_history=[{"club": "Bisceglie", "from": 2019, "to": 2021}, {"club": "Vicenza", "from": 2022, "to": 2023}, {"club": "Avellino", "from": 2023, "to": None}]),
    _p(id="p-gliozzi", full_name="Ettore Gliozzi", role="Player", position="Centre-Forward", current_club="Cesena", league="Serie B",
       contract_expiry="2026-06-30", estimated_salary="€0.3M / year", representation_agency="Independent", nationality="Italy", age=30, market_value="€1M",
       internal_notes="Reliable second-tier striker; expiring deal, free-agent interest from Serie C promotion contenders.",
       image=_A, career_history=[{"club": "Monza", "from": 2019, "to": 2021}, {"club": "Modena", "from": 2022, "to": 2024}, {"club": "Cesena", "from": 2024, "to": None}]),
    # ---------------- ABROAD (SERIE A LINKS) ----------------
    _p(id="p-calafiori", full_name="Riccardo Calafiori", role="Player", position="Centre-Back", current_club="Arsenal", league="Premier League",
       contract_expiry="2029-06-30", estimated_salary="€5M / year", representation_agency="CAA Stellar", nationality="Italy", age=23, market_value="€55M",
       internal_notes="Serie A clubs dream of a return. Arsenal not selling. Bologna/Roma retain sell-on interest.",
       image=_B, career_history=[{"club": "AS Roma", "from": 2020, "to": 2022}, {"club": "Genoa", "from": 2022, "to": 2023}, {"club": "Basel", "from": 2023, "to": 2023}, {"club": "Bologna", "from": 2023, "to": 2024}, {"club": "Arsenal", "from": 2024, "to": None}]),
    _p(id="p-zirkzee", full_name="Joshua Zirkzee", role="Player", position="Centre-Forward", current_club="Manchester United", league="Premier League",
       contract_expiry="2029-06-30", estimated_salary="€4.5M / year", representation_agency="Kia Joorabchian", nationality="Netherlands", age=25, market_value="€35M",
       internal_notes="Struggling for minutes at Old Trafford. Serie A return (Juventus, Milan) a hot 2026 storyline.",
       image=_A, career_history=[{"club": "Bayern Munich", "from": 2019, "to": 2022}, {"club": "Bologna", "from": 2022, "to": 2024}, {"club": "Manchester United", "from": 2024, "to": None}]),
    _p(id="p-osimhen", full_name="Victor Osimhen", role="Player", position="Centre-Forward", current_club="Galatasaray", league="Süper Lig",
       contract_expiry="2026-06-30", estimated_salary="€15M / year", representation_agency="Roberto Calenda", nationality="Nigeria", age=27, market_value="€75M",
       internal_notes="On loan/permanent at Galatasaray after Napoli exit. Premier & Serie A clubs plotting a 2026 move.",
       image=_B, career_history=[{"club": "Lille", "from": 2019, "to": 2020}, {"club": "Napoli", "from": 2020, "to": 2025}, {"club": "Galatasaray", "from": 2025, "to": None}]),
    # ---------------- COACHES ----------------
    _p(id="c-fabregas", full_name="Cesc Fàbregas", role="Coach", position="Head Coach", current_club="Como", league="Serie A",
       contract_expiry="2028-06-30", estimated_salary="€2.5M / year", representation_agency="Independent", nationality="Spain", age=39, market_value="—",
       internal_notes="Most coveted young coach in Europe. Premier League giants tempted; Como building a project around him.",
       image=_A, career_history=[{"club": "Como (assistant)", "from": 2023, "to": 2024}, {"club": "Como", "from": 2024, "to": None}]),
    _p(id="c-conte", full_name="Antonio Conte", role="Coach", position="Head Coach", current_club="Napoli", league="Serie A",
       contract_expiry="2027-06-30", estimated_salary="€7M / year", representation_agency="Federico Pastorello", nationality="Italy", age=56, market_value="—",
       internal_notes="Delivered at Napoli. Recurrent links to national teams & Premier clubs each window.",
       image=_B, career_history=[{"club": "Juventus", "from": 2011, "to": 2014}, {"club": "Chelsea", "from": 2016, "to": 2018}, {"club": "Inter", "from": 2019, "to": 2021}, {"club": "Tottenham", "from": 2021, "to": 2023}, {"club": "Napoli", "from": 2024, "to": None}]),
    _p(id="c-gilardino", full_name="Alberto Gilardino", role="Coach", position="Head Coach", current_club="Free Agent", league="—",
       contract_expiry="", estimated_salary="€1.5M / year (target)", representation_agency="Independent", nationality="Italy", age=44, market_value="—",
       internal_notes="Free after Genoa spell. Serie A mid-table & ambitious Serie B clubs interested for 2026.",
       image=_A, career_history=[{"club": "Genoa (Primavera)", "from": 2021, "to": 2022}, {"club": "Genoa", "from": 2022, "to": 2024}]),
    _p(id="c-grosso", full_name="Fabio Grosso", role="Coach", position="Head Coach", current_club="Sassuolo", league="Serie A",
       contract_expiry="2026-06-30", estimated_salary="€1.8M / year", representation_agency="Independent", nationality="Italy", age=48, market_value="—",
       internal_notes="Won promotion with Sassuolo. Contract expiring — renewal talks vs. a bigger job.",
       image=_B, career_history=[{"club": "Frosinone", "from": 2021, "to": 2023}, {"club": "Lyon", "from": 2023, "to": 2023}, {"club": "Sassuolo", "from": 2024, "to": None}]),
    _p(id="c-dionisi", full_name="Alessio Dionisi", role="Coach", position="Head Coach", current_club="Palermo", league="Serie B",
       contract_expiry="2026-06-30", estimated_salary="€1.2M / year", representation_agency="Independent", nationality="Italy", age=46, market_value="—",
       internal_notes="Under pressure to deliver Palermo promotion. Job security a live topic; Serie B rivals watching.",
       image=_A, career_history=[{"club": "Empoli", "from": 2020, "to": 2021}, {"club": "Sassuolo", "from": 2021, "to": 2024}, {"club": "Palermo", "from": 2024, "to": None}]),
]

SOURCES = [
    {"id": "s-romano", "source_name": "Fabrizio Romano", "reliability_score": 96, "notes": "Tier 1. 'Here we go' standard. Rarely wrong on done deals."},
    {"id": "s-dimarzio", "source_name": "Gianluca Di Marzio", "reliability_score": 92, "notes": "Tier 1. Excellent on Serie A negotiations."},
    {"id": "s-sky", "source_name": "Sky Sport Italia", "reliability_score": 90, "notes": "Broadcaster. Strong on medicals & official confirmations."},
    {"id": "s-schira", "source_name": "Nicolò Schira", "reliability_score": 87, "notes": "Strong on contracts, salaries & Serie B/C moves."},
    {"id": "s-moretto", "source_name": "Matteo Moretto", "reliability_score": 85, "notes": "Reliable on La Liga <-> Serie A movements."},
    {"id": "s-pedulla", "source_name": "Alfredo Pedullà", "reliability_score": 83, "notes": "Veteran. Great on lower-league & Serie B deals."},
    {"id": "s-longari", "source_name": "Gianluigi Longari", "reliability_score": 80, "notes": "Sportitalia. Solid on Serie A/B targets."},
    {"id": "s-galetti", "source_name": "Rudy Galetti", "reliability_score": 78, "notes": "Good on emerging targets, occasional misses."},
    {"id": "s-tuttosport", "source_name": "Tuttosport", "reliability_score": 62, "notes": "Turin-based. Juventus bias, sometimes optimistic."},
    {"id": "s-twitter-itk", "source_name": "Anonymous ITK (X)", "reliability_score": 31, "notes": "Unverified insider. Treat with heavy caution."},
]

# age_min = minutes ago from 'now' (computed at seed time) so the feed always looks live.
RUMORS = [
    # Nico Paz (hot 2026 saga)
    {"profile_id": "p-nicopaz", "age_min": 35, "stage": "Trattativa Avanzata", "source_name": "Fabrizio Romano", "deal_formula": "Definitive", "evolution_description": "Tottenham accelerate for Nico Paz. Talks with Como ongoing; Real Madrid's buy-back window is the key variable."},
    {"profile_id": "p-nicopaz", "age_min": 1500, "stage": "Contatti", "source_name": "Matteo Moretto", "deal_formula": "Definitive", "evolution_description": "Real Madrid weighing whether to trigger the buy-back or leave Nico Paz at Como for another season."},
    {"profile_id": "p-nicopaz", "age_min": 14000, "stage": "Interesse Iniziale", "source_name": "Sky Sport Italia", "deal_formula": "Definitive", "evolution_description": "Premier League clubs register interest in Como's Argentine gem after a stellar campaign."},
    # Kenan Yildiz
    {"profile_id": "p-yildiz", "age_min": 120, "stage": "Interesse Iniziale", "source_name": "Fabrizio Romano", "deal_formula": "Definitive", "evolution_description": "Arsenal and Chelsea admire Kenan Yildiz. Juventus consider him non-negotiable; no release clause exists."},
    {"profile_id": "p-yildiz", "age_min": 8000, "stage": "Contatti", "source_name": "Tuttosport", "deal_formula": "Definitive", "evolution_description": "Juventus open renewal talks to raise Yildiz's salary and fend off Premier League interest."},
    # Santiago Castro
    {"profile_id": "p-castro", "age_min": 240, "stage": "Contatti", "source_name": "Gianluca Di Marzio", "deal_formula": "Definitive", "evolution_description": "Bologna receive first enquiries for Santiago Castro. River Plate's buy-back detail complicates any sale."},
    {"profile_id": "p-castro", "age_min": 20000, "stage": "Interesse Iniziale", "source_name": "Nicolò Schira", "deal_formula": "Definitive", "evolution_description": "Napoli and Milan scouts logging Castro's minutes as a long-term No.9 option."},
    # Moise Kean
    {"profile_id": "p-kean", "age_min": 90, "stage": "Trattativa Avanzata", "source_name": "Alfredo Pedullà", "deal_formula": "Definitive", "evolution_description": "Kean's short-window release clause is active. A Saudi Pro League club tables a huge salary; Fiorentina brace."},
    {"profile_id": "p-kean", "age_min": 5000, "stage": "Contatti", "source_name": "Sky Sport Italia", "deal_formula": "Definitive", "evolution_description": "Premier League sides ask about Kean's clause terms and payment structure."},
    # Ademola Lookman
    {"profile_id": "p-lookman", "age_min": 300, "stage": "Contatti", "source_name": "Fabrizio Romano", "deal_formula": "Definitive", "evolution_description": "PSG revive their interest in Lookman. Atalanta's valuation remains firmly above €50M."},
    {"profile_id": "p-lookman", "age_min": 30000, "stage": "Saltata", "source_name": "Anonymous ITK (X)", "deal_formula": "Definitive", "evolution_description": "Reported agreement with a Premier club falls through; Atalanta deny any deal was close."},
    # Lucca
    {"profile_id": "p-lucca", "age_min": 600, "stage": "Interesse Iniziale", "source_name": "Gianluigi Longari", "deal_formula": "Loan", "evolution_description": "With limited minutes at Napoli, Serie A sides explore a loan for Lorenzo Lucca to guarantee playing time."},
    # Pio Esposito
    {"profile_id": "p-pioesposito", "age_min": 180, "stage": "Contatti", "source_name": "Nicolò Schira", "deal_formula": "Loan", "evolution_description": "Inter debate keeping Pio Esposito or a top-flight loan. Fiorentina and Bologna enquire about a season-long move."},
    {"profile_id": "p-pioesposito", "age_min": 26000, "stage": "Interesse Iniziale", "source_name": "Sky Sport Italia", "deal_formula": "Loan", "evolution_description": "After his Serie B goals with Spezia, several clubs ask Inter about Esposito's availability."},
    # Osimhen return
    {"profile_id": "p-osimhen", "age_min": 55, "stage": "Contatti", "source_name": "Fabrizio Romano", "deal_formula": "Definitive", "evolution_description": "With his Galatasaray deal expiring, Premier League clubs and Juventus reopen the Osimhen file for 2026."},
    {"profile_id": "p-osimhen", "age_min": 40000, "stage": "Interesse Iniziale", "source_name": "Matteo Moretto", "deal_formula": "Definitive", "evolution_description": "Osimhen's entourage signals openness to a return to a top European league next summer."},
    # Zirkzee return
    {"profile_id": "p-zirkzee", "age_min": 75, "stage": "Trattativa Avanzata", "source_name": "Fabrizio Romano", "deal_formula": "Loan with obligation", "evolution_description": "Juventus push for Zirkzee on a loan with obligation. Man United open to a temporary exit to relaunch him."},
    {"profile_id": "p-zirkzee", "age_min": 4300, "stage": "Contatti", "source_name": "Gianluca Di Marzio", "deal_formula": "Loan", "evolution_description": "Milan also enquire about Zirkzee. United want to cover a chunk of the wages in any loan."},
    # Calafiori
    {"profile_id": "p-calafiori", "age_min": 900, "stage": "Interesse Iniziale", "source_name": "Sky Sport Italia", "deal_formula": "Definitive", "evolution_description": "Italian clubs dream of bringing Calafiori back, but Arsenal firmly reject any approach."},
    # --- SERIE B / C ---
    {"profile_id": "p-brunori", "age_min": 210, "stage": "Contatti", "source_name": "Alfredo Pedullà", "deal_formula": "Definitive", "evolution_description": "Cagliari and Parma monitor Palermo captain Brunori should the rosanero miss promotion again."},
    {"profile_id": "p-brunori", "age_min": 33000, "stage": "Interesse Iniziale", "source_name": "Gianluigi Longari", "deal_formula": "Definitive", "evolution_description": "Serie A newly-promoted sides note Brunori as a proven Serie B goalscorer at an affordable fee."},
    {"profile_id": "p-coda", "age_min": 480, "stage": "Contatti", "source_name": "Nicolò Schira", "deal_formula": "Free Transfer", "evolution_description": "Coda's Sampdoria contract expires in 2026. Promotion-chasing Serie B clubs eye a free-agent swoop."},
    {"profile_id": "p-biasci", "age_min": 1300, "stage": "Interesse Iniziale", "source_name": "Alfredo Pedullà", "deal_formula": "Definitive", "evolution_description": "Catanzaro's Biasci attracts interest from mid-table Serie B sides looking for a low-cost No.9."},
    {"profile_id": "p-gliozzi", "age_min": 2600, "stage": "Contatti", "source_name": "Gianluigi Longari", "deal_formula": "Free Transfer", "evolution_description": "Cesena's Gliozzi, out of contract in 2026, is a target for Serie C promotion contenders."},
    {"profile_id": "p-patierno", "age_min": 150, "stage": "Interesse Iniziale", "source_name": "Alfredo Pedullà", "deal_formula": "Definitive", "evolution_description": "Avellino's Serie C top scorer Patierno is scouted by several Serie B clubs; low release cost."},
    {"profile_id": "p-cerri", "age_min": 3300, "stage": "Contatti", "source_name": "Nicolò Schira", "deal_formula": "Free Transfer", "evolution_description": "With his Como deal expiring, Serie B sides Palermo and Bari sound out Alberto Cerri."},
    # --- COACHES ---
    {"profile_id": "c-fabregas", "age_min": 65, "stage": "Interesse Iniziale", "source_name": "Fabrizio Romano", "deal_formula": "Free Transfer", "evolution_description": "A Premier League giant makes discreet contact over Cesc Fàbregas. Como determined to keep their coach."},
    {"profile_id": "c-fabregas", "age_min": 9000, "stage": "Contatti", "source_name": "Matteo Moretto", "deal_formula": "Free Transfer", "evolution_description": "Fàbregas' entourage listens but signals loyalty to the Como project for now."},
    {"profile_id": "c-grosso", "age_min": 700, "stage": "Contatti", "source_name": "Gianluca Di Marzio", "deal_formula": "Free Transfer", "evolution_description": "Sassuolo want to extend Grosso after promotion, but a bigger Serie A club has made an approach."},
    {"profile_id": "c-gilardino", "age_min": 1800, "stage": "Interesse Iniziale", "source_name": "Sky Sport Italia", "deal_formula": "Free Transfer", "evolution_description": "Free agent Gilardino shortlisted by two Serie A mid-table sides and an ambitious Serie B club."},
    {"profile_id": "c-dionisi", "age_min": 260, "stage": "Contatti", "source_name": "Tuttosport", "deal_formula": "Free Transfer", "evolution_description": "Palermo's board back Dionisi for now, but Serie B rivals monitor the situation closely."},
    # Deliberate contradiction demo: free-transfer claim while contract runs beyond current year
    {"profile_id": "p-lookman", "age_min": 20, "stage": "Contatti", "source_name": "Anonymous ITK (X)", "deal_formula": "Free Transfer", "evolution_description": "Unverified report claims Lookman could leave Atalanta as a free agent this summer on a free transfer."},
]

# age_min for created_at (Twitter-style live times)
GLOBAL_ALERTS = [
    {"id": "a-yildiz", "player_name": "Kenan Yildiz", "current_club": "Juventus", "flagged_country": "Turkey", "anomaly_score": "High", "status": "New", "age_min": 12,
     "automated_summary": "AI Alert: 5 Turkish outlets spiked Yildiz mentions in the last 12 mins, citing a rumored Premier League 'megabid' meeting."},
    {"id": "a-nicopaz", "player_name": "Nico Paz", "current_club": "Como", "flagged_country": "Spain", "anomaly_score": "High", "status": "New", "age_min": 40,
     "automated_summary": "AI Alert: Spanish radio (COPE, SER) + 3 outlets report Real Madrid internal debate on the buy-back. Frequency anomaly detected over 40 mins."},
    {"id": "a-patierno", "player_name": "Cosimo Patierno", "current_club": "Avellino", "flagged_country": "Italy", "anomaly_score": "Medium", "status": "New", "age_min": 95,
     "automated_summary": "AI Alert: Regional Campania media (+180% in 90 mins) link Serie C top scorer Patierno with a Serie B promotion push."},
    {"id": "a-brunori", "player_name": "Matteo Brunori", "current_club": "Palermo", "flagged_country": "Italy", "anomaly_score": "Medium", "status": "New", "age_min": 210,
     "automated_summary": "AI Alert: Sicilian outlets report Cagliari scouts at Palermo's last match. Mention cluster around a summer exit."},
    {"id": "a-kean", "player_name": "Moise Kean", "current_club": "Fiorentina", "flagged_country": "Saudi Arabia", "anomaly_score": "High", "status": "Investigating", "age_min": 320,
     "automated_summary": "AI Alert: Arabic-language sports media surge (+240%) around Kean's release clause. A Pro League club reportedly ready to pay in full."},
    {"id": "a-baturina", "player_name": "Martin Baturina", "current_club": "Dinamo Zagreb", "flagged_country": "Croatia", "anomaly_score": "High", "status": "Investigating", "age_min": 1400,
     "automated_summary": "AI Alert: 3 Croatian outlets + 1 Italian confirm Serie A scouts attended two matches. 12h frequency anomaly."},
    {"id": "a-simeone", "player_name": "Giovanni Simeone", "current_club": "Torino", "flagged_country": "Argentina", "anomaly_score": "Low", "status": "Verified", "age_min": 3000,
     "automated_summary": "AI Alert: Minor Argentine-media uptick on Simeone. Single reliable source cross-referenced; low urgency."},
]

PIPELINE = [
    {"id": "pl-1", "player_name": "Nico Paz", "target_club": "Tottenham", "source_origin": "Italy (Romano)", "priority_tier": "A", "stage": "Trattativa", "age_min": 30,
     "exclusive_angle_notes": "Angle: the buy-back timing is the story. Get Real Madrid's stance + Como's counter-plan."},
    {"id": "pl-2", "player_name": "Moise Kean", "target_club": "Saudi Pro League", "source_origin": "Saudi Arabia (Arabic media)", "priority_tier": "A", "stage": "Fonti Verificate", "age_min": 200,
     "exclusive_angle_notes": "Angle: confirm the clause figure & window. Need Lucci (agent) quote before publishing."},
    {"id": "pl-3", "player_name": "Cosimo Patierno", "target_club": "Serie B (TBD)", "source_origin": "Italy (Pedullà)", "priority_tier": "C", "stage": "Contatti Avviati", "age_min": 90,
     "exclusive_angle_notes": "Angle: lower-league gem story. Which Serie B club moves first? Cheap fee = fast deal."},
    {"id": "pl-4", "player_name": "Joshua Zirkzee", "target_club": "Juventus", "source_origin": "England (Romano)", "priority_tier": "A", "stage": "Here We Go", "age_min": 70,
     "exclusive_angle_notes": "Ready to publish: loan-with-obligation agreed in principle. Prep the return-to-Serie-A graphic."},
]

# due_in_days relative to now (negative = overdue)
VERIFICATION_TASKS = [
    {"id": "t-1", "pipeline_id": "pl-1", "player_name": "Nico Paz", "action_required": "Confirm Real Madrid buy-back exact figure & deadline", "due_in_days": 1, "is_done": False},
    {"id": "t-2", "pipeline_id": "pl-1", "player_name": "Nico Paz", "action_required": "Get Como sporting director on record", "due_in_days": 2, "is_done": False},
    {"id": "t-3", "pipeline_id": "pl-2", "player_name": "Moise Kean", "action_required": "Verify Kean release-clause window with a second source", "due_in_days": 0, "is_done": False},
    {"id": "t-4", "pipeline_id": "pl-3", "player_name": "Cosimo Patierno", "action_required": "Check Avellino asking price & contract length in database", "due_in_days": 3, "is_done": False},
    {"id": "t-5", "pipeline_id": "pl-4", "player_name": "Joshua Zirkzee", "action_required": "Get final confirmation on wage split before publishing", "due_in_days": -1, "is_done": True},
    {"id": "t-6", "pipeline_id": "pl-2", "player_name": "Moise Kean", "action_required": "Cross-check Arabic-media reports with agent Lucci", "due_in_days": 1, "is_done": True},
]

# ---------------- STREAK LAB (isolated gamification) ----------------
VERIFIED_PROFILE_IDS = {"p-yildiz", "p-nicopaz", "p-kean", "p-lookman", "p-osimhen", "p-zirkzee", "p-calafiori", "c-conte", "c-fabregas"}

STREAK_USERS = [
    {"id": "u-you", "mock_username": "You", "current_streak": 4, "highest_streak": 9},
    {"id": "u-1", "mock_username": "@MercatoMaster", "current_streak": 12, "highest_streak": 28},
    {"id": "u-2", "mock_username": "@TifosoVerace", "current_streak": 7, "highest_streak": 21},
    {"id": "u-3", "mock_username": "@GialloRossoITK", "current_streak": 0, "highest_streak": 18},
    {"id": "u-4", "mock_username": "@NerazzurroNews", "current_streak": 5, "highest_streak": 15},
    {"id": "u-5", "mock_username": "@CalcioProphet", "current_streak": 3, "highest_streak": 11},
]

DAILY_CHALLENGES = [
    {"id": "ch-1", "question_text": "Will Joshua Zirkzee complete his loan move to Juventus before Friday?", "correct_answer": "SI", "is_active": True},
    {"id": "ch-2", "question_text": "Will Real Madrid trigger the Nico Paz buy-back this summer?", "correct_answer": "NO", "is_active": False},
    {"id": "ch-3", "question_text": "Will Cesc Fàbregas leave Como for a Premier League club in 2026?", "correct_answer": "NO", "is_active": False},
]
