import { stageTemp } from "@/lib/stages";

const LABELS = {
  cold: { en: "Cold", it: "Freddo" },
  warm: { en: "Warm", it: "Tiepido" },
  hot: { en: "Hot", it: "Caldo" },
  done: { en: "Official", it: "Ufficiale" },
  off: { en: "Off", it: "Saltata" },
};

// Graphic thermometer: a mercury tube + bulb, filled by negotiation heat.
export const Thermometer = ({ stage, size = 26, lang = "en" }) => {
  const temp = stageTemp[stage] || stageTemp["Interesse Iniziale"];
  const level = temp.level; // 0..3
  const fillPct = level === 0 ? 0 : level === 1 ? 34 : level === 2 ? 62 : 100;
  const label = (LABELS[temp.key] || LABELS.cold)[lang] || LABELS[temp.key].en;
  const w = size;
  const h = Math.round(size * 1.55);
  return (
    <div title={label} data-testid="thermometer" data-temp={temp.key} className="inline-flex shrink-0 items-center" style={{ width: w, height: h }}>
      <svg width={w} height={h} viewBox="0 0 26 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* tube outline */}
        <rect x="9.5" y="2" width="7" height="26" rx="3.5" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1.5" />
        {/* fill */}
        <rect x="11" y={26 - (fillPct / 100) * 22.5} width="4" height={(fillPct / 100) * 22.5} rx="2" fill={temp.color} />
        {/* bulb */}
        <circle cx="13" cy="31.5" r="6.5" fill={level === 0 ? "#CBD5E1" : temp.color} stroke="#fff" strokeWidth="1.5" />
      </svg>
    </div>
  );
};
