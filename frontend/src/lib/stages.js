// Stage keys are stored in Italian (as per DB). This maps them to display + styling.
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
    dot: "bg-gray-400 ring-gray-400/20",
    text: "text-gray-300",
    badge: "bg-white/5 text-gray-300 border-white/10",
  },
  Contatti: {
    en: "Contacts",
    it: "Contatti",
    dot: "bg-[#00E5FF] ring-[#00E5FF]/20",
    text: "text-[#00E5FF]",
    badge: "bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/30",
  },
  "Trattativa Avanzata": {
    en: "Advanced Talks",
    it: "Trattativa Avanzata",
    dot: "bg-[#FF007F] ring-[#FF007F]/20 shadow-[0_0_10px_rgba(255,0,127,0.6)]",
    text: "text-[#FF007F]",
    badge: "bg-[#FF007F]/10 text-[#FF007F] border-[#FF007F]/30",
  },
  "Fumata Bianca/Ufficiale": {
    en: "Official / Here We Go",
    it: "Fumata Bianca / Ufficiale",
    dot: "bg-[#39FF14] ring-[#39FF14]/20 shadow-[0_0_10px_rgba(57,255,20,0.6)]",
    text: "text-[#39FF14]",
    badge: "bg-[#39FF14]/10 text-[#39FF14] border-[#39FF14]/30",
  },
  Saltata: {
    en: "Collapsed",
    it: "Saltata",
    dot: "bg-red-500 ring-red-500/20",
    text: "text-red-400",
    badge: "bg-red-500/10 text-red-400 border-red-500/30",
  },
};

export const stageLabel = (stage, lang) =>
  stageConfig[stage] ? stageConfig[stage][lang] : stage;

// Graphic "thermometer" mapping for negotiation heat.
export const stageTemp = {
  "Interesse Iniziale": { color: "#38BDF8", key: "cold" },
  Contatti: { color: "#FBBF24", key: "warm" },
  "Trattativa Avanzata": { color: "#FF3B30", key: "hot" },
  "Fumata Bianca/Ufficiale": { color: "#39FF14", key: "done" },
  Saltata: { color: "#64748B", key: "off" },
};
