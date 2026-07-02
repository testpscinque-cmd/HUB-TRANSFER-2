"""Realistic demo data for TransferMemory (Calciomercato) — v2 (expanded)."""

SEED_VERSION = 3

_IMG_A = "https://images.pexels.com/photos/10349959/pexels-photo-10349959.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
_IMG_B = "https://images.pexels.com/photos/14741747/pexels-photo-14741747.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"

PROFILES = [
    # ---------------- PLAYERS ----------------
    {
        "id": "p-osimhen", "full_name": "Victor Osimhen", "role": "Player", "position": "Centre-Forward",
        "current_club": "Napoli", "contract_expiry": "2026-06-30", "estimated_salary": "€10M / year",
        "representation_agency": "Roberto Calenda", "nationality": "Nigeria", "age": 26, "market_value": "€100M",
        "internal_notes": "Release clause active. Prefers Premier League. Napoli open to definitive sale above €100M.",
        "image": _IMG_A,
        "career_history": [
            {"club": "Wolfsburg", "from": 2017, "to": 2018},
            {"club": "Charleroi", "from": 2018, "to": 2019},
            {"club": "Lille", "from": 2019, "to": 2020},
            {"club": "Napoli", "from": 2020, "to": None},
        ],
    },
    {
        "id": "p-koopmeiners", "full_name": "Teun Koopmeiners", "role": "Player", "position": "Central Midfielder",
        "current_club": "Atalanta", "contract_expiry": "2027-06-30", "estimated_salary": "€3.5M / year",
        "representation_agency": "SEG", "nationality": "Netherlands", "age": 28, "market_value": "€55M",
        "internal_notes": "Juventus primary target. Atalanta demand €55M. Player agreed on personal terms.",
        "image": _IMG_B,
        "career_history": [
            {"club": "AZ Alkmaar", "from": 2017, "to": 2021},
            {"club": "Atalanta", "from": 2021, "to": None},
        ],
    },
    {
        "id": "p-zirkzee", "full_name": "Joshua Zirkzee", "role": "Player", "position": "Centre-Forward",
        "current_club": "Bologna", "contract_expiry": "2026-06-30", "estimated_salary": "€1.2M / year",
        "representation_agency": "Kia Joorabchian", "nationality": "Netherlands", "age": 24, "market_value": "€40M",
        "internal_notes": "Release clause €40M. Agent commission is the sticking point for several clubs.",
        "image": _IMG_A,
        "career_history": [
            {"club": "Bayern Munich", "from": 2019, "to": 2022},
            {"club": "Parma", "from": 2021, "to": 2021},
            {"club": "Anderlecht", "from": 2022, "to": 2022},
            {"club": "Bologna", "from": 2022, "to": None},
        ],
    },
    {
        "id": "p-soule", "full_name": "Matias Soulé", "role": "Player", "position": "Right Winger",
        "current_club": "Juventus", "contract_expiry": "2028-06-30", "estimated_salary": "€1.5M / year",
        "representation_agency": "Martin Guastadisegno", "nationality": "Argentina", "age": 21, "market_value": "€35M",
        "internal_notes": "Strong loan at Frosinone. Roma & Leicester interested. Juve wants €35M.",
        "image": _IMG_B,
        "career_history": [
            {"club": "Vélez Sarsfield", "from": 2019, "to": 2020},
            {"club": "Juventus", "from": 2020, "to": None},
            {"club": "Frosinone", "from": 2023, "to": 2024},
        ],
    },
    {
        "id": "p-calafiori", "full_name": "Riccardo Calafiori", "role": "Player", "position": "Centre-Back",
        "current_club": "Bologna", "contract_expiry": "2027-06-30", "estimated_salary": "€1.4M / year",
        "representation_agency": "CAA Stellar", "nationality": "Italy", "age": 22, "market_value": "€45M",
        "internal_notes": "Sell-on clause for Roma (~40%). Premier League clubs monitoring after strong season.",
        "image": _IMG_A,
        "career_history": [
            {"club": "AS Roma", "from": 2020, "to": 2022},
            {"club": "Genoa", "from": 2022, "to": 2023},
            {"club": "Basel", "from": 2023, "to": 2023},
            {"club": "Bologna", "from": 2023, "to": None},
        ],
    },
    {
        "id": "p-chiesa", "full_name": "Federico Chiesa", "role": "Player", "position": "Winger",
        "current_club": "Juventus", "contract_expiry": "2025-06-30", "estimated_salary": "€5M / year",
        "representation_agency": "Fali Ramadani", "nationality": "Italy", "age": 26, "market_value": "€40M",
        "internal_notes": "Contract expiring 2025. Renewal stalled. Juve may cash in this summer to avoid free exit.",
        "image": _IMG_B,
        "career_history": [
            {"club": "Fiorentina", "from": 2016, "to": 2020},
            {"club": "Juventus", "from": 2020, "to": None},
        ],
    },
    {
        "id": "p-gudmundsson", "full_name": "Albert Gudmundsson", "role": "Player", "position": "Attacking Midfielder",
        "current_club": "Genoa", "contract_expiry": "2028-06-30", "estimated_salary": "€1.1M / year",
        "representation_agency": "Elite Project Group", "nationality": "Iceland", "age": 27, "market_value": "€30M",
        "internal_notes": "Breakout Serie A season. Inter, Fiorentina & Juventus tracking. Genoa want €30M.",
        "image": _IMG_A,
        "career_history": [
            {"club": "AZ Alkmaar", "from": 2018, "to": 2020},
            {"club": "PSV", "from": 2020, "to": 2021},
            {"club": "Genoa", "from": 2021, "to": None},
        ],
    },
    {
        "id": "p-douglas-luiz", "full_name": "Douglas Luiz", "role": "Player", "position": "Defensive Midfielder",
        "current_club": "Aston Villa", "contract_expiry": "2026-06-30", "estimated_salary": "€4M / year",
        "representation_agency": "Base Soccer", "nationality": "Brazil", "age": 26, "market_value": "€50M",
        "internal_notes": "Juventus in advanced talks. Possible swap deal involving Iling-Junior and Barrenechea.",
        "image": _IMG_B,
        "career_history": [
            {"club": "Manchester City", "from": 2017, "to": 2019},
            {"club": "Girona", "from": 2017, "to": 2019},
            {"club": "Aston Villa", "from": 2019, "to": None},
        ],
    },
    # ---------------- COACHES ----------------
    {
        "id": "c-gasperini", "full_name": "Gian Piero Gasperini", "role": "Coach", "position": "Head Coach",
        "current_club": "Atalanta", "contract_expiry": "2025-06-30", "estimated_salary": "€5M / year",
        "representation_agency": "Giuseppe Riso", "nationality": "Italy", "age": 66, "market_value": "—",
        "internal_notes": "Contract expiring 2025. Renewal talks ongoing after Europa League triumph.",
        "image": _IMG_A,
        "career_history": [
            {"club": "Genoa", "from": 2006, "to": 2010},
            {"club": "Inter", "from": 2011, "to": 2011},
            {"club": "Palermo", "from": 2012, "to": 2012},
            {"club": "Genoa", "from": 2013, "to": 2016},
            {"club": "Atalanta", "from": 2016, "to": None},
        ],
    },
    {
        "id": "c-motta", "full_name": "Thiago Motta", "role": "Coach", "position": "Head Coach",
        "current_club": "Bologna", "contract_expiry": "2025-06-30", "estimated_salary": "€2.5M / year",
        "representation_agency": "Independent", "nationality": "Italy", "age": 41, "market_value": "—",
        "internal_notes": "Juventus top target after Champions League qualification with Bologna. Verbal agreement close.",
        "image": _IMG_B,
        "career_history": [
            {"club": "Genoa", "from": 2019, "to": 2019},
            {"club": "Spezia", "from": 2021, "to": 2022},
            {"club": "Bologna", "from": 2022, "to": None},
        ],
    },
    {
        "id": "c-conte", "full_name": "Antonio Conte", "role": "Coach", "position": "Head Coach",
        "current_club": "Free Agent", "contract_expiry": "", "estimated_salary": "€7M / year (target)",
        "representation_agency": "Federico Pastorello", "nationality": "Italy", "age": 55, "market_value": "—",
        "internal_notes": "Currently a free agent. Napoli pushing hard for a 3-year project. Milan also interested.",
        "image": _IMG_A,
        "career_history": [
            {"club": "Juventus", "from": 2011, "to": 2014},
            {"club": "Italy NT", "from": 2014, "to": 2016},
            {"club": "Chelsea", "from": 2016, "to": 2018},
            {"club": "Inter", "from": 2019, "to": 2021},
            {"club": "Tottenham", "from": 2021, "to": 2023},
        ],
    },
    {
        "id": "c-italiano", "full_name": "Vincenzo Italiano", "role": "Coach", "position": "Head Coach",
        "current_club": "Fiorentina", "contract_expiry": "2025-06-30", "estimated_salary": "€1.8M / year",
        "representation_agency": "Independent", "nationality": "Italy", "age": 46, "market_value": "—",
        "internal_notes": "Leaving Fiorentina at contract end. Bologna and Napoli have made contact.",
        "image": _IMG_B,
        "career_history": [
            {"club": "Trapani", "from": 2019, "to": 2019},
            {"club": "Spezia", "from": 2019, "to": 2021},
            {"club": "Fiorentina", "from": 2021, "to": None},
        ],
    },
]

