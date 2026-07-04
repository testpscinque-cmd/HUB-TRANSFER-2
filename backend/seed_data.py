"""Demo data for MemoryTransfer — v5 (2026/2027 window, expanded DB, rotating challenges)."""

SEED_VERSION = 12

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
    # ---------------- 2026/2027 EXPANSION — SERIE A STARS ----------------
    _p(id="p-vlahovic", full_name="Dušan Vlahović", role="Player", position="Centre-Forward", current_club="Juventus", league="Serie A",
       contract_expiry="2026-06-30", estimated_salary="€12M / year", representation_agency="Darko Ristić", nationality="Serbia", age=26, market_value="€40M",
       internal_notes="MASSIVE 2026 saga: contract expires June 2026, no renewal agreed. Free-agent watch — Premier League & Saudi circling. Juve may cash in this window.",
       image=_A, career_history=[{"club": "Partizan", "from": 2016, "to": 2018}, {"club": "Fiorentina", "from": 2018, "to": 2022}, {"club": "Juventus", "from": 2022, "to": None}]),
    _p(id="p-leao", full_name="Rafael Leão", role="Player", position="Winger", current_club="Milan", league="Serie A",
       contract_expiry="2028-06-30", estimated_salary="€7M / year", representation_agency="Ted Dimvula", nationality="Portugal", age=26, market_value="€75M",
       internal_notes="Perennial Premier League target. Milan hold a high release clause (~€175M). Any drop in valuation reopens the file.",
       image=_B, career_history=[{"club": "Sporting CP", "from": 2018, "to": 2018}, {"club": "Lille", "from": 2018, "to": 2019}, {"club": "Milan", "from": 2019, "to": None}]),
    _p(id="p-tonali", full_name="Sandro Tonali", role="Player", position="Central Midfielder", current_club="Newcastle", league="Premier League",
       contract_expiry="2028-06-30", estimated_salary="€6M / year", representation_agency="Giuseppe Riso", nationality="Italy", age=26, market_value="€55M",
       internal_notes="Heartthrob of a Serie A return story. Milan & Juventus dream; Newcastle demand a big fee. Homesick angle recurring.",
       image=_A, career_history=[{"club": "Brescia", "from": 2017, "to": 2020}, {"club": "Milan", "from": 2020, "to": 2023}, {"club": "Newcastle", "from": 2023, "to": None}]),
    _p(id="p-chiesa", full_name="Federico Chiesa", role="Player", position="Winger", current_club="Liverpool", league="Premier League",
       contract_expiry="2028-06-30", estimated_salary="€5M / year", representation_agency="Fali Ramadani", nationality="Italy", age=28, market_value="€25M",
       internal_notes="Limited minutes at Liverpool. Napoli, Roma & Milan track a possible Serie A return in 2026.",
       image=_B, career_history=[{"club": "Fiorentina", "from": 2016, "to": 2020}, {"club": "Juventus", "from": 2020, "to": 2024}, {"club": "Liverpool", "from": 2024, "to": None}]),
    _p(id="p-koopmeiners", full_name="Teun Koopmeiners", role="Player", position="Central Midfielder", current_club="Juventus", league="Serie A",
       contract_expiry="2029-06-30", estimated_salary="€5M / year", representation_agency="SEG", nationality="Netherlands", age=28, market_value="€35M",
       internal_notes="Underwhelming since his big-money move. Juventus open to offers to balance the books in 2026.",
       image=_A, career_history=[{"club": "AZ Alkmaar", "from": 2018, "to": 2021}, {"club": "Atalanta", "from": 2021, "to": 2024}, {"club": "Juventus", "from": 2024, "to": None}]),
    _p(id="p-comuzzo", full_name="Pietro Comuzzo", role="Player", position="Centre-Back", current_club="Fiorentina", league="Serie A",
       contract_expiry="2029-06-30", estimated_salary="€1.2M / year", representation_agency="Tullio Tinti", nationality="Italy", age=21, market_value="€35M",
       internal_notes="Elite young Italian centre-back. Napoli & Premier clubs bid in Jan 2025; Fiorentina resisted. Live 2026 saga.",
       image=_B, career_history=[{"club": "Fiorentina", "from": 2023, "to": None}]),
    _p(id="p-raspadori", full_name="Giacomo Raspadori", role="Player", position="Second Striker", current_club="Napoli", league="Serie A",
       contract_expiry="2028-06-30", estimated_salary="€3M / year", representation_agency="Tullio Tinti", nationality="Italy", age=26, market_value="€28M",
       internal_notes="Wants regular minutes. Atletico Madrid & Serie A rivals interested. A clean sale opportunity for Napoli in 2026.",
       image=_A, career_history=[{"club": "Sassuolo", "from": 2019, "to": 2022}, {"club": "Napoli", "from": 2022, "to": None}]),
    _p(id="p-scalvini", full_name="Giorgio Scalvini", role="Player", position="Centre-Back", current_club="Atalanta", league="Serie A",
       contract_expiry="2027-06-30", estimated_salary="€2M / year", representation_agency="Tullio Tinti", nationality="Italy", age=22, market_value="€40M",
       internal_notes="Recovered from ACL injury. Premier League & Real Madrid have long tracked him. Atalanta valuation firm.",
       image=_B, career_history=[{"club": "Atalanta", "from": 2021, "to": None}]),
    # ---------------- SERIE B / C 2026/2027 ----------------
    _p(id="p-pohjanpalo", full_name="Joel Pohjanpalo", role="Player", position="Centre-Forward", current_club="Palermo", league="Serie B",
       contract_expiry="2027-06-30", estimated_salary="€1M / year", representation_agency="Independent", nationality="Finland", age=31, market_value="€5M",
       internal_notes="Serie B goal guarantee. Serie A promotion contenders monitor if Palermo stall.",
       image=_A, career_history=[{"club": "Bayer Leverkusen", "from": 2015, "to": 2020}, {"club": "Venezia", "from": 2022, "to": 2025}, {"club": "Palermo", "from": 2025, "to": None}]),
    _p(id="p-adorante", full_name="Andrea Adorante", role="Player", position="Centre-Forward", current_club="Cesena", league="Serie B",
       contract_expiry="2026-06-30", estimated_salary="€0.35M / year", representation_agency="Independent", nationality="Italy", age=26, market_value="€1.5M",
       internal_notes="Expiring 2026 — free-agent watch. Serie C promotion sides and mid-table Serie B interested.",
       image=_B, career_history=[{"club": "Inter", "from": 2020, "to": 2021}, {"club": "Modena", "from": 2023, "to": 2024}, {"club": "Cesena", "from": 2024, "to": None}]),
    # ---------------- COACHES 2026/2027 ----------------
    _p(id="c-motta", full_name="Thiago Motta", role="Coach", position="Head Coach", current_club="Free Agent", league="—",
       contract_expiry="", estimated_salary="€4M / year (target)", representation_agency="Independent", nationality="Italy", age=43, market_value="—",
       internal_notes="Free after the Juventus spell. Premier League & Serie A mid-table projects consider him for 2026/27.",
       image=_A, career_history=[{"club": "Spezia", "from": 2021, "to": 2022}, {"club": "Bologna", "from": 2022, "to": 2024}, {"club": "Juventus", "from": 2024, "to": 2025}]),
    _p(id="c-italiano", full_name="Vincenzo Italiano", role="Coach", position="Head Coach", current_club="Bologna", league="Serie A",
       contract_expiry="2027-06-30", estimated_salary="€2.2M / year", representation_agency="Independent", nationality="Italy", age=48, market_value="—",
       internal_notes="Won silverware with Bologna. Bigger Serie A clubs monitor; Bologna push to extend and build.",
       image=_B, career_history=[{"club": "Spezia", "from": 2019, "to": 2021}, {"club": "Fiorentina", "from": 2021, "to": 2024}, {"club": "Bologna", "from": 2024, "to": None}]),
]

