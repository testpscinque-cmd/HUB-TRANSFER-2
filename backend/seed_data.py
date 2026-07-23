"""TransferHub — Serie A Edition. Curated realistic 2025/26 Serie A database."""
import re

SEED_VERSION = 31


def _slug(s):
    s = s.lower()
    s = (s.replace("à", "a").replace("è", "e").replace("é", "e").replace("ì", "i")
         .replace("ò", "o").replace("ù", "u").replace("ç", "c").replace("ø", "o")
         .replace("š", "s").replace("ć", "c").replace("đ", "d").replace("ž", "z")
         .replace("ñ", "n").replace("ö", "o").replace("ü", "u").replace("ä", "a"))
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return s


# ---------------- TEAMS (20) ----------------
def _t(name, abbr, color, wealth, budget, wages, text="#ffffff"):
    return {"id": "t-" + _slug(name), "name": name, "abbr": abbr, "color": color,
            "text_color": text, "wealth_tier": wealth, "budget_m": budget, "wage_space_m": wages}

TEAMS = [
    _t("Inter", "INT", "#0A1A8C", "Budget Alto", 80, 55),
    _t("Milan", "MIL", "#C8102E", "Budget Alto", 90, 60),
    _t("Juventus", "JUV", "#111111", "Budget Alto", 100, 65),
    _t("Napoli", "NAP", "#12A0D7", "Budget Alto", 95, 55),
    _t("Roma", "ROM", "#8E1F2F", "Budget Alto", 60, 45),
    _t("Atalanta", "ATA", "#1C61B6", "Bilanciato", 55, 40),
    _t("Lazio", "LAZ", "#5CB8E6", "Bilanciato", 40, 38, "#0B2C4A"),
    _t("Fiorentina", "FIO", "#5E2E8E", "Bilanciato", 45, 35),
    _t("Bologna", "BOL", "#A21C28", "Bilanciato", 45, 32),
    _t("Torino", "TOR", "#7A0E14", "Bilanciato", 30, 28),
    _t("Como", "COM", "#0B3D91", "Bilanciato", 60, 35),
    _t("Udinese", "UDI", "#1F2937", "Autofinanziamento", 25, 22),
    _t("Genoa", "GEN", "#C8102E", "Autofinanziamento", 20, 20),
    _t("Cagliari", "CAG", "#B01F30", "Autofinanziamento", 18, 18),
    _t("Verona", "VER", "#F4C300", "Autofinanziamento", 15, 16, "#0B2C4A"),
    _t("Lecce", "LEC", "#E30613", "Autofinanziamento", 15, 15),
    _t("Parma", "PAR", "#F5C518", "Autofinanziamento", 22, 20, "#0B2C4A"),
    _t("Sassuolo", "SAS", "#0B7A3B", "Autofinanziamento", 20, 18),
    _t("Pisa", "PIS", "#0A2A66", "Autofinanziamento", 14, 14),
    _t("Cremonese", "CRE", "#9B1C2E", "Autofinanziamento", 14, 14),
]


# ---------------- PLAYERS ----------------
def _pl(name, team, pos, age, exp, nat, tier, salary="---", value="---", extra=False):
    return {"id": "p-" + _slug(name), "name": name, "team": team, "position": pos, "age": age,
            "contract_expiry": exp, "nationality": nat, "value_tier": tier, "salary": salary,
            "market_value": value, "extracomunitario": extra}