SOURCES = [
    {"id": "s-romano", "source_name": "Fabrizio Romano", "reliability_score": 96, "notes": "Tier 1. 'Here we go' standard. Rarely wrong on done deals."},
    {"id": "s-dimarzio", "source_name": "Gianluca Di Marzio", "reliability_score": 92, "notes": "Tier 1. Excellent on Serie A negotiations."},
    {"id": "s-sky", "source_name": "Sky Sport Italia", "reliability_score": 90, "notes": "Broadcaster. Strong on medical & official confirmations."},
    {"id": "s-schira", "source_name": "Nicolò Schira", "reliability_score": 87, "notes": "Strong on contract details and salary figures."},
    {"id": "s-moretto", "source_name": "Matteo Moretto", "reliability_score": 85, "notes": "Reliable on La Liga <-> Serie A movements."},
    {"id": "s-galetti", "source_name": "Rudy Galetti", "reliability_score": 78, "notes": "Good on emerging targets, occasional misses."},
    {"id": "s-calciomercato", "source_name": "Calciomercato.com", "reliability_score": 68, "notes": "Aggregator. Mix of exclusives and speculation."},
    {"id": "s-tuttosport", "source_name": "Tuttosport", "reliability_score": 62, "notes": "Turin-based. Juventus bias, sometimes optimistic."},
    {"id": "s-twitter-itk", "source_name": "Anonymous ITK (X)", "reliability_score": 31, "notes": "Unverified insider. Treat with heavy caution."},
]

