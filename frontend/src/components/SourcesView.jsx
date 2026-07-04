import { useI18n } from "@/lib/i18n";
import { SourceDirectory } from "@/components/SourceDirectory";

export const SourcesView = ({ sources }) => {
  const { t } = useI18n();
  return (
    <div className="tm-fade-up mx-auto max-w-4xl space-y-6">
      <div>
        <h2 className="font-heading text-4xl font-black uppercase tracking-tight text-slate-900 sm:text-5xl">{t.sourcesTitle}</h2>
        <p className="mt-1 text-slate-500">{t.sourcesSub}</p>
      </div>
      <SourceDirectory sources={sources} />
    </div>
  );
};