PLAYERS = [
    # Inter
    _pl("Yann Sommer", "Inter", "POR", 37, "2026", "Svizzera", "Media", "€3.5M", "€8M"),
    _pl("Alessandro Bastoni", "Inter", "DIF", 26, "2028", "Italia", "Top", "€5.5M", "€70M"),
    _pl("Nicolò Barella", "Inter", "CEN", 29, "2029", "Italia", "Top", "€6.5M", "€75M"),
    _pl("Hakan Çalhanoğlu", "Inter", "CEN", 32, "2027", "Turchia", "Top", "€6.5M", "€35M"),
    _pl("Lautaro Martínez", "Inter", "ATT", 28, "2029", "Argentina", "Top", "€9M", "€110M", True),
    _pl("Marcus Thuram", "Inter", "ATT", 28, "2028", "Francia", "Top", "€6.5M", "€75M"),
    # Milan
    _pl("Mike Maignan", "Milan", "POR", 30, "2026", "Francia", "Top", "€5M", "€30M"),
    _pl("Theo Hernández", "Milan", "DIF", 28, "2026", "Francia", "Top", "€4.5M", "€45M"),
    _pl("Tijjani Reijnders", "Milan", "CEN", 27, "2030", "Olanda", "Top", "€4M", "€60M"),
    _pl("Christian Pulisic", "Milan", "ATT", 27, "2027", "USA", "Top", "€4M", "€55M", True),
    _pl("Rafael Leão", "Milan", "ATT", 26, "2028", "Portogallo", "Top", "€7M", "€75M"),
    _pl("Álvaro Morata", "Milan", "ATT", 33, "2028", "Spagna", "Media", "€4.5M", "€10M"),
    # Juventus
    _pl("Michele Di Gregorio", "Juventus", "POR", 28, "2029", "Italia", "Media", "€2.5M", "€25M"),
    _pl("Gleison Bremer", "Juventus", "DIF", 29, "2028", "Brasile", "Top", "€5M", "€50M", True),
    _pl("Kenan Yıldız", "Juventus", "ATT", 21, "2029", "Turchia", "Top", "€1.5M", "€60M"),
    _pl("Manuel Locatelli", "Juventus", "CEN", 28, "2028", "Italia", "Media", "€6.5M", "€25M"),
    _pl("Dušan Vlahović", "Juventus", "ATT", 26, "2026", "Serbia", "Top", "€12M", "€40M", True),
    _pl("Teun Koopmeiners", "Juventus", "CEN", 28, "2029", "Olanda", "Media", "€5M", "€35M"),
    # Napoli
    _pl("Alex Meret", "Napoli", "POR", 29, "2027", "Italia", "Media", "€2M", "€18M"),
    _pl("Amir Rrahmani", "Napoli", "DIF", 32, "2027", "Kosovo", "Media", "€2.5M", "€15M", True),
    _pl("Stanislav Lobotka", "Napoli", "CEN", 31, "2027", "Slovacchia", "Media", "€3M", "€28M"),
    _pl("Scott McTominay", "Napoli", "CEN", 29, "2028", "Scozia", "Top", "€4.5M", "€50M", True),
    _pl("Kevin De Bruyne", "Napoli", "CEN", 34, "2027", "Belgio", "Top", "€6M", "€25M"),
    _pl("Romelu Lukaku", "Napoli", "ATT", 33, "2027", "Belgio", "Media", "€6M", "€20M"),
    # Roma
    _pl("Mile Svilar", "Roma", "POR", 26, "2030", "Serbia", "Media", "€2M", "€30M", True),
    _pl("Gianluca Mancini", "Roma", "DIF", 30, "2027", "Italia", "Media", "€3M", "€18M"),
    _pl("Lorenzo Pellegrini", "Roma", "CEN", 29, "2026", "Italia", "Media", "€5M", "€20M"),
    _pl("Paulo Dybala", "Roma", "ATT", 32, "2026", "Argentina", "Top", "€7M", "€18M", True),
    _pl("Artem Dovbyk", "Roma", "ATT", 28, "2029", "Ucraina", "Media", "€3.5M", "€35M", True),
    _pl("Matías Soulé", "Roma", "ATT", 23, "2029", "Argentina", "Media", "€2.5M", "€30M", True),
    # Atalanta
    _pl("Marco Carnesecchi", "Atalanta", "POR", 26, "2029", "Italia", "Media", "€1.5M", "€30M"),
    _pl("Giorgio Scalvini", "Atalanta", "DIF", 22, "2027", "Italia", "Top", "€2M", "€40M"),
    _pl("Éderson", "Atalanta", "CEN", 26, "2028", "Brasile", "Top", "€3M", "€55M", True),
    _pl("Charles De Ketelaere", "Atalanta", "ATT", 25, "2028", "Belgio", "Media", "€3M", "€35M"),
    _pl("Ademola Lookman", "Atalanta", "ATT", 28, "2027", "Nigeria", "Top", "€3.5M", "€50M", True),
    _pl("Gianluca Scamacca", "Atalanta", "ATT", 27, "2028", "Italia", "Media", "€3M", "€30M"),
    # Lazio
    _pl("Ivan Provedel", "Lazio", "POR", 32, "2027", "Italia", "Media", "€2M", "€14M"),
    _pl("Alessio Romagnoli", "Lazio", "DIF", 31, "2027", "Italia", "Media", "€3M", "€15M"),
    _pl("Nicolò Rovella", "Lazio", "CEN", 24, "2028", "Italia", "Media", "€2M", "€30M"),
    _pl("Mattia Zaccagni", "Lazio", "ATT", 31, "2029", "Italia", "Media", "€3.5M", "€25M"),
    _pl("Boulaye Dia", "Lazio", "ATT", 29, "2027", "Senegal", "Media", "€2.5M", "€15M", True),
    # Fiorentina
    _pl("David De Gea", "Fiorentina", "POR", 35, "2027", "Spagna", "Media", "€2.5M", "€6M"),
    _pl("Pietro Comuzzo", "Fiorentina", "DIF", 21, "2029", "Italia", "Top", "€1.2M", "€35M"),
    _pl("Rolando Mandragora", "Fiorentina", "CEN", 28, "2027", "Italia", "Accessibile", "€1.8M", "€10M"),
    _pl("Moise Kean", "Fiorentina", "ATT", 26, "2029", "Italia", "Top", "€2.5M", "€40M"),
    _pl("Albert Guðmundsson", "Fiorentina", "ATT", 28, "2028", "Islanda", "Media", "€2.5M", "€25M", True),
    # Bologna
    _pl("Łukasz Skorupski", "Bologna", "POR", 35, "2027", "Polonia", "Accessibile", "€1.5M", "€5M"),
    _pl("Sam Beukema", "Bologna", "DIF", 27, "2028", "Olanda", "Media", "€1.5M", "€25M"),
    _pl("Lewis Ferguson", "Bologna", "CEN", 26, "2028", "Scozia", "Media", "€1.8M", "€30M", True),
    _pl("Riccardo Orsolini", "Bologna", "ATT", 29, "2027", "Italia", "Media", "€2.5M", "€28M"),
    _pl("Santiago Castro", "Bologna", "ATT", 21, "2029", "Argentina", "Media", "€1.2M", "€25M", True),
    # Torino
    _pl("Vanja Milinković-Savić", "Torino", "POR", 29, "2028", "Serbia", "Media", "€1.5M", "€15M", True),
    _pl("Saúl Coco", "Torino", "DIF", 27, "2028", "Guinea Eq.", "Accessibile", "€1M", "€12M", True),
    _pl("Samuele Ricci", "Torino", "CEN", 24, "2028", "Italia", "Media", "€1.5M", "€30M"),
    _pl("Che Adams", "Torino", "ATT", 29, "2028", "Scozia", "Accessibile", "€1.8M", "€12M", True),
    # Como
    _pl("Pepe Reina", "Como", "POR", 43, "2026", "Spagna", "Accessibile", "€1M", "€1M"),
    _pl("Alberto Moreno", "Como", "DIF", 33, "2026", "Spagna", "Accessibile", "€1.5M", "€3M"),
    _pl("Nico Paz", "Como", "CEN", 21, "2027", "Argentina", "Top", "€1.5M", "€45M", True),
    _pl("Patrick Cutrone", "Como", "ATT", 28, "2027", "Italia", "Accessibile", "€1.2M", "€8M"),
    _pl("Assane Diao", "Como", "ATT", 20, "2029", "Spagna", "Media", "€0.8M", "€20M"),
    # Udinese
    _pl("Razvan Sava", "Udinese", "POR", 23, "2029", "Romania", "Accessibile", "€0.5M", "€6M"),
    _pl("Thomas Kristensen", "Udinese", "DIF", 28, "2027", "Danimarca", "Accessibile", "€0.8M", "€8M"),
    _pl("Jurgen Ekkelenkamp", "Udinese", "CEN", 25, "2027", "Olanda", "Accessibile", "€0.9M", "€10M"),
    _pl("Lorenzo Lucca", "Udinese", "ATT", 25, "2028", "Italia", "Media", "€1M", "€25M"),
    # Genoa
    _pl("Nicola Leali", "Genoa", "POR", 32, "2027", "Italia", "Accessibile", "€0.8M", "€4M"),
    _pl("Koni De Winter", "Genoa", "DIF", 24, "2028", "Belgio", "Media", "€0.9M", "€18M"),
    _pl("Morten Frendrup", "Genoa", "CEN", 25, "2028", "Danimarca", "Media", "€0.9M", "€22M"),
    _pl("Andrea Pinamonti", "Genoa", "ATT", 27, "2028", "Italia", "Media", "€2M", "€15M"),
    # Cagliari
    _pl("Elia Caprile", "Cagliari", "POR", 24, "2029", "Italia", "Media", "€0.8M", "€12M"),
    _pl("Yerry Mina", "Cagliari", "DIF", 31, "2026", "Colombia", "Accessibile", "€1.2M", "€5M", True),
    _pl("Nadir Zortea", "Cagliari", "DIF", 26, "2028", "Italia", "Accessibile", "€0.6M", "€8M"),
    _pl("Roberto Piccoli", "Cagliari", "ATT", 25, "2028", "Italia", "Accessibile", "€0.9M", "€12M"),
    # Verona
    _pl("Lorenzo Montipò", "Verona", "POR", 30, "2027", "Italia", "Accessibile", "€0.7M", "€5M"),
    _pl("Diego Coppola", "Verona", "DIF", 22, "2028", "Italia", "Accessibile", "€0.5M", "€10M"),
    _pl("Suat Serdar", "Verona", "CEN", 29, "2027", "Germania", "Accessibile", "€1M", "€6M"),
    _pl("Casper Tengstedt", "Verona", "ATT", 26, "2028", "Danimarca", "Accessibile", "€0.7M", "€7M"),
    # Lecce
    _pl("Wladimiro Falcone", "Lecce", "POR", 30, "2027", "Italia", "Accessibile", "€0.7M", "€8M"),
    _pl("Federico Baschirotto", "Lecce", "DIF", 29, "2027", "Italia", "Accessibile", "€0.6M", "€10M"),
    _pl("Ylber Ramadani", "Lecce", "CEN", 29, "2027", "Albania", "Accessibile", "€0.5M", "€7M", True),
    _pl("Nikola Krstović", "Lecce", "ATT", 25, "2028", "Montenegro", "Media", "€0.8M", "€20M", True),
    # Parma
    _pl("Zion Suzuki", "Parma", "POR", 23, "2028", "Giappone", "Media", "€0.8M", "€18M", True),
    _pl("Giovanni Leoni", "Parma", "DIF", 19, "2029", "Italia", "Media", "€0.4M", "€15M"),
    _pl("Adrián Bernabé", "Parma", "CEN", 24, "2028", "Spagna", "Accessibile", "€0.7M", "€12M"),
    _pl("Ange-Yoan Bonny", "Parma", "ATT", 22, "2028", "Francia", "Media", "€0.6M", "€18M"),
    # Sassuolo
    _pl("Stefano Turati", "Sassuolo", "POR", 24, "2028", "Italia", "Accessibile", "€0.5M", "€6M"),
    _pl("Josh Doig", "Sassuolo", "DIF", 23, "2028", "Scozia", "Accessibile", "€0.6M", "€8M", True),
    _pl("Kristian Thorstvedt", "Sassuolo", "CEN", 27, "2027", "Norvegia", "Accessibile", "€0.8M", "€9M", True),
    _pl("Armand Laurienté", "Sassuolo", "ATT", 27, "2027", "Francia", "Media", "€1M", "€18M"),
    # Pisa
    _pl("Adrian Šemper", "Pisa", "POR", 28, "2027", "Croazia", "Accessibile", "€0.4M", "€3M", True),
    _pl("Antonio Caracciolo", "Pisa", "DIF", 35, "2026", "Italia", "Accessibile", "€0.3M", "€1M"),
    _pl("Marius Marin", "Pisa", "CEN", 27, "2027", "Romania", "Accessibile", "€0.4M", "€5M", True),
    _pl("Matteo Tramoni", "Pisa", "ATT", 25, "2028", "Francia", "Accessibile", "€0.5M", "€8M"),
    # Cremonese
    _pl("Marco Silvestri", "Cremonese", "POR", 35, "2027", "Italia", "Accessibile", "€0.6M", "€2M"),
    _pl("Matteo Bianchetti", "Cremonese", "DIF", 32, "2027", "Italia", "Accessibile", "€0.4M", "€2M"),
    _pl("Michele Castagnetti", "Cremonese", "CEN", 36, "2026", "Italia", "Accessibile", "€0.3M", "€1M"),
    _pl("Franco Vázquez", "Cremonese", "ATT", 37, "2026", "Argentina", "Accessibile", "€0.5M", "€2M", True),
    # ---- Rose ampliate (titolari + riserve principali) ----
    # Inter
    _pl("Josep Martínez", "Inter", "POR", 27, "2028", "Spagna", "Accessibile", "€1.5M", "€10M"),
    _pl("Denzel Dumfries", "Inter", "DIF", 30, "2028", "Olanda", "Media", "€4M", "€30M"),
    _pl("Federico Dimarco", "Inter", "DIF", 28, "2027", "Italia", "Top", "€4M", "€45M"),
    _pl("Yann Bisseck", "Inter", "DIF", 25, "2028", "Germania", "Media", "€2M", "€28M"),
    _pl("Francesco Acerbi", "Inter", "DIF", 38, "2026", "Italia", "Accessibile", "€2.5M", "€3M"),
    _pl("Henrikh Mkhitaryan", "Inter", "CEN", 37, "2026", "Armenia", "Media", "€3.5M", "€4M", True),
    _pl("Davide Frattesi", "Inter", "CEN", 26, "2028", "Italia", "Media", "€3M", "€35M"),
    _pl("Piotr Zieliński", "Inter", "CEN", 32, "2028", "Polonia", "Media", "€4M", "€15M"),
    _pl("Mehdi Taremi", "Inter", "ATT", 33, "2027", "Iran", "Accessibile", "€3M", "€8M", True),
    # Milan
    _pl("Fikayo Tomori", "Milan", "DIF", 28, "2027", "Inghilterra", "Media", "€3.5M", "€28M"),
    _pl("Strahinja Pavlović", "Milan", "DIF", 25, "2029", "Serbia", "Media", "€2M", "€25M", True),
    _pl("Malick Thiaw", "Milan", "DIF", 24, "2028", "Germania", "Media", "€1.8M", "€25M"),
    _pl("Youssouf Fofana", "Milan", "CEN", 27, "2028", "Francia", "Media", "€2.5M", "€30M"),
    _pl("Ruben Loftus-Cheek", "Milan", "CEN", 30, "2027", "Inghilterra", "Media", "€4M", "€18M"),
    _pl("Samuel Chukwueze", "Milan", "ATT", 26, "2028", "Nigeria", "Media", "€3M", "€22M", True),
    _pl("Santiago Giménez", "Milan", "ATT", 25, "2029", "Messico", "Media", "€3.5M", "€35M", True),
    _pl("Christopher Nkunku", "Milan", "ATT", 28, "2030", "Francia", "Top", "€5M", "€40M"),
    # Juventus
    _pl("Mattia Perin", "Juventus", "POR", 33, "2027", "Italia", "Accessibile", "€2M", "€3M"),
    _pl("Federico Gatti", "Juventus", "DIF", 28, "2028", "Italia", "Media", "€2.5M", "€28M"),
    _pl("Pierre Kalulu", "Juventus", "DIF", 25, "2028", "Francia", "Media", "€2.5M", "€28M"),
    _pl("Andrea Cambiaso", "Juventus", "DIF", 26, "2029", "Italia", "Media", "€2.5M", "€45M"),
    _pl("Khéphren Thuram", "Juventus", "CEN", 25, "2029", "Francia", "Media", "€3M", "€40M"),
    _pl("Weston McKennie", "Juventus", "CEN", 27, "2026", "USA", "Media", "€2.5M", "€25M", True),
    _pl("Francisco Conceição", "Juventus", "ATT", 23, "2030", "Portogallo", "Media", "€2.5M", "€30M"),
    _pl("Jonathan David", "Juventus", "ATT", 26, "2030", "Canada", "Top", "€6M", "€45M", True),
    # Napoli
    _pl("Giovanni Di Lorenzo", "Napoli", "DIF", 32, "2028", "Italia", "Media", "€3.5M", "€15M"),
    _pl("Leonardo Spinazzola", "Napoli", "DIF", 33, "2027", "Italia", "Accessibile", "€2.5M", "€6M"),
    _pl("Juan Jesus", "Napoli", "DIF", 34, "2026", "Brasile", "Accessibile", "€1.5M", "€2M", True),
    _pl("André-Frank Zambo Anguissa", "Napoli", "CEN", 30, "2027", "Camerun", "Media", "€4M", "€30M", True),
    _pl("Billy Gilmour", "Napoli", "CEN", 24, "2028", "Scozia", "Accessibile", "€2M", "€22M", True),
    _pl("Matteo Politano", "Napoli", "ATT", 32, "2027", "Italia", "Media", "€3M", "€14M"),
    _pl("David Neres", "Napoli", "ATT", 28, "2028", "Brasile", "Media", "€3M", "€35M", True),
    _pl("Rasmus Højlund", "Napoli", "ATT", 22, "2030", "Danimarca", "Top", "€4.5M", "€40M"),
    # Roma
    _pl("Zeki Çelik", "Roma", "DIF", 28, "2027", "Turchia", "Accessibile", "€2M", "€8M", True),
    _pl("Evan Ndicka", "Roma", "DIF", 26, "2028", "Costa d'Avorio", "Media", "€3M", "€35M", True),
    _pl("Angeliño", "Roma", "DIF", 29, "2028", "Spagna", "Media", "€2.5M", "€18M"),
    _pl("Bryan Cristante", "Roma", "CEN", 31, "2027", "Italia", "Media", "€3M", "€14M"),
    _pl("Manu Koné", "Roma", "CEN", 24, "2029", "Francia", "Media", "€2.5M", "€35M"),
    _pl("Stephan El Shaarawy", "Roma", "ATT", 33, "2026", "Italia", "Accessibile", "€3M", "€5M"),
    _pl("Evan Ferguson", "Roma", "ATT", 21, "2030", "Irlanda", "Media", "€2M", "€25M", True),
    # Atalanta
    _pl("Berat Djimsiti", "Atalanta", "DIF", 32, "2027", "Albania", "Accessibile", "€2M", "€8M", True),
    _pl("Isak Hien", "Atalanta", "DIF", 26, "2028", "Svezia", "Media", "€1.8M", "€30M"),
    _pl("Odilon Kossounou", "Atalanta", "DIF", 24, "2029", "Costa d'Avorio", "Media", "€2M", "€25M", True),
    _pl("Marten de Roon", "Atalanta", "CEN", 34, "2026", "Olanda", "Accessibile", "€2.5M", "€4M"),
    _pl("Mario Pašalić", "Atalanta", "CEN", 30, "2027", "Croazia", "Media", "€2.5M", "€18M"),
    _pl("Lazar Samardžić", "Atalanta", "CEN", 24, "2028", "Serbia", "Media", "€1.8M", "€25M"),
    _pl("Daniel Maldini", "Atalanta", "ATT", 24, "2029", "Italia", "Media", "€1.5M", "€22M"),
    # Lazio
    _pl("Mario Gila", "Lazio", "DIF", 25, "2028", "Spagna", "Media", "€1.8M", "€25M"),
    _pl("Manuel Lazzari", "Lazio", "DIF", 32, "2027", "Italia", "Accessibile", "€2M", "€5M"),
    _pl("Matteo Guendouzi", "Lazio", "CEN", 27, "2029", "Francia", "Media", "€3M", "€28M"),
    _pl("Danilo Cataldi", "Lazio", "CEN", 31, "2028", "Italia", "Accessibile", "€1.8M", "€8M"),
    _pl("Gustav Isaksen", "Lazio", "ATT", 25, "2029", "Danimarca", "Accessibile", "€1.5M", "€18M"),
    _pl("Valentín Castellanos", "Lazio", "ATT", 27, "2028", "Argentina", "Media", "€2.5M", "€22M", True),
    _pl("Pedro", "Lazio", "ATT", 38, "2026", "Spagna", "Accessibile", "€2M", "€2M"),
    # Fiorentina
    _pl("Dodô", "Fiorentina", "DIF", 27, "2027", "Brasile", "Media", "€2M", "€22M", True),
    _pl("Luca Ranieri", "Fiorentina", "DIF", 27, "2028", "Italia", "Accessibile", "€1.2M", "€12M"),
    _pl("Robin Gosens", "Fiorentina", "DIF", 31, "2028", "Germania", "Accessibile", "€2M", "€10M"),
    _pl("Cher Ndour", "Fiorentina", "CEN", 21, "2029", "Italia", "Accessibile", "€1M", "€10M"),
    _pl("Edoardo Bove", "Fiorentina", "CEN", 24, "2029", "Italia", "Media", "€1.2M", "€18M"),
    _pl("Nicolò Fagioli", "Fiorentina", "CEN", 25, "2028", "Italia", "Media", "€1.5M", "€20M"),
    # Bologna
    _pl("Federico Ravaglia", "Bologna", "POR", 26, "2027", "Italia", "Accessibile", "€0.6M", "€4M"),
    _pl("Juan Miranda", "Bologna", "DIF", 26, "2028", "Spagna", "Accessibile", "€1M", "€10M"),
    _pl("Nikola Moro", "Bologna", "CEN", 28, "2027", "Croazia", "Accessibile", "€1M", "€8M", True),
    _pl("Remo Freuler", "Bologna", "CEN", 34, "2027", "Svizzera", "Accessibile", "€1.8M", "€6M", True),
    _pl("Dan Ndoye", "Bologna", "ATT", 25, "2028", "Svizzera", "Media", "€1.5M", "€30M", True),
    _pl("Thijs Dallinga", "Bologna", "ATT", 25, "2029", "Olanda", "Accessibile", "€1M", "€15M"),
    # Torino
    _pl("Guillermo Maripán", "Torino", "DIF", 31, "2028", "Cile", "Accessibile", "€1.5M", "€8M", True),
    _pl("Adam Masina", "Torino", "DIF", 32, "2027", "Marocco", "Accessibile", "€1M", "€3M", True),
    _pl("Ivan Ilić", "Torino", "CEN", 25, "2028", "Serbia", "Accessibile", "€1.2M", "€14M", True),
    _pl("Cyril Ngonge", "Torino", "ATT", 25, "2028", "Belgio", "Accessibile", "€1M", "€12M"),
    _pl("Duván Zapata", "Torino", "ATT", 35, "2027", "Colombia", "Accessibile", "€3M", "€4M", True),
    # Como
    _pl("Marc-Oliver Kempf", "Como", "DIF", 31, "2027", "Germania", "Accessibile", "€1.2M", "€4M"),
    _pl("Maximo Perrone", "Como", "CEN", 23, "2029", "Argentina", "Accessibile", "€1M", "€14M", True),
    _pl("Sergi Roberto", "Como", "CEN", 34, "2026", "Spagna", "Accessibile", "€1.5M", "€3M"),
    _pl("Gabriel Strefezza", "Como", "ATT", 29, "2028", "Brasile", "Accessibile", "€1M", "€10M", True),
    _pl("Alieu Fadera", "Como", "ATT", 24, "2029", "Gambia", "Accessibile", "€0.8M", "€10M", True),
    # Udinese
    _pl("Jaka Bijol", "Udinese", "DIF", 26, "2028", "Slovenia", "Media", "€1.2M", "€18M", True),
    _pl("Christian Kabasele", "Udinese", "DIF", 34, "2026", "Belgio", "Accessibile", "€0.8M", "€2M"),
    _pl("Sandi Lovrić", "Udinese", "CEN", 27, "2028", "Slovenia", "Accessibile", "€1M", "€14M"),
    _pl("Florian Thauvin", "Udinese", "ATT", 33, "2027", "Francia", "Accessibile", "€1.5M", "€6M"),
    _pl("Keinan Davis", "Udinese", "ATT", 28, "2028", "Inghilterra", "Accessibile", "€0.9M", "€8M"),
    # Genoa
    _pl("Alessandro Vogliacco", "Genoa", "DIF", 27, "2028", "Italia", "Accessibile", "€0.7M", "€8M"),
    _pl("Johan Vásquez", "Genoa", "DIF", 27, "2028", "Messico", "Accessibile", "€0.9M", "€12M", True),
    _pl("Milan Badelj", "Genoa", "CEN", 37, "2026", "Croazia", "Accessibile", "€0.8M", "€1M", True),
    _pl("Ruslan Malinovskyi", "Genoa", "CEN", 32, "2027", "Ucraina", "Accessibile", "€1.2M", "€8M", True),
    _pl("Vitinha", "Genoa", "ATT", 25, "2028", "Portogallo", "Accessibile", "€1M", "€12M"),
    # Cagliari
    _pl("Sebastiano Luperto", "Cagliari", "DIF", 29, "2027", "Italia", "Accessibile", "€0.8M", "€6M"),
    _pl("Michel Adopo", "Cagliari", "CEN", 25, "2028", "Francia", "Accessibile", "€0.5M", "€5M", True),
    _pl("Razvan Marin", "Cagliari", "CEN", 29, "2027", "Romania", "Accessibile", "€0.8M", "€6M", True),
    _pl("Gianluca Gaetano", "Cagliari", "CEN", 26, "2028", "Italia", "Accessibile", "€0.8M", "€10M"),
    _pl("Leonardo Pavoletti", "Cagliari", "ATT", 37, "2026", "Italia", "Accessibile", "€0.6M", "€1M"),
    # Verona
    _pl("Martin Frese", "Verona", "DIF", 24, "2029", "Danimarca", "Accessibile", "€0.4M", "€5M"),
    _pl("Unai Núñez", "Verona", "DIF", 29, "2027", "Spagna", "Accessibile", "€0.6M", "€6M"),
    _pl("Reda Belahyane", "Verona", "CEN", 22, "2029", "Marocco", "Accessibile", "€0.4M", "€6M", True),
    _pl("Daniel Mosquera", "Verona", "ATT", 25, "2029", "Colombia", "Accessibile", "€0.5M", "€6M", True),
    # Lecce
    _pl("Kialonda Gaspar", "Lecce", "DIF", 24, "2028", "Angola", "Accessibile", "€0.4M", "€5M", True),
    _pl("Balthazar Pierret", "Lecce", "CEN", 24, "2029", "Francia", "Accessibile", "€0.3M", "€4M"),
    _pl("Lassana Coulibaly", "Lecce", "CEN", 29, "2027", "Mali", "Accessibile", "€0.4M", "€4M", True),
    _pl("Santiago Pierotti", "Lecce", "ATT", 24, "2028", "Argentina", "Accessibile", "€0.3M", "€6M", True),
    # Parma
    _pl("Enrico Delprato", "Parma", "DIF", 26, "2028", "Italia", "Accessibile", "€0.5M", "€8M"),
    _pl("Nahuel Estévez", "Parma", "CEN", 25, "2028", "Argentina", "Accessibile", "€0.4M", "€6M", True),
    _pl("Hernani", "Parma", "CEN", 31, "2027", "Brasile", "Accessibile", "€0.5M", "€4M", True),
    _pl("Mateo Pellegrino", "Parma", "ATT", 24, "2029", "Argentina", "Accessibile", "€0.4M", "€8M", True),
    _pl("Pontus Almqvist", "Parma", "ATT", 26, "2028", "Svezia", "Accessibile", "€0.4M", "€6M"),
    # Sassuolo
    _pl("Tarik Muharemović", "Sassuolo", "DIF", 22, "2029", "Bosnia", "Accessibile", "€0.4M", "€6M", True),
    _pl("Daniel Boloca", "Sassuolo", "CEN", 27, "2028", "Romania", "Accessibile", "€0.5M", "€8M"),
    _pl("Domenico Berardi", "Sassuolo", "ATT", 31, "2027", "Italia", "Media", "€2.5M", "€14M"),
    _pl("Cristian Volpato", "Sassuolo", "ATT", 22, "2028", "Italia", "Accessibile", "€0.6M", "€10M"),
    # Pisa
    _pl("Simone Canestrelli", "Pisa", "DIF", 25, "2028", "Italia", "Accessibile", "€0.5M", "€8M"),
    _pl("Idrissa Touré", "Pisa", "DIF", 27, "2027", "Germania", "Accessibile", "€0.3M", "€4M"),
    _pl("Samuele Angori", "Pisa", "DIF", 22, "2029", "Italia", "Accessibile", "€0.2M", "€4M"),
    _pl("M'Bala Nzola", "Pisa", "ATT", 29, "2027", "Angola", "Accessibile", "€0.6M", "€6M", True),
    # Cremonese
    _pl("Emanuele Zuelli", "Cremonese", "CEN", 24, "2028", "Italia", "Accessibile", "€0.3M", "€3M"),
    _pl("Warren Bondo", "Cremonese", "CEN", 22, "2029", "Francia", "Accessibile", "€0.3M", "€5M"),
    _pl("Federico Bonazzoli", "Cremonese", "ATT", 29, "2027", "Italia", "Accessibile", "€0.6M", "€5M"),
    _pl("Jamie Vardy", "Cremonese", "ATT", 39, "2026", "Inghilterra", "Accessibile", "€1M", "€2M"),

]