RUMORS = [
    # Osimhen
    {"profile_id": "p-osimhen", "date_logged": "2025-05-28", "stage": "Interesse Iniziale", "source_name": "Fabrizio Romano", "deal_formula": "Definitive", "evolution_description": "Chelsea register concrete interest in Osimhen. First contacts with the entourage."},
    {"profile_id": "p-osimhen", "date_logged": "2025-06-10", "stage": "Contatti", "source_name": "Gianluca Di Marzio", "deal_formula": "Definitive", "evolution_description": "PSG enter the race. Napoli reiterate they will only sell above the €100M range."},
    {"profile_id": "p-osimhen", "date_logged": "2025-06-25", "stage": "Trattativa Avanzata", "source_name": "Nicolò Schira", "deal_formula": "Definitive", "evolution_description": "Chelsea prepare a structured offer. Personal terms almost agreed on a 5-year deal."},
    # Koopmeiners
    {"profile_id": "p-koopmeiners", "date_logged": "2025-06-02", "stage": "Interesse Iniziale", "source_name": "Tuttosport", "deal_formula": "Definitive", "evolution_description": "Juventus identify Koopmeiners as the ideal midfield reinforcement for Thiago Motta."},
    {"profile_id": "p-koopmeiners", "date_logged": "2025-06-18", "stage": "Contatti", "source_name": "Fabrizio Romano", "deal_formula": "Definitive", "evolution_description": "Full agreement between Juventus and the player on a 5-year contract. Now clubs must negotiate the fee."},
    {"profile_id": "p-koopmeiners", "date_logged": "2025-07-01", "stage": "Trattativa Avanzata", "source_name": "Gianluca Di Marzio", "deal_formula": "Definitive", "evolution_description": "Atalanta hold firm at €55M. Juventus offer €45M plus bonuses. Gap narrowing."},
    # Zirkzee
    {"profile_id": "p-zirkzee", "date_logged": "2025-05-20", "stage": "Interesse Iniziale", "source_name": "Calciomercato.com", "deal_formula": "Definitive", "evolution_description": "Milan and Manchester United tracking Zirkzee via his €40M release clause."},
    {"profile_id": "p-zirkzee", "date_logged": "2025-06-15", "stage": "Trattativa Avanzata", "source_name": "Fabrizio Romano", "deal_formula": "Definitive", "evolution_description": "Manchester United advance. Only agent commission remains to be resolved."},
    {"profile_id": "p-zirkzee", "date_logged": "2025-07-03", "stage": "Fumata Bianca/Ufficiale", "source_name": "Fabrizio Romano", "deal_formula": "Definitive", "evolution_description": "HERE WE GO. Zirkzee to Manchester United, medical scheduled. €40M clause triggered."},
    # Soulé
    {"profile_id": "p-soule", "date_logged": "2025-06-08", "stage": "Interesse Iniziale", "source_name": "Nicolò Schira", "deal_formula": "Definitive", "evolution_description": "Roma make Soulé a priority target for the right wing."},
    {"profile_id": "p-soule", "date_logged": "2025-06-22", "stage": "Saltata", "source_name": "Anonymous ITK (X)", "deal_formula": "Loan", "evolution_description": "Reported loan-to-Leicester collapse; club sources deny any loan structure was discussed."},
    {"profile_id": "p-soule", "date_logged": "2025-07-02", "stage": "Contatti", "source_name": "Sky Sport Italia", "deal_formula": "Definitive", "evolution_description": "Roma open talks with Juventus. Structured €30M + bonuses proposal on the table."},
    # Calafiori
    {"profile_id": "p-calafiori", "date_logged": "2025-06-12", "stage": "Interesse Iniziale", "source_name": "Fabrizio Romano", "deal_formula": "Definitive", "evolution_description": "Arsenal and Juventus scouting Calafiori intensively after his Euro 2024 displays."},
    {"profile_id": "p-calafiori", "date_logged": "2025-07-04", "stage": "Trattativa Avanzata", "source_name": "Sky Sport Italia", "deal_formula": "Definitive", "evolution_description": "Arsenal lead the race. Bologna & Roma to split the fee via the sell-on clause."},
    # Chiesa
    {"profile_id": "p-chiesa", "date_logged": "2025-06-05", "stage": "Interesse Iniziale", "source_name": "Tuttosport", "deal_formula": "Definitive", "evolution_description": "With contract expiring in 2025, Juventus consider selling Chiesa to avoid a free exit."},
    {"profile_id": "p-chiesa", "date_logged": "2025-06-28", "stage": "Contatti", "source_name": "Matteo Moretto", "deal_formula": "Definitive", "evolution_description": "Roma and Napoli make enquiries. Juventus asking around €30M."},
    # Gudmundsson
    {"profile_id": "p-gudmundsson", "date_logged": "2025-06-20", "stage": "Interesse Iniziale", "source_name": "Gianluca Di Marzio", "deal_formula": "Loan with obligation", "evolution_description": "Fiorentina lead for Gudmundsson, exploring loan with obligation to buy."},
    {"profile_id": "p-gudmundsson", "date_logged": "2025-07-05", "stage": "Contatti", "source_name": "Rudy Galetti", "deal_formula": "Definitive", "evolution_description": "Inter join talks. Genoa maintain their €30M valuation."},
    # Douglas Luiz
    {"profile_id": "p-douglas-luiz", "date_logged": "2025-06-30", "stage": "Trattativa Avanzata", "source_name": "Fabrizio Romano", "deal_formula": "Swap", "evolution_description": "Juventus and Aston Villa negotiating a deal with Iling-Junior & Barrenechea moving the other way."},
    {"profile_id": "p-douglas-luiz", "date_logged": "2025-07-06", "stage": "Fumata Bianca/Ufficiale", "source_name": "Fabrizio Romano", "deal_formula": "Swap", "evolution_description": "HERE WE GO. Douglas Luiz joins Juventus. Medical booked in Turin."},
    # Gasperini
    {"profile_id": "c-gasperini", "date_logged": "2025-06-05", "stage": "Contatti", "source_name": "Gianluca Di Marzio", "deal_formula": "Free Transfer", "evolution_description": "With contract expiring, Gasperini discusses a possible renewal. Not yet signed."},
    {"profile_id": "c-gasperini", "date_logged": "2025-06-24", "stage": "Fumata Bianca/Ufficiale", "source_name": "Sky Sport Italia", "deal_formula": "Free Transfer", "evolution_description": "Gasperini signs a 2-year renewal with Atalanta. Official announcement made."},
    # Motta
    {"profile_id": "c-motta", "date_logged": "2025-05-25", "stage": "Interesse Iniziale", "source_name": "Tuttosport", "deal_formula": "Free Transfer", "evolution_description": "Juventus identify Thiago Motta as the man to lead the new project."},
    {"profile_id": "c-motta", "date_logged": "2025-06-08", "stage": "Trattativa Avanzata", "source_name": "Fabrizio Romano", "deal_formula": "Free Transfer", "evolution_description": "Verbal agreement reached. Motta to sign a 3-year contract with Juventus."},
    {"profile_id": "c-motta", "date_logged": "2025-06-14", "stage": "Fumata Bianca/Ufficiale", "source_name": "Fabrizio Romano", "deal_formula": "Free Transfer", "evolution_description": "HERE WE GO. Thiago Motta is the new Juventus head coach. Contract until 2027."},
    # Conte
    {"profile_id": "c-conte", "date_logged": "2025-05-30", "stage": "Interesse Iniziale", "source_name": "Gianluca Di Marzio", "deal_formula": "Free Transfer", "evolution_description": "Napoli make Conte their top target to relaunch after a poor season."},
    {"profile_id": "c-conte", "date_logged": "2025-06-18", "stage": "Trattativa Avanzata", "source_name": "Sky Sport Italia", "deal_formula": "Free Transfer", "evolution_description": "Direct meeting between De Laurentiis and Conte. 3-year deal discussed."},
    # Italiano
    {"profile_id": "c-italiano", "date_logged": "2025-06-10", "stage": "Contatti", "source_name": "Nicolò Schira", "deal_formula": "Free Transfer", "evolution_description": "Bologna line up Italiano as Motta's replacement should he leave for Juventus."},
]

