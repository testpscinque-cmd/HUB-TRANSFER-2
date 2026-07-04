import { ListChecks, Check, CalendarClock } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export const VerificationChecklist = ({ tasks, onToggle }) => {
  const { t, lang } = useI18n();
  const fmt = (d) => {
    try { return new Date(d).toLocaleDateString(lang === "it" ? "it-IT" : "en-GB", { day: "2-digit", month: "short" }); }
    catch { return d; }
  };
  const done = tasks.every((x) => x.is_done);

  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <ListChecks size={17} className="text-[#05A845]" />
          <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-slate-900">{t.verifyTitle}</h3>
        </div>
        <p className="mt-0.5 text-[11px] text-slate-500">{t.verifySub}</p>
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto p-3">
        {done && <p className="px-2 py-6 text-center text-sm text-[#05A845]">{t.allDone}</p>}
        {tasks.map((task) => (
          <button
            key={task.id}
            data-testid={`task-${task.id}`}
            onClick={() => onToggle(task)}
            className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-all ${
              task.is_done ? "border-slate-100 bg-slate-50 opacity-70" : "border-slate-200 bg-white hover:border-[#05A845]/40"
            }`}
          >
            <span
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-all ${
                task.is_done ? "border-[#05A845] bg-[#05A845] text-white" : "border-slate-300"
              }`}
            >
              {task.is_done && <Check size={13} strokeWidth={3} />}
            </span>
            <div className="min-w-0">
              <p className={`text-sm leading-snug ${task.is_done ? "text-slate-400 line-through" : "text-slate-700"}`}>
                {task.action_required}
              </p>
              <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
                <span className="font-bold text-blue-500">{task.player_name}</span>
                <span className="flex items-center gap-1"><CalendarClock size={10} /> {t.deadline}: {fmt(task.deadline)}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
