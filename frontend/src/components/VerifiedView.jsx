import { useI18n } from "@/lib/i18n";
import { SourceDirectory } from "@/components/SourceDirectory";

const VERIFIED_SOURCES = [
  { id: "s-romano", source_name: "Fabrizio Romano", reliability_score: 99, notes: "Fonte top del mercato globale.", featured: true },
  { id: "s-lequipe", source_name: "L'Équipe", reliability_score: 96, notes: "Quotidiano francese con fonti internazionali.", featured: true },
  { id: "s-marca", source_name: "Marca", reliability_score: 95, notes: "Quotidiano spagnolo leader per il mercato europeo.", featured: true },
  { id: "s-athletic", source_name: "The Athletic", reliability_score: 94, notes: "Approfondimenti premium e scoop verificati.", featured: true },
  { id: "s-bbc", source_name: "BBC Sport", reliability_score: 93, notes: "Copertura internazionale autorevole.", featured: true },
  { id: "s-sky", source_name: "Sky Sport", reliability_score: 92, notes: "Fonte televisiva italiana con contatti diretti.", featured: true },
  { id: "s-gazzetta", source_name: "La Gazzetta dello Sport", reliability_score: 91, notes: "Storica voce del mercato italiano.", featured: true },
  { id: "s-corriere", source_name: "Corriere dello Sport", reliability_score: 90, notes: "Quotidiano sportivo italiano storico.", featured: true },
  { id: "s-tuttosport", source_name: "Tuttosport", reliability_score: 89, notes: "Copertura completa del mercato italiano.", featured: true },
  { id: "s-mediaset", source_name: "Sport Mediaset", reliability_score: 88, notes: "Aggiornamenti live e interviste esclusive.", featured: true },
  { id: "s-dimarzio", source_name: "Gianluca Di Marzio", reliability_score: 91, notes: "Insider storico del mercato italiano." },
  { id: "s-pedulla", source_name: "Alfredo Pedullà", reliability_score: 90, notes: "Voce nota per scoop di mercato." },
  { id: "s-moretto", source_name: "Matteo Moretto", reliability_score: 89, notes: "Riflessi di mercato in tempo reale." },
  { id: "s-agresti", source_name: "Romeo Agresti", reliability_score: 88, notes: "Aggiornamenti rapidi e precisi." },
  { id: "s-schira", source_name: "Nicolò Schira", reliability_score: 87, notes: "Riferimenti europei e scoop esclusivi." },
  { id: "s-ornstein", source_name: "David Ornstein", reliability_score: 92, notes: "Fonte internazionale esperta di Premier League." },
  { id: "s-hawkins", source_name: "Fabrice Hawkins", reliability_score: 86, notes: "Voce emergente del mercato inglese." },
  { id: "s-calciomercato", source_name: "Calciomercato.com", reliability_score: 88, notes: "Portale specialistico sui trasferimenti." },
  { id: "s-tmw", source_name: "TuttoMercatoWeb", reliability_score: 87, notes: "Aggiornamenti costanti in tempo reale." },
  { id: "s-sportitalia", source_name: "Sportitalia", reliability_score: 86, notes: "Canale sportivo con insider di mercato." },
];

export const VerifiedView = ({ sources = VERIFIED_SOURCES }) => {
  const { t } = useI18n();

  return (
    <div className="tm-fade-up mx-auto max-w-5xl space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-heading text-4xl font-black uppercase tracking-tight text-slate-900 sm:text-5xl">{t.verifiedTitle}</h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-500">{t.verifiedSub}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-950/5 p-5 text-right">
            <div className="text-xs uppercase tracking-[0.3em] text-slate-500">{t.verifiedBadge}</div>
            <p className="mt-3 text-sm text-slate-700">{t.verifiedIntro}</p>
          </div>
        </div>
      </div>
      <SourceDirectory sources={sources} />
    </div>
  );
};