# ---------------- AI RADAR (SIMULATED GLOBAL MEDIA SCANNER) ----------------
PIPELINE_STAGES = ["Contatti Avviati", "Trattativa", "Fonti Verificate", "Here We Go"]

GLOBAL_ALERTS = [
    {"id": "a-yildiz", "player_name": "Kenan Yildiz", "current_club": "Juventus", "flagged_country": "Turkey",
     "anomaly_score": "High", "status": "New",
     "automated_summary": "AI Alert: 4 local Turkish outlets reported ongoing talks in the last 45 mins. Fenerbahçe president quoted mentioning a 'surprise return' clause."},
    {"id": "a-castro", "player_name": "Santiago Castro", "current_club": "Bologna", "flagged_country": "Argentina",
     "anomaly_score": "Medium", "status": "New",
     "automated_summary": "AI Alert: Spike in Argentine media mentions (+220% in 6h). Olé reports River Plate exploring a buy-back option for the striker."},
    {"id": "a-hojlund", "player_name": "Rasmus Højlund", "current_club": "Manchester United", "flagged_country": "Denmark",
     "anomaly_score": "Low", "status": "New",
     "automated_summary": "AI Alert: Minor uptick in Danish tabloids. Ekstra Bladet speculates on a Serie A loan return; single unverified source."},
    {"id": "a-baturina", "player_name": "Martin Baturina", "current_club": "Dinamo Zagreb", "flagged_country": "Croatia",
     "anomaly_score": "High", "status": "Investigating",
     "automated_summary": "AI Alert: 3 Croatian outlets + 1 Italian confirm Napoli scouts attended last two matches. Frequency anomaly detected across 12h window."},
    {"id": "a-simeone", "player_name": "Giovanni Simeone", "current_club": "Napoli", "flagged_country": "Spain",
     "anomaly_score": "Medium", "status": "Verified",
     "automated_summary": "AI Alert: Spanish radio (COPE) reports concrete Atlético interest. Cross-referenced with agent's location data in Madrid."},
]

