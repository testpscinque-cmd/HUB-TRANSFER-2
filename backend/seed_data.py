"""Realistic demo data for TransferMemory (Calciomercato)."""

PROFILES = [
    {
        "id": "p-osimhen",
        "full_name": "Victor Osimhen",
        "role": "Player",
        "position": "Striker",
        "current_club": "Napoli",
        "contract_expiry": "2026-06-30",
        "estimated_salary": "€10M / year",
        "representation_agency": "Roberto Calenda",
        "nationality": "Nigeria",
        "age": 26,
        "internal_notes": "Release clause active. Prefers Premier League move. Napoli open to definitive sale above €100M.",
        "image": "https://images.pexels.com/photos/10349959/pexels-photo-10349959.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    },
    {
        "id": "p-koopmeiners",
        "full_name": "Teun Koopmeiners",
        "role": "Player",
        "position": "Midfielder",
        "current_club": "Atalanta",
        "contract_expiry": "2027-06-30",
        "estimated_salary": "€3.5M / year",
        "representation_agency": "SEG",
        "nationality": "Netherlands",
        "age": 28,
        "internal_notes": "Juventus primary target. Atalanta demanding €55M. Player has agreement on personal terms.",
        "image": "https://images.pexels.com/photos/14741747/pexels-photo-14741747.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    },
    {
        "id": "p-zirkzee",
        "full_name": "Joshua Zirkzee",
        "role": "Player",
        "position": "Striker",
        "current_club": "Bologna",
        "contract_expiry": "2026-06-30",
        "estimated_salary": "€1.2M / year",
        "representation_agency": "Kia Joorabchian",
        "nationality": "Netherlands",
        "age": 24,
        "internal_notes": "Release clause of €40M. Agent commission is the sticking point for several clubs.",
        "image": "https://images.pexels.com/photos/10349959/pexels-photo-10349959.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    },
    {
        "id": "p-soule",
        "full_name": "Matias Soulé",
        "role": "Player",
        "position": "Winger",
        "current_club": "Juventus",
        "contract_expiry": "2028-06-30",
        "estimated_salary": "€1.5M / year",
        "representation_agency": "Martin Guastadisegno",
        "nationality": "Argentina",
        "age": 21,
        "internal_notes": "Coming off strong loan at Frosinone. Roma and Leicester interested. Juve wants €35M.",
        "image": "https://images.pexels.com/photos/14741747/pexels-photo-14741747.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    },
    {
        "id": "p-gasperini",
        "full_name": "Gian Piero Gasperini",
        "role": "Coach",
        "position": "Head Coach",
        "current_club": "Atalanta",
        "contract_expiry": "2025-06-30",
        "estimated_salary": "€5M / year",
        "representation_agency": "Giuseppe Riso",
        "nationality": "Italy",
        "age": 66,
        "internal_notes": "Contract expiring soon. Renewal talks ongoing. Big clubs monitoring the situation.",
        "image": "https://images.pexels.com/photos/10349959/pexels-photo-10349959.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    },
]

SOURCES = [
    {"id": "s-romano", "source_name": "Fabrizio Romano", "reliability_score": 96, "notes": "Tier 1. Here we go standard. Rarely wrong on done deals."},
    {"id": "s-dimarzio", "source_name": "Gianluca Di Marzio", "reliability_score": 92, "notes": "Tier 1. Excellent on Serie A negotiations."},
    {"id": "s-schira", "source_name": "Nicolò Schira", "reliability_score": 87, "notes": "Strong on contract details and salary figures."},
    {"id": "s-calciomercato", "source_name": "Calciomercato.com", "reliability_score": 68, "notes": "Aggregator. Mix of exclusives and speculation."},
    {"id": "s-tuttosport", "source_name": "Tuttosport", "reliability_score": 62, "notes": "Turin-based. Bias on Juventus stories, sometimes optimistic."},
    {"id": "s-twitter-itk", "source_name": "Anonymous ITK (X)", "reliability_score": 31, "notes": "Unverified insider. Treat with heavy caution."},
]

RUMORS = [
    # Osimhen saga
    {"id": "r-1", "profile_id": "p-osimhen", "date_logged": "2025-05-28", "stage": "Interesse Iniziale", "source_name": "Fabrizio Romano", "deal_formula": "Definitive", "evolution_description": "Chelsea register concrete interest in Osimhen for the summer window. First contacts with the entourage."},
    {"id": "r-2", "profile_id": "p-osimhen", "date_logged": "2025-06-10", "stage": "Contatti", "source_name": "Gianluca Di Marzio", "deal_formula": "Definitive", "evolution_description": "PSG enter the race. Napoli reiterate they will only sell above the €100M range."},
    {"id": "r-3", "profile_id": "p-osimhen", "date_logged": "2025-06-25", "stage": "Trattativa Avanzata", "source_name": "Nicolò Schira", "deal_formula": "Definitive", "evolution_description": "Chelsea prepare a structured offer. Personal terms with the player almost agreed on a 5-year deal."},
    # Koopmeiners saga
    {"id": "r-4", "profile_id": "p-koopmeiners", "date_logged": "2025-06-02", "stage": "Interesse Iniziale", "source_name": "Tuttosport", "deal_formula": "Definitive", "evolution_description": "Juventus identify Koopmeiners as the ideal midfield reinforcement for Thiago Motta."},
    {"id": "r-5", "profile_id": "p-koopmeiners", "date_logged": "2025-06-18", "stage": "Contatti", "source_name": "Fabrizio Romano", "deal_formula": "Definitive", "evolution_description": "Full agreement between Juventus and the player on a 5-year contract. Now clubs must negotiate the fee."},
    {"id": "r-6", "profile_id": "p-koopmeiners", "date_logged": "2025-07-01", "stage": "Trattativa Avanzata", "source_name": "Gianluca Di Marzio", "deal_formula": "Definitive", "evolution_description": "Atalanta hold firm at €55M. Juventus offer €45M plus bonuses. Gap narrowing."},
    # Zirkzee saga
    {"id": "r-7", "profile_id": "p-zirkzee", "date_logged": "2025-05-20", "stage": "Interesse Iniziale", "source_name": "Calciomercato.com", "deal_formula": "Definitive", "evolution_description": "Milan and Manchester United tracking Zirkzee via his €40M release clause."},
    {"id": "r-8", "profile_id": "p-zirkzee", "date_logged": "2025-06-15", "stage": "Trattativa Avanzata", "source_name": "Fabrizio Romano", "deal_formula": "Definitive", "evolution_description": "Manchester United advance. Only agent commission remains to be resolved."},
    {"id": "r-9", "profile_id": "p-zirkzee", "date_logged": "2025-07-03", "stage": "Fumata Bianca/Ufficiale", "source_name": "Fabrizio Romano", "deal_formula": "Definitive", "evolution_description": "HERE WE GO. Zirkzee to Manchester United, medical scheduled. €40M clause triggered."},
    # Soulé saga
    {"id": "r-10", "profile_id": "p-soule", "date_logged": "2025-06-08", "stage": "Interesse Iniziale", "source_name": "Nicolò Schira", "deal_formula": "Definitive", "evolution_description": "Roma make Soulé a priority target for the right wing."},
    {"id": "r-11", "profile_id": "p-soule", "date_logged": "2025-06-22", "stage": "Saltata", "source_name": "Anonymous ITK (X)", "deal_formula": "Loan", "evolution_description": "Reported loan-to-Leicester collapse; club sources deny any loan structure was ever discussed."},
    # Gasperini
    {"id": "r-12", "profile_id": "p-gasperini", "date_logged": "2025-06-05", "stage": "Contatti", "source_name": "Gianluca Di Marzio", "deal_formula": "Free Transfer", "evolution_description": "With contract expiring, Gasperini holds talks over a possible new project. Renewal not yet signed."},
]