# ---------------- COACHES (20) ----------------
def _co(name, team, age, exp, nat="Italia"):
    return {"id": "c-" + _slug(name), "name": name, "team": team, "role": "Allenatore",
            "age": age, "contract_expiry": exp, "nationality": nat}

COACHES = [
    _co("Cristian Chivu", "Inter", 45, "2027", "Romania"),
    _co("Massimiliano Allegri", "Milan", 58, "2027"),
    _co("Igor Tudor", "Juventus", 48, "2027", "Croazia"),
    _co("Antonio Conte", "Napoli", 56, "2027"),
    _co("Gian Piero Gasperini", "Roma", 68, "2028"),
    _co("Ivan Jurić", "Atalanta", 50, "2027", "Croazia"),
    _co("Maurizio Sarri", "Lazio", 67, "2027"),
    _co("Stefano Pioli", "Fiorentina", 60, "2028"),
    _co("Vincenzo Italiano", "Bologna", 48, "2027"),
    _co("Marco Baroni", "Torino", 62, "2027"),
    _co("Cesc Fàbregas", "Como", 38, "2028", "Spagna"),
    _co("Kosta Runjaić", "Udinese", 54, "2027", "Germania"),
    _co("Patrick Vieira", "Genoa", 50, "2027", "Francia"),
    _co("Fabio Pisacane", "Cagliari", 39, "2027"),
    _co("Paolo Zanetti", "Verona", 43, "2027"),
    _co("Marco Giampaolo", "Lecce", 58, "2026"),
    _co("Carlos Cuesta", "Parma", 30, "2027", "Spagna"),
    _co("Fabio Grosso", "Sassuolo", 48, "2027"),
    _co("Alberto Gilardino", "Pisa", 43, "2027"),
    _co("Davide Nicola", "Cremonese", 53, "2026"),
]