PIPELINE = [
    {"id": "pl-1", "player_name": "Martin Baturina", "target_club": "Napoli", "source_origin": "Croatia (Sportske Novosti)",
     "priority_tier": "A", "stage": "Fonti Verificate",
     "exclusive_angle_notes": "Angle: first Italian outlet to confirm scouting trip. Need agent quote to break exclusive."},
    {"id": "pl-2", "player_name": "Teun Koopmeiners", "target_club": "Juventus", "source_origin": "Italy (Di Marzio)",
     "priority_tier": "A", "stage": "Trattativa",
     "exclusive_angle_notes": "Angle: personal terms already agreed — focus story on the fee stand-off (€45M vs €55M)."},
    {"id": "pl-3", "player_name": "Santiago Castro", "target_club": "River Plate", "source_origin": "Argentina (Olé)",
     "priority_tier": "B", "stage": "Contatti Avviati",
     "exclusive_angle_notes": "Angle: buy-back clause detail not yet public. Verify % with Bologna sporting director."},
    {"id": "pl-4", "player_name": "Douglas Luiz", "target_club": "Juventus", "source_origin": "England (Romano)",
     "priority_tier": "A", "stage": "Here We Go",
     "exclusive_angle_notes": "Ready to publish: swap deal confirmed, medical booked. Prep the graphic + player-trade breakdown."},
]

VERIFICATION_TASKS = [
    {"id": "t-1", "pipeline_id": "pl-1", "player_name": "Martin Baturina", "action_required": "Contact agent for confirmation of Napoli contact", "deadline": "2025-07-08", "is_done": False},
    {"id": "t-2", "pipeline_id": "pl-1", "player_name": "Martin Baturina", "action_required": "Cross-check scouting trip with local Croatian source", "deadline": "2025-07-07", "is_done": True},
    {"id": "t-3", "pipeline_id": "pl-2", "player_name": "Teun Koopmeiners", "action_required": "Confirm current Atalanta asking price with second source", "deadline": "2025-07-07", "is_done": False},
    {"id": "t-4", "pipeline_id": "pl-3", "player_name": "Santiago Castro", "action_required": "Verify buy-back clause percentage in database", "deadline": "2025-07-09", "is_done": False},
    {"id": "t-5", "pipeline_id": "pl-4", "player_name": "Douglas Luiz", "action_required": "Get final confirmation of medical time before publishing", "deadline": "2025-07-06", "is_done": True},
]
