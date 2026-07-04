import { useState } from "react";
import { History, Route, FileText, Share2 } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { Crest } from "@/components/Crest";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import { ContractCard } from "@/components/ContractCard";
import { CareerOverview } from "@/components/CareerOverview";
import { RumorTimeline } from "@/components/RumorTimeline";
import { ArticleDraftDialog } from "@/components/ArticleDraftDialog";
import { TransferCardDialog } from "@/components/TransferCardDialog";

export const ProfileView = ({ profile, rumors }) => {
  const { t } = useI18n();
  const [tab, setTab] = useState("cronologia");
  const [articleOpen, setArticleOpen] = useState(false);
  const [cardOpen, setCardOpen] = useState(false);
  const isCoach = profile.role === "Coach";
  const accent = isCoach ? "#0F172A" : "#05A845";

  const openArticle = () => {
    if (!rumors.length) { toast.error(t.noRumorsDraft); return; }
    setArticleOpen(true);
  };
  const openCard = () => {
    if (!rumors.length) { toast.error(t.noRumorsDraft); return; }
    setCardOpen(true);
  };

  const tabs = [
    { key: "cronologia", label: t.chronology, icon: History },
    { key: "carriera", label: t.career, icon: Route },
  ];

  return (
    <div className="tm-fade-up mx-auto max-w-6xl">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
        <PlayerAvatar name={profile.full_name} size={80} isCoach={isCoach} />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span
              className="rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest"
              style={{ borderColor: `${accent}33`, backgroundColor: `${accent}12`, color: accent }}
            >
              {isCoach ? t.coach : t.player}
            </span>
            <span className="text-xs text-slate-500">{profile.position}{profile.league && profile.league !== "—" ? ` · ${profile.league}` : ""}</span>
          </div>
          <h2 className="mt-1 font-heading text-3xl font-black tracking-tight text-slate-900">{profile.full_name}</h2>
          <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
            <Crest club={profile.current_club} size={22} />
            <span className="font-bold text-slate-900">{profile.current_club}</span>
            <span className="text-slate-300">·</span>
            <span>{profile.nationality}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            data-testid="transfer-card-btn"
            onClick={openCard}
            className="flex items-center justify-center gap-2 rounded-lg border border-[#05A845]/40 bg-[#05A845]/5 px-4 py-2.5 font-heading text-sm font-bold uppercase tracking-widest text-[#05A845] transition-all hover:bg-[#05A845]/10"
          >
            <Share2 size={16} /> {t.transferCard}
          </button>
          <button
            data-testid="export-draft-btn"
            onClick={openArticle}
            className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 font-heading text-sm font-bold uppercase tracking-widest text-slate-600 transition-all hover:border-slate-400 hover:text-slate-900"
          >
            <FileText size={16} /> {t.exportDraft}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
            {tabs.map((tb) => (
              <button
                key={tb.key}
                data-testid={`profile-tab-${tb.key}`}
                onClick={() => setTab(tb.key)}
                className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-bold transition-all ${
                  tab === tb.key ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <tb.icon size={15} /> {tb.label}
              </button>
            ))}
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            {tab === "cronologia" ? <RumorTimeline rumors={rumors} profile={profile} /> : <CareerOverview profile={profile} />}
          </div>
        </div>

        {/* Aside */}
        <div className="space-y-5">
          <ContractCard profile={profile} />
        </div>
      </div>

      <ArticleDraftDialog open={articleOpen} onClose={() => setArticleOpen(false)} profile={profile} />
      <TransferCardDialog open={cardOpen} onClose={() => setCardOpen(false)} profile={profile} rumors={rumors} />
    </div>
  );
};
