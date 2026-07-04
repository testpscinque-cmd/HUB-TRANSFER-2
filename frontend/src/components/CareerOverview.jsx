import { useI18n } from "@/lib/i18n";
import { Crest } from "@/components/Crest";

export const CareerOverview = ({ profile }) => {
  const { t } = useI18n();
  const history = [...(profile.career_history || [])].sort((a, b) => (a.from || 0) - (b.from || 0));

  if (!history.length) {
    return <p className="py-10 text-center text-sm text-slate-400">{t.noCareer}</p>;
  }

  return (
    <div data-testid="career-overview">
      <h3 className="mb-5 font-heading text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
        {t.careerPath}
      </h3>
      <div className="pl-1">
        {history.map((entry, i) => {
          const current = entry.to == null;
          const years = `${entry.from || "—"} — ${current ? t.present : entry.to}`;
          return (
            <div
              key={`${entry.club}-${i}`}
              className="tm-fade-up relative flex items-center gap-4 border-l-2 border-slate-100 pb-6 pl-6 last:border-transparent last:pb-0"
              style={{ animationDelay: `${i * 50}ms` }}
              data-testid={`career-node-${i}`}
            >
              <span
                className={`absolute left-[-7px] top-1 h-[11px] w-[11px] rounded-full ring-4 ring-white ${
                  current ? "bg-[#05A845]" : "bg-slate-300"
                }`}
              />
              <Crest club={entry.club} size={44} />
              <div>
                <div className={`font-heading text-base font-bold ${current ? "text-[#05A845]" : "text-slate-900"}`}>
                  {entry.club}
                </div>
                <div className="font-mono text-xs text-slate-400">{years}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
