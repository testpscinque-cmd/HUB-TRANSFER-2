import { Kanban, Target, Radio } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Crest } from "@/components/Crest";

const STAGES = [
  { key: "Contatti Avviati", color: "#3B82F6" },
  { key: "Trattativa", color: "#F59E0B" },
  { key: "Fonti Verificate", color: "#8B5CF6" },
  { key: "Here We Go", color: "#05A845" },
];

const tierColor = { A: "#05A845", B: "#3B82F6", C: "#94A3B8" };

const Card = ({ item, onMove, t }) => (
  <div className="tm-fade-up rounded-lg border border-slate-200 bg-white p-3 shadow-sm" data-testid={`pipeline-${item.id}`}>
    <div className="mb-1.5 flex items-center gap-2">
      <Crest club={item.target_club} size={22} />
      <span className="font-heading text-sm font-bold text-slate-900">{item.player_name}</span>
      <span
        className="ml-auto rounded px-1.5 py-0.5 text-[9px] font-black uppercase"
        style={{ backgroundColor: `${tierColor[item.priority_tier] || "#94A3B8"}1A`, color: tierColor[item.priority_tier] || "#94A3B8" }}
      >
        {t.priority} {item.priority_tier}
      </span>
    </div>
    <div className="flex items-center gap-1 text-[11px] text-slate-500"><Target size={11} /> {t.target}: {item.target_club}</div>
    <div className="mb-2 flex items-center gap-1 text-[11px] text-slate-500"><Radio size={11} /> {item.source_origin}</div>
    {item.exclusive_angle_notes && <p className="text-xs leading-snug text-slate-600">{item.exclusive_angle_notes}</p>}
    <select
      data-testid={`pipeline-move-${item.id}`}
      value={item.stage}
      onChange={(e) => onMove(item.id, e.target.value)}
      className="mt-2 w-full rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] text-slate-600 focus:border-[#05A845] focus:outline-none"
    >
      {STAGES.map((s) => <option key={s.key} value={s.key}>{s.key}</option>)}
    </select>
  </div>
);

export const PipelineBoard = ({ items, onMove }) => {
  const { t } = useI18n();
  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <Kanban size={17} className="text-blue-500" />
          <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-slate-900">{t.pipelineTitle}</h3>
        </div>
        <p className="mt-0.5 text-[11px] text-slate-500">{t.pipelineSub}</p>
      </div>
      <div className="flex-1 space-y-5 overflow-y-auto p-4">
        {STAGES.map((s) => {
          const col = items.filter((i) => i.stage === s.key);
          return (
            <div key={s.key} data-testid={`pipeline-col-${s.key}`}>
              <div className="mb-2 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="font-heading text-[11px] font-bold uppercase tracking-widest" style={{ color: s.color }}>{s.key}</span>
                <span className="text-[11px] text-slate-400">({col.length})</span>
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