# ---------------- UPDATES (scoop timeline for marquee sagas) ----------------
# stage: rumor | trattativa | ufficiale ; type: post | video ; days_ago offset
def _u(player, days, stage, source, verified, text, typ="post"):
    return {"player_id": "p-" + _slug(player), "days_ago": days, "stage": stage,
            "source": source, "verified": verified, "text": text, "type": typ}

UPDATES = [
    # Vlahović (expiring 2026)
    _u("Dušan Vlahović", 12, "rumor", "Tuttosport", False, "Rinnovo lontano: la Juve valuta la cessione per non perderlo a zero nel 2026."),
    _u("Dušan Vlahović", 6, "trattativa", "Gianluca Di Marzio", True, "Contatti con un club di Premier League: si discutono cifre e ingaggio.", "video"),
    _u("Dušan Vlahović", 1, "trattativa", "Fabrizio Romano", True, "Offerta in arrivo: la Juve apre alla partenza in questa sessione. Trattativa viva."),
    # Kean
    _u("Moise Kean", 9, "rumor", "Sky Sport", True, "Un club saudita valuta di pagare la clausola di rescissione di Kean."),
    _u("Moise Kean", 3, "trattativa", "Nicolò Schira", False, "La Fiorentina lavora al rinnovo per blindarlo e alzare la clausola."),
    # Lookman
    _u("Ademola Lookman", 14, "rumor", "Fabrizio Romano", True, "Interesse dall'Inter per Lookman: sondaggio esplorativo con l'Atalanta."),
    _u("Ademola Lookman", 5, "trattativa", "Gazzetta dello Sport", True, "Distanza sulla valutazione: l'Atalanta chiede oltre 50M.", "video"),
    # Nico Paz
    _u("Nico Paz", 10, "rumor", "Sky Sport", True, "Il Real Madrid monitora la recompra su Nico Paz per la prossima estate."),
    _u("Nico Paz", 2, "trattativa", "Matteo Moretto", False, "Il Como prova a blindarlo con un nuovo contratto e ingaggio raddoppiato."),
    # Comuzzo
    _u("Pietro Comuzzo", 8, "trattativa", "Fabrizio Romano", True, "Il Napoli torna su Comuzzo con un'offerta migliorata. La Fiorentina resiste."),
    # De Bruyne
    _u("Kevin De Bruyne", 20, "ufficiale", "Napoli", True, "Ufficiale: Kevin De Bruyne è un nuovo giocatore del Napoli.", "video"),
    # Leão
    _u("Rafael Leão", 4, "rumor", "Tuttosport", False, "Voci su un possibile addio di Leão: il Milan al momento non tratta."),
]

