// Stage keys are stored in Italian (as per DB). This maps them to display + styling (light theme).
export const STAGES = [
  "Interesse Iniziale",
  "Contatti",
  "Trattativa Avanzata",
  "Fumata Bianca/Ufficiale",
  "Saltata",
];

export const DEAL_FORMULAS = ["Definitive", "Loan", "Loan with obligation", "Free Transfer", "Swap"];

export const stageConfig = {
  "Interesse Iniziale": {
    en: "Initial Interest",
    it: "Interesse Iniziale",
    dot: "bg-blue-500",
    text: "text-blue-600",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
  },
  Contatti: {
    en: "Contacts",
    it: "Contatti",
    dot: "bg-amber-400",
    text: "text-amber-600",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
  },
  "Trattativa Avanzata": {
    en: "Advanced Talks",
    it: "Trattativa Avanzata",
    dot: "bg-red-500",
    text: "text-red-600",
    badge: "bg-red-50 text-red-700 border-red-200",
  },
  "Fumata Bianca/Ufficiale": {
    en: "Official / Here We Go",
    it: "Fumata Bianca / Ufficiale",
    dot: "bg-[#05A845]",
    text: "text-[#05A845]",
    badge: "bg-green-50 text-[#05A845] border-green-200",
  },
  Saltata: {
    en: "Collapsed",
    it: "Saltata",
    dot: "bg-slate-400",
    text: "text-slate-500",
    badge: "bg-slate-100 text-slate-500 border-slate-200",
  },
};

export const stageLabel = (stage, lang) =>
  stageConfig[stage] ? stageConfig[stage][lang] : stage;

// Graphic "thermometer" mapping for negotiation heat: Blue (cold) / Yellow (warm) / Red (hot).
export const stageTemp = {
  "Interesse Iniziale": { color: "#3B82F6", key: "cold", level: 1 },
  Contatti: { color: "#FACC15", key: "warm", level: 2 },
  "Trattativa Avanzata": { color: "#EF4444", key: "hot", level: 3 },
  "Fumata Bianca/Ufficiale": { color: "#05A845", key: "done", level: 3 },
  Saltata: { color: "#94A3B8", key: "off", level: 0 },
};
