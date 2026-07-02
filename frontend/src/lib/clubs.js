// Club monogram + color map for text-based crests (no real logos).
const CLUBS = {
  napoli: { abbr: "NAP", color: "#0C8CE0" },
  juventus: { abbr: "JUV", color: "#2B2B2B" },
  atalanta: { abbr: "ATA", color: "#1E71B8" },
  bologna: { abbr: "BOL", color: "#A2213A" },
  inter: { abbr: "INT", color: "#0A5CB8" },
  milan: { abbr: "MIL", color: "#E4002B" },
  "ac milan": { abbr: "MIL", color: "#E4002B" },
  "as roma": { abbr: "ROM", color: "#8E1F2F" },
  roma: { abbr: "ROM", color: "#8E1F2F" },
  lazio: { abbr: "LAZ", color: "#2F9BD6" },
  fiorentina: { abbr: "FIO", color: "#5D2E8E" },
  genoa: { abbr: "GEN", color: "#B01B2E" },
  como: { abbr: "COM", color: "#0A3A82" },
  parma: { abbr: "PAR", color: "#F7D000", text: "#0A3A82" },
  "aston villa": { abbr: "AVL", color: "#95BFE5", text: "#4B0D2E" },
  chelsea: { abbr: "CHE", color: "#034694" },
  "manchester united": { abbr: "MUN", color: "#DA020E" },
  "manchester city": { abbr: "MCI", color: "#6CABDD", text: "#0A2240" },
  arsenal: { abbr: "ARS", color: "#EF0107" },
  tottenham: { abbr: "TOT", color: "#132257" },
  leicester: { abbr: "LEI", color: "#003090" },
  psg: { abbr: "PSG", color: "#0A2240" },
  lille: { abbr: "LIL", color: "#C8102E" },
  "bayern munich": { abbr: "BAY", color: "#DC052D" },
  "rb leipzig": { abbr: "RBL", color: "#DD0741" },
  "real madrid": { abbr: "RMA", color: "#00529F" },
  barcelona: { abbr: "BAR", color: "#A50044" },
  "atletico madrid": { abbr: "ATM", color: "#CB3524" },
  "river plate": { abbr: "RIV", color: "#E4002B" },
  "vélez sarsfield": { abbr: "VEL", color: "#0A2A6B" },
  "az alkmaar": { abbr: "AZ", color: "#E4002B" },
  psv: { abbr: "PSV", color: "#E4002B" },
  basel: { abbr: "BAS", color: "#C8102E" },
  girona: { abbr: "GIR", color: "#C8102E" },
  anderlecht: { abbr: "AND", color: "#4C1C24" },
  wolfsburg: { abbr: "WOB", color: "#65B32E" },
  charleroi: { abbr: "CHA", color: "#0A0A0A" },
  frosinone: { abbr: "FRO", color: "#F4C300", text: "#0033A0" },
  spezia: { abbr: "SPE", color: "#0A0A0A" },
  trapani: { abbr: "TRA", color: "#C8102E" },
  palermo: { abbr: "PAL", color: "#E48FB4", text: "#0A0A0A" },
  "dinamo zagreb": { abbr: "DIN", color: "#0057B8" },
  "italy nt": { abbr: "ITA", color: "#0068A8" },
  "free agent": { abbr: "FA", color: "#334155" },
  tbd: { abbr: "?", color: "#334155" },
  sampdoria: { abbr: "SAM", color: "#1B458F" },
  catanzaro: { abbr: "CAT", color: "#C8102E" },
  avellino: { abbr: "AVE", color: "#009639" },
  cesena: { abbr: "CES", color: "#000000" },
  sassuolo: { abbr: "SAS", color: "#0A7B3E" },
  udinese: { abbr: "UDI", color: "#0A0A0A" },
  liverpool: { abbr: "LIV", color: "#C8102E" },
  cremonese: { abbr: "CRE", color: "#A2213A" },
  bari: { abbr: "BAR", color: "#C8102E" },
  cagliari: { abbr: "CAG", color: "#8E1F2F" },
  pescara: { abbr: "PES", color: "#1C6BB8" },
  lecce: { abbr: "LEC", color: "#F7D000", text: "#C8102E" },
  benevento: { abbr: "BEN", color: "#F7D000", text: "#0A0A0A" },
  empoli: { abbr: "EMP", color: "#0057B8" },
  spal: { abbr: "SPA", color: "#0A67B2" },
  monza: { abbr: "MON", color: "#C8102E" },
  modena: { abbr: "MOD", color: "#F7D000", text: "#0A3A82" },
  vicenza: { abbr: "VIC", color: "#C8102E" },
  carrarese: { abbr: "CAR", color: "#F7D000", text: "#0057B8" },
  bisceglie: { abbr: "BIS", color: "#0057B8" },
  galatasaray: { abbr: "GAL", color: "#C8102E", text: "#F7D000" },
  charlton: { abbr: "CHA", color: "#C8102E" },
  torino: { abbr: "TOR", color: "#8B1A1A" },
  lyon: { abbr: "OL", color: "#0A2240" },
  "saudi pro league": { abbr: "SPL", color: "#0A6B3B" },
  "juventus u23": { abbr: "JUV", color: "#2B2B2B" },
};

function hashColor(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  return `hsl(${Math.abs(h) % 360}, 52%, 42%)`;
}

export function getClub(name) {
  if (!name) return { abbr: "?", color: "#334155" };
  const key = name.trim().toLowerCase();
  if (CLUBS[key]) return CLUBS[key];
  for (const k in CLUBS) {
    if (key.includes(k) || k.includes(key)) return CLUBS[k];
  }
  const abbr =
    name
      .replace(/[^a-zA-ZÀ-ÿ ]/g, "")
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 3)
      .toUpperCase() || name.slice(0, 3).toUpperCase();
  return { abbr, color: hashColor(name) };
}