# ---------------- CURATED NEWS (X/Twitter-style feed, always populated) ----------------
# hours_ago: how recent. stage: rumor|trattativa|ufficiale. handle for X-style @.
def _n(title, source, handle, verified, stage, player, team, hours_ago):
    return {"id": "n-" + _slug(title)[:40] + "-" + str(hours_ago), "title": title, "source": source,
            "handle": handle, "verified": verified, "stage": stage, "player": player, "team": team,
            "hours_ago": hours_ago}

CURATED_NEWS = [
    _n("🚨 EXCL: la Juventus apre alla cessione di Vlahović in questa sessione. Contatti in corso con un club di Premier League, si tratta su cifre e ingaggio. Here we go soon? 🔜", "Fabrizio Romano", "FabrizioRomano", True, "trattativa", "Dušan Vlahović", "Juventus", 3),
    _n("Inter, pressing su Ademola Lookman: sondaggio con l'Atalanta ma la distanza sulla valutazione resta ampia (oltre 50M). Trattativa aperta.", "Gianluca Di Marzio", "DiMarzio", True, "trattativa", "Ademola Lookman", "Atalanta", 5),
    _n("UFFICIALE: Kevin De Bruyne è un nuovo giocatore del Napoli. Contratto fino al 2027. ✍️ Here we go confermato.", "Sky Sport", "SkySport", True, "ufficiale", "Kevin De Bruyne", "Napoli", 26),
    _n("Il Real Madrid monitora la recompra su Nico Paz. Il Como lavora al rinnovo con ingaggio raddoppiato per blindare il gioiello argentino.", "Sky Sport", "SkySport", True, "rumor", "Nico Paz", "Como", 8),
    _n("Napoli torna con forza su Pietro Comuzzo: offerta migliorata alla Fiorentina, che per ora resiste. Affare da seguire nelle prossime ore.", "Fabrizio Romano", "FabrizioRomano", True, "trattativa", "Pietro Comuzzo", "Fiorentina", 10),
    _n("Un club saudita valuta di pagare la clausola di Moise Kean. La Fiorentina prova a rinnovare e alzare la clausola rescissoria.", "Nicolò Schira", "NicoSchira", False, "rumor", "Moise Kean", "Fiorentina", 12),
    _n("Milan, si valuta il futuro di Rafael Leão: al momento nessuna trattativa, i rossoneri fanno muro. Solo voci dalla Premier.", "Tuttosport", "tuttosport", False, "rumor", "Rafael Leão", "Milan", 14),
    _n("UFFICIALE ✅ Jonathan David è un nuovo attaccante della Juventus. Firma fino al 2030, operazione a parametro zero.", "Fabrizio Romano", "FabrizioRomano", True, "ufficiale", "Jonathan David", "Juventus", 40),
    _n("Roma, Evan Ferguson può restare: i giallorossi trattano il riscatto con il Brighton. Gasperini lo vuole trattenere.", "Gianluca Di Marzio", "DiMarzio", True, "trattativa", "Evan Ferguson", "Roma", 7),
    _n("Rasmus Højlund-Napoli: è fatta per il prestito con obbligo. Il danese ha già detto sì, visite mediche in programma. 🔴 Here we go!", "Fabrizio Romano", "FabrizioRomano", True, "ufficiale", "Rasmus Højlund", "Napoli", 30),
    _n("Lazio, Guendouzi nel mirino di un club inglese. Sarri lo considera incedibile: nessuna offerta ufficiale finora.", "Gazzetta dello Sport", "Gazzetta_it", True, "rumor", "Matteo Guendouzi", "Lazio", 16),
    _n("Bologna, il Napoli insiste per Dan Ndoye: contatti avviati, si discute la formula. Richiesta rossoblù intorno ai 35M.", "Matteo Moretto", "MatteMoretto", False, "trattativa", "Dan Ndoye", "Bologna", 9),
    _n("Atalanta, l'Inter riflette anche su Ederson a centrocampo: è l'alternativa a Lookman. Prime valutazioni interne.", "Sky Sport", "SkySport", True, "rumor", "Éderson", "Atalanta", 18),
    _n("UFFICIALE: Christopher Nkunku al Milan. Colpo di prestigio per Allegri, contratto fino al 2030. 🔴⚫", "Sky Sport", "SkySport", True, "ufficiale", "Christopher Nkunku", "Milan", 48),
    _n("Fiorentina, chiusura vicina per il rinnovo di Comuzzo con clausola più alta. La dirigenza vuole blindarlo prima delle offerte.", "Gianluca Di Marzio", "DiMarzio", True, "trattativa", "Pietro Comuzzo", "Fiorentina", 22),
    _n("Juventus, per il post-Vlahović spunta un nome nuovo in attacco. La dirigenza monitora diversi profili in Serie A.", "Tuttosport", "tuttosport", False, "rumor", "Dušan Vlahović", "Juventus", 20),
    _n("Torino, Ricci verso la permanenza: il Milan ci ha pensato ma il prezzo è alto. Vagnati fa muro.", "Gianluca Di Marzio", "DiMarzio", True, "rumor", "Samuele Ricci", "Torino", 28),
    _n("Roma, offerta per Manu Koné dalla Premier: i giallorossi rispondono picche. Vale almeno 40M per Massara.", "Fabrizio Romano", "FabrizioRomano", True, "trattativa", "Manu Koné", "Roma", 11),
    _n("Como scatenato: dopo Nico Paz, Fabregas chiede altri rinforzi di qualità. Budget importante per la sessione.", "Calciomercato.it", "cmdotcom", False, "rumor", "Nico Paz", "Como", 33),
    _n("Inter, Frattesi richiesto in Premier: l'Inter valuta solo offerte sopra i 40M. Nessuna trattativa concreta al momento.", "Nicolò Schira", "NicoSchira", False, "rumor", "Davide Frattesi", "Inter", 15),
    _n("Napoli, Conte blinda Anguissa: rinnovo in dirittura d'arrivo. Fumata bianca attesa a breve.", "Sky Sport", "SkySport", True, "trattativa", "André-Frank Zambo Anguissa", "Napoli", 6),
    _n("Lecce, Krstović nel mirino di due club di Serie A: la valutazione è salita a 25M dopo l'ottima stagione.", "Gazzetta dello Sport", "Gazzetta_it", True, "rumor", "Nikola Krstović", "Lecce", 19),
    _n("Milan, Theo Hernández in scadenza 2026: rinnovo in stallo, si valutano offerte. Situazione da monitorare.", "Fabrizio Romano", "FabrizioRomano", True, "trattativa", "Theo Hernández", "Milan", 13),
    _n("UFFICIALE ✅ Denzel Dumfries rinnova con l'Inter fino al 2028. Nessun addio: l'olandese resta a Milano.", "Sky Sport", "SkySport", True, "ufficiale", "Denzel Dumfries", "Inter", 52),
    _n("Genoa, De Winter piace a mezza Serie A: il club rossoblù non scende sotto i 20M. Trattative in stand-by.", "Matteo Moretto", "MatteMoretto", False, "rumor", "Koni De Winter", "Genoa", 24),
    _n("Fiorentina, Kean-Arabia: la Fiorentina spera che il giocatore rifiuti e resti. Decisione attesa nei prossimi giorni.", "Gianluca Di Marzio", "DiMarzio", True, "trattativa", "Moise Kean", "Fiorentina", 4),
]


