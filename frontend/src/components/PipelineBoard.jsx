import { Kanban, Target, Radio } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Crest } from "@/components/Crest";

const STAGES = [
  { key: "Contatti Avviati", color: "#94A3B8" },
  { key: "Trattativa", color: "#00E5FF" },
  { key: "Fonti Verificate", color: "#FF007F" },
  { key: "Here We Go", color: "#39FF14" },
];

const tierColor = { A: "#39FF14", B: "#00E5FF", C: "#94A3B8" };

const Card = ({ item, onMove, t }) => (
  <div className="tm-fade-up rounded-lg border border-white/10 bg-[#1B2432] p-3" data-testid={`pipeline-${item.id}`}>
    <div className="mb-1.5 flex items-center gap-2">
      <Crest club={item.target_club} size={22} />
      <span className="font-heading text-sm font-bold text-white">{item.player_name}</span>
      <span
        className="ml-auto rounded px-1.5 py-0.5 text-[9px] font-black uppercase"
        style={{ backgroundColor: `${tierColor[item.priority_tier] || "#94A3B8"}1A`, color: tierColor[item.priority_tier] || "#94A3B8" }}
      >
        {t.priority} {item.priority_tier}
      </span>
    </div>
    <div className="flex items-center gap-1 text-[11px] text-gray-500"><Target size={11} /> {t.target}: {item.target_club}</div>
    <div className="mb-2 flex items-center gap-1 text-[11px] text-gray-500"><Radio size={11} /> {item.source_origin}</div>
    {item.exclusive_angle_notes && <p className="text-xs leading-snug text-gray-300">{item.exclusive_angle_notes}</p>}
    <select
      data-testid={`pipeline-move-${item.id}`}
      value={item.stage}
      onChange={(e) => onMove(item.id, e.target.value)}
      className="mt-2 w-full rounded-md border border-white/10 bg-[#121620] px-2 py-1 text-[11px] text-gray-300 focus:border-[#39FF14] focus:outline-none"
    >
      {STAGES.map((s) => <option key={s.key} value={s.key} className="bg-[#121620]">{s.key}</option>)}
    </select>
  </div>
);

export const PipelineBoard = ({ items, onMove }) => {
  const { t } = useI18n();
  return (
    <div className="flex h-full flex-col rounded-xl border border-white/10 bg-[#121620]">
      <div className="border-b border-white/5 px-4 py-3">
        <div className="flex items-center gap-2">
          <Kanban size={17} className="text-[#00E5FF]" />
          <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-white">{t.pipelineTitle}</h3>
        </div>
        <p className="mt-0.5 text-[11px] text-gray-500">{t.pipelineSub}</p>
      </div>
      <div className="flex-1 space-y-5 overflow-y-auto p-4">
        {STAGES.map((s) => {
          const col = items.filter((i) => i.stage === s.key);
          return (
            <div key={s.key} data-testid={`pipeline-col-${s.key}`}>
              <div className="mb-2 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="font-heading text-[11px] font-bold uppercase tracking-widest" style={{ color: s.color }}>{s.key}</span>
                <span className="text-[11px] text-gray-600">({col.length})</span>
              </div>
              <div className="space-y-2">
                {col.map((item) => <Card key={item.id} item={item} onMove={onMove} t={t} />)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
