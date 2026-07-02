import { useI18n } from "@/lib/i18n";
import { Crest } from "@/components/Crest";

export const CareerOverview = ({ profile }) => {
  const { t } = useI18n();
  const history = [...(profile.career_history || [])].sort((a, b) => (a.from || 0) - (b.from || 0));

  if (!history.length) {
    return <p className="py-10 text-center text-sm text-gray-500">{t.noCareer}</p>;
  }

  return (
    <div data-testid="career-overview">
      <h3 className="mb-5 font-heading text-sm font-bold uppercase tracking-[0.2em] text-gray-400">
        {t.careerPath}
      </h3>
      <div className="pl-1">
        {history.map((entry, i) => {
          const current = entry.to == null;
          const years = `${entry.from || "—"} — ${current ? t.present : entry.to}`;
          return (
            <div
              key={`${entry.club}-${i}`}
              className="tm-fade-up relative flex items-center gap-4 border-l border-white/10 pb-6 pl-6 last:border-transparent last:pb-0"
              style={{ animationDelay: `${i * 50}ms` }}
              data-testid={`career-node-${i}`}
            >
              <span
                className={`absolute left-[-9px] top-1 h-[9px] w-[9px] rounded-full ring-4 ring-[#121620] ${
                  current ? "bg-[#39FF14] shadow-[0_0_10px_rgba(57,255,20,0.6)]" : "bg-gray-500"
                }`}
              />
              <Crest club={entry.club} size={44} />
              <div>
                <div className={`font-heading text-base font-bold ${current ? "text-[#39FF14]" : "text-white"}`}>
                  {entry.club}
                </div>
                <div className="font-mono text-xs text-gray-500">{years}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