SOURCES = [
    {"id": "s-romano", "source_name": "Fabrizio Romano", "reliability_score": 99, "url": "https://x.com/FabrizioRomano", "notes": "Tier 1. Lo standard 'Here we go'. Il riferimento sugli affari conclusi."},
    {"id": "s-dimarzio", "source_name": "Gianluca Di Marzio", "reliability_score": 96, "url": "https://www.gianlucadimarzio.com", "notes": "Tier 1. Eccellente sulle trattative di Serie A."},
    {"id": "s-ornstein", "source_name": "David Ornstein (The Athletic)", "reliability_score": 95, "url": "https://www.nytimes.com/athletic/football/", "notes": "Tier 1. Autorevole sui movimenti Premier League <-> Serie A."},
    {"id": "s-sky", "source_name": "Sky Sport Italia", "reliability_score": 95, "url": "https://sport.sky.it/calciomercato", "notes": "Emittente. Forte su visite mediche e ufficialità."},
    {"id": "s-schira", "source_name": "Nicolò Schira", "reliability_score": 93, "url": "https://x.com/NicoSchira", "notes": "Forte su contratti, ingaggi e mosse di Serie B/C."},
    {"id": "s-moretto", "source_name": "Matteo Moretto", "reliability_score": 92, "url": "https://x.com/MatteMoretto", "notes": "Affidabile sui movimenti La Liga <-> Serie A."},
    {"id": "s-pedulla", "source_name": "Alfredo Pedullà", "reliability_score": 91, "url": "https://www.alfredopedulla.com", "notes": "Veterano. Ottimo sugli affari di categorie minori e Serie B."},
    {"id": "s-longari", "source_name": "Gianluigi Longari", "reliability_score": 90, "url": "https://x.com/longarigianluca", "notes": "Sportitalia. Solido su obiettivi di Serie A/B."},
    {"id": "s-galetti", "source_name": "Rudy Galetti", "reliability_score": 89, "url": "https://x.com/RudyGaletti", "notes": "Bravo sugli obiettivi internazionali emergenti."},
    {"id": "s-tuttosport", "source_name": "Tuttosport", "reliability_score": 88, "url": "https://www.tuttosport.com", "notes": "Storico quotidiano sportivo torinese. Forte copertura Serie A."},
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
    {"profile_id": "p-lookman", "age_min": 30000, "stage": "Saltata", "source_name": "Tuttosport", "deal_formula": "Definitive", "evolution_description": "Reported agreement with a Premier club falls through; Atalanta deny any deal was close."},
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
    {"profile_id": "p-lookman", "age_min": 20, "stage": "Contatti", "source_name": "Tuttosport", "deal_formula": "Free Transfer", "evolution_description": "A speculative report suggests Lookman could leave Atalanta as a free agent this summer on a free transfer."},
    # ---------------- 2026/2027 EXPANSION RUMORS ----------------
    # Vlahović (expiring 2026 — flagship saga)
    {"profile_id": "p-vlahovic", "age_min": 25, "stage": "Trattativa Avanzata", "source_name": "Fabrizio Romano", "deal_formula": "Definitive", "evolution_description": "Juventus and Vlahović remain far apart on renewal. With the deal expiring in June 2026, Juve now consider selling to avoid a free exit. Premier clubs alerted."},
    {"profile_id": "p-vlahovic", "age_min": 2600, "stage": "Contatti", "source_name": "Gianluca Di Marzio", "deal_formula": "Definitive", "evolution_description": "A Saudi Pro League club and two Premier sides ask about Vlahović's wage demands and a mid-season fee."},
    {"profile_id": "p-vlahovic", "age_min": 30000, "stage": "Interesse Iniziale", "source_name": "Tuttosport", "deal_formula": "Definitive", "evolution_description": "Juventus table an improved renewal offer, but the striker's camp stalls, opening the door to a 2026 departure."},
    # Contradiction demo #2: free-transfer claim while contract runs beyond current year handled by Vlahović? No — his expires 2026. Use Leão instead.
    {"profile_id": "p-leao", "age_min": 15, "stage": "Contatti", "source_name": "Tuttosport", "deal_formula": "Free Transfer", "evolution_description": "A speculative report suggests Rafael Leão could walk away from Milan on a free transfer this summer despite his long-term deal."},
    {"profile_id": "p-leao", "age_min": 500, "stage": "Interesse Iniziale", "source_name": "Sky Sport Italia", "deal_formula": "Definitive", "evolution_description": "A Premier League heavyweight asks Milan about Leão's release-clause mechanics. Milan not entertaining offers for now."},
    # Tonali return
    {"profile_id": "p-tonali", "age_min": 140, "stage": "Contatti", "source_name": "Fabrizio Romano", "deal_formula": "Definitive", "evolution_description": "Milan explore the feasibility of bringing Sandro Tonali home. Newcastle's stance: only a premium fee would be considered."},
    {"profile_id": "p-tonali", "age_min": 9000, "stage": "Interesse Iniziale", "source_name": "Nicolò Schira", "deal_formula": "Definitive", "evolution_description": "Juventus also register interest in Tonali as a long-term midfield anchor for the 2026/27 project."},
    # Chiesa return
    {"profile_id": "p-chiesa", "age_min": 320, "stage": "Contatti", "source_name": "Gianluca Di Marzio", "deal_formula": "Loan", "evolution_description": "Napoli and Roma discuss a loan-to-buy structure for Federico Chiesa as Liverpool consider letting him play regularly."},
    # Koopmeiners
    {"profile_id": "p-koopmeiners", "age_min": 700, "stage": "Interesse Iniziale", "source_name": "Matteo Moretto", "deal_formula": "Definitive", "evolution_description": "Juventus signal willingness to listen to offers for Koopmeiners to fund their 2026 rebuild."},
    # Comuzzo (hot young CB)
    {"profile_id": "p-comuzzo", "age_min": 85, "stage": "Trattativa Avanzata", "source_name": "Fabrizio Romano", "deal_formula": "Definitive", "evolution_description": "Napoli return for Comuzzo with an improved package. Fiorentina hold firm on a €40M valuation; talks intensify."},
    {"profile_id": "p-comuzzo", "age_min": 22000, "stage": "Contatti", "source_name": "Nicolò Schira", "deal_formula": "Definitive", "evolution_description": "Premier League scouts log repeated viewings of Comuzzo; Fiorentina plan a renewal to protect the asset."},
    # Raspadori
    {"profile_id": "p-raspadori", "age_min": 420, "stage": "Contatti", "source_name": "Gianluigi Longari", "deal_formula": "Definitive", "evolution_description": "Atlético Madrid and a Serie A rival ask Napoli about Raspadori. The player seeks guaranteed minutes for 2026."},
    # Scalvini
    {"profile_id": "p-scalvini", "age_min": 1600, "stage": "Interesse Iniziale", "source_name": "Sky Sport Italia", "deal_formula": "Definitive", "evolution_description": "Now fully fit, Scalvini re-enters the radar of Premier clubs and Real Madrid. Atalanta's price stays high."},
    # Serie B/C new
    {"profile_id": "p-pohjanpalo", "age_min": 260, "stage": "Contatti", "source_name": "Alfredo Pedullà", "deal_formula": "Definitive", "evolution_description": "Serie A promotion hopefuls sound out Pohjanpalo as a ready-made goalscorer if Palermo miss out."},
    {"profile_id": "p-adorante", "age_min": 3100, "stage": "Contatti", "source_name": "Nicolò Schira", "deal_formula": "Free Transfer", "evolution_description": "Adorante's Cesena deal expires in 2026; several Serie B and promotion-chasing Serie C clubs line up free-agent talks."},
    # Coaches new
    {"profile_id": "c-motta", "age_min": 200, "stage": "Contatti", "source_name": "Fabrizio Romano", "deal_formula": "Free Transfer", "evolution_description": "Thiago Motta, free since leaving Juventus, is contacted by a Premier League project and a Serie A mid-table side for 2026/27."},
    {"profile_id": "c-italiano", "age_min": 1500, "stage": "Interesse Iniziale", "source_name": "Gianluca Di Marzio", "deal_formula": "Free Transfer", "evolution_description": "Bologna open renewal talks with Italiano, but a bigger Serie A club monitors his situation for next season."},
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
VERIFIED_PROFILE_IDS = {"p-yildiz", "p-nicopaz", "p-kean", "p-lookman", "p-osimhen", "p-zirkzee", "p-calafiori", "c-conte", "c-fabregas", "p-vlahovic", "p-leao", "p-tonali", "p-chiesa", "p-comuzzo", "c-motta", "c-italiano"}

STREAK_USERS = [
    {"id": "u-you", "mock_username": "You", "current_streak": 4, "highest_streak": 9},
    {"id": "u-1", "mock_username": "@MercatoMaster", "current_streak": 12, "highest_streak": 28},
    {"id": "u-2", "mock_username": "@TifosoVerace", "current_streak": 7, "highest_streak": 21},
    {"id": "u-3", "mock_username": "@GialloRossoITK", "current_streak": 0, "highest_streak": 18},
    {"id": "u-4", "mock_username": "@NerazzurroNews", "current_streak": 5, "highest_streak": 15},
    {"id": "u-5", "mock_username": "@CalcioProphet", "current_streak": 3, "highest_streak": 11},
]

DAILY_CHALLENGES = [
    {"id": "ch-1", "order": 0, "question_text": "Will Dušan Vlahović sign a new Juventus contract before his 2026 deadline?", "correct_answer": "NO", "is_active": True},
    {"id": "ch-2", "order": 1, "question_text": "Will Real Madrid trigger the Nico Paz buy-back this summer?", "correct_answer": "NO", "is_active": False},
    {"id": "ch-3", "order": 2, "question_text": "Will Joshua Zirkzee complete his loan move to Juventus?", "correct_answer": "SI", "is_active": False},
    {"id": "ch-4", "order": 3, "question_text": "Will Victor Osimhen return to Serie A in 2026?", "correct_answer": "SI", "is_active": False},
    {"id": "ch-5", "order": 4, "question_text": "Will Rafael Leão leave Milan in the 2026 window?", "correct_answer": "NO", "is_active": False},
    {"id": "ch-6", "order": 5, "question_text": "Will Sandro Tonali make a Serie A return before 2027?", "correct_answer": "NO", "is_active": False},
    {"id": "ch-7", "order": 6, "question_text": "Will Moise Kean's release clause be triggered by a Saudi club?", "correct_answer": "SI", "is_active": False},
    {"id": "ch-8", "order": 7, "question_text": "Will Cesc Fàbregas leave Como for a Premier League club in 2026?", "correct_answer": "NO", "is_active": False},
    {"id": "ch-9", "order": 8, "question_text": "Will Fiorentina sell Pietro Comuzzo to Napoli in 2026?", "correct_answer": "NO", "is_active": False},
    {"id": "ch-10", "order": 9, "question_text": "Will Thiago Motta take a new head-coach job before 2027?", "correct_answer": "SI", "is_active": False},
]
