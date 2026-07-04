import { useState } from "react";
import { Plus, History, Route, FileText } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { Crest } from "@/components/Crest";
import { ContractCard } from "@/components/ContractCard";
import { CareerOverview } from "@/components/CareerOverview";
import { RumorTimeline } from "@/components/RumorTimeline";
import { ConsistencyWidget } from "@/components/ConsistencyWidget";
import { ArticleDraftDialog } from "@/components/ArticleDraftDialog";

export const ProfileView = ({ profile, rumors, checkResult, checking, onAddRumor }) => {
  const { t } = useI18n();
  const [tab, setTab] = useState("cronologia");
  const [articleOpen, setArticleOpen] = useState(false);
  const isCoach = profile.role === "Coach";
  const accent = isCoach ? "#00E5FF" : "#39FF14";

  const openArticle = () => {
    if (!rumors.length) {
      toast.error(t.noRumorsDraft);
      return;
    }
    setArticleOpen(true);
  };

  const tabs = [
    { key: "cronologia", label: t.chronology, icon: History },
    { key: "carriera", label: t.career, icon: Route },
  ];

  return (
    <div className="tm-fade-up mx-auto max-w-6xl">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 rounded-xl border border-white/10 bg-[#121620] p-5 sm:flex-row sm:items-center">
        <img src={profile.image} alt={profile.full_name} className="h-20 w-20 rounded-xl object-cover object-top" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span
              className="rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest"
              style={{ borderColor: `${accent}66`, backgroundColor: `${accent}1A`, color: accent }}
            >
              {isCoach ? t.coach : t.player}
            </span>
            <span className="text-xs text-gray-500">{profile.position}{profile.league && profile.league !== "—" ? ` · ${profile.league}` : ""}</span>
          </div>
          <h2 className="mt-1 font-heading text-3xl font-black tracking-tight text-white">{profile.full_name}</h2>
          <div className="mt-1 flex items-center gap-2 text-sm text-gray-400">
            <Crest club={profile.current_club} size={22} />
            <span className="font-bold text-white">{profile.current_club}</span>
            <span className="text-gray-600">·</span>
            <span>{profile.nationality}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            data-testid="export-draft-btn"
            onClick={openArticle}
            className="flex items-center justify-center gap-2 rounded-lg border border-white/15 px-4 py-2.5 font-heading text-sm font-bold uppercase tracking-widest text-gray-200 transition-all hover:border-[#39FF14] hover:text-[#39FF14]"
          >
            <FileText size={16} /> {t.exportDraft}
          </button>
          <button
            data-testid="profile-add-rumor-btn"
            onClick={() => onAddRumor(profile.id)}
            className="flex items-center justify-center gap-2 rounded-lg bg-[#39FF14] px-5 py-2.5 font-heading text-sm font-black uppercase tracking-widest text-black transition-all hover:bg-[#39FF14]/85 hover:shadow-[0_0_20px_rgba(57,255,20,0.4)]"
          >
            <Plus size={18} strokeWidth={3} /> {t.addRumorFor}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex gap-1 rounded-lg border border-white/10 bg-[#121620] p-1">
            {tabs.map((tb) => (
              <button
                key={tb.key}
                data-testid={`profile-tab-${tb.key}`}
                onClick={() => setTab(tb.key)}
                className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-bold transition-all ${
                  tab === tb.key ? "bg-white/10 text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                <tb.icon size={15} /> {tb.label}
              </button>
            ))}
          </div>
          <div className="rounded-xl border border-white/10 bg-[#121620] p-6">
            {tab === "cronologia" ? <RumorTimeline rumors={rumors} profile={profile} /> : <CareerOverview profile={profile} />}
          </div>
        </div>

        {/* Aside */}
        <div className="space-y-5">
          {(checkResult || checking) && <ConsistencyWidget result={checkResult} checking={checking} />}
          <ContractCard profile={profile} />
        </div>
      </div>

      <ArticleDraftDialog open={articleOpen} onClose={() => setArticleOpen(false)} profile={profile} />
    </div>
  );
};