# Tier-1 sources auto-verified in scanner
TIER1_SOURCES = ["Fabrizio Romano", "Sky Sport", "Sky Sport Italia", "Gianluca Di Marzio", "Gazzetta dello Sport", "Gazzetta"]

# Mock video news (YouTube-style) for the VIDEO scanner
MOCK_VIDEOS = [
    {"id": "v1", "title": "Calciomercato: Vlahović verso l'addio? Tutte le cifre", "channel": "Sky Sport", "verified": True, "player": "Dušan Vlahović", "team": "Juventus", "views": "142K", "days_ago": 1},
    {"id": "v2", "title": "Lookman-Inter: a che punto siamo davvero", "channel": "Fabrizio Romano", "verified": True, "player": "Ademola Lookman", "team": "Atalanta", "views": "310K", "days_ago": 2},
    {"id": "v3", "title": "De Bruyne al Napoli: l'annuncio ufficiale", "channel": "Gazzetta dello Sport", "verified": True, "player": "Kevin De Bruyne", "team": "Napoli", "views": "520K", "days_ago": 5},
    {"id": "v4", "title": "Moise Kean e la clausola: scenari di mercato", "channel": "Calciomercato.it", "verified": False, "player": "Moise Kean", "team": "Fiorentina", "views": "88K", "days_ago": 3},
    {"id": "v5", "title": "Nico Paz, il gioiello del Como: futuro tra Real e big", "channel": "Gianluca Di Marzio", "verified": True, "player": "Nico Paz", "team": "Como", "views": "97K", "days_ago": 2},
    {"id": "v6", "title": "Comuzzo, derby di mercato: Napoli in pressing", "channel": "TransferMarketTV", "verified": False, "player": "Pietro Comuzzo", "team": "Fiorentina", "views": "45K", "days_ago": 4},
]
