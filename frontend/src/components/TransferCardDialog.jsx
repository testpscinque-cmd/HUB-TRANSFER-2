import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { X, Download, Loader2, Zap, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { stageConfig, stageLabel, stageTemp } from "@/lib/stages";
import { Crest } from "@/components/Crest";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import { dateTime } from "@/lib/time";

const yearOf = (d) => (d && d.length >= 4 ? d.slice(0, 4) : "—");

export const TransferCardDialog = ({ open, onClose, profile, rumors }) => {
  const { t, lang } = useI18n();
  const cardRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!open || !profile) return null;

  const isCoach = profile.role === "Coach";
  // Evolutionary line: oldest -> newest
  const ordered = [...rumors].sort(
    (a, b) => new Date(a.logged_at || a.date_logged) - new Date(b.logged_at || b.date_logged)
  );
  const latest = ordered[ordered.length - 1];
  const latestCfg = latest ? stageConfig[latest.stage] || stageConfig["Interesse Iniziale"] : null;

  const download = async () => {
    if (!cardRef.current) return;
    setBusy(true);
    try {
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 2, cacheBust: true, backgroundColor: "#0F172A" });
      const link = document.createElement("a");
      link.download = `transfercard-${profile.full_name.replace(/\s+/g, "-").toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();
      toast.success(t.imageSaved);
    } catch {
      toast.error("Export failed");
    } finally {
      setBusy(false);
    }
  };

  const copySummary = async () => {
    const lines = [
      `${profile.full_name} — ${profile.current_club}`,
      `${t.contractData}: ${yearOf(profile.contract_expiry)} · ${profile.estimated_salary || "—"} · ${profile.market_value || "—"}`,
      "",
      ...ordered.map((r) => `• [${stageLabel(r.stage, lang)}] ${r.evolution_description} (${r.source_name})`),
    ];
    await navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    toast.success(t.linkCopied);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="tm-fade-up relative z-10 flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl" data-testid="transfer-card-dialog">
        <div className="flex items-start justify-between border-b border-slate-100 px-5 py-3.5">
          <div>
            <h2 className="font-heading text-lg font-black uppercase text-slate-900">{t.transferCardTitle}</h2>
            <p className="mt-0.5 text-xs text-slate-500">{t.transferCardSub}</p>
          </div>
          <button onClick={onClose} data-testid="transfer-card-close" className="text-slate-400 hover:text-slate-900"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto bg-slate-100 p-4">
          {/* Exportable card */}
          <div ref={cardRef} className="overflow-hidden rounded-2xl" style={{ background: "#0F172A" }} data-testid="transfer-card-canvas">
            <div className="flex items-center justify-between px-5 pt-5">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: "#05A845" }}>
                  <Zap size={15} className="text-white" fill="white" />
                </span>
                <span className="font-heading text-sm font-black uppercase tracking-tight text-white">
                  Memory<span style={{ color: "#39D3A0" }}>Transfer</span>
                </span>
              </div>
              <span className="rounded-full px-2 py-0.5 font-heading text-[9px] font-black uppercase tracking-[0.2em]" style={{ background: "rgba(255,255,255,0.08)", color: "#94A3B8" }}>
                Transfer Tracker
              </span>
            </div>

            <div className="flex items-center gap-4 px-5 pt-4">
              <PlayerAvatar name={profile.full_name} size={64} isCoach={isCoach} rounded="rounded-2xl" />
              <div className="min-w-0 flex-1">
                <div className="truncate font-heading text-2xl font-black leading-tight text-white">{profile.full_name}</div>
                <div className="mt-0.5 flex items-center gap-1.5 text-xs" style={{ color: "#94A3B8" }}>
                  <Crest club={profile.current_club} size={18} />
                  <span className="font-bold text-white">{profile.current_club}</span>
                  <span>· {profile.position}</span>
                </div>
              </div>
            </div>

            {latest && (
              <div className="mx-5 mt-4 flex items-center justify-between rounded-xl px-3 py-2" style={{ background: "rgba(255,255,255,0.05)" }}>
                <span className="font-heading text-[10px] font-bold uppercase tracking-widest" style={{ color: "#94A3B8" }}>{t.currentStatus}</span>
                <span className="rounded-full px-2.5 py-0.5 font-heading text-[11px] font-black uppercase" style={{ background: stageTemp[latest.stage]?.color || "#3B82F6", color: "#fff" }}>
                  {stageLabel(latest.stage, lang)}
                </span>
              </div>
            )}

            {/* Contract snapshot */}
            <div className="mx-5 mt-3 grid grid-cols-3 gap-2">
              {[
                { k: t.expiry, v: yearOf(profile.contract_expiry) },
                { k: t.salary, v: profile.estimated_salary || "—" },
                { k: t.marketValue, v: profile.market_value || "—" },
              ].map((c) => (
                <div key={c.k} className="rounded-xl px-2.5 py-2 text-center" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="font-heading text-sm font-black text-white">{c.v}</div>
                  <div className="mt-0.5 text-[8px] font-bold uppercase tracking-wider" style={{ color: "#64748B" }}>{c.k}</div>
                </div>
              ))}
            </div>

            {/* Evolutionary line */}
            <div className="px-5 py-4">
              <div className="mb-2 font-heading text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "#64748B" }}>{t.chronology}</div>
              <div className="space-y-2">
                {ordered.slice(-5).map((r) => {
                  const color = stageTemp[r.stage]?.color || "#3B82F6";
                  return (
                    <div key={r.id} className="flex gap-2.5">
                      <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: color, boxShadow: `0 0 0 3px ${color}22` }} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-heading text-[11px] font-black uppercase" style={{ color }}>{stageLabel(r.stage, lang)}</span>
                          <span className="text-[9px]" style={{ color: "#64748B" }}>{dateTime(r.logged_at || r.date_logged, lang)}</span>
                        </div>
                        <p className="line-clamp-2 text-[11px] leading-snug text-slate-300">{r.evolution_description}</p>
                        <p className="text-[9px] font-semibold" style={{ color: "#39D3A0" }}>{r.source_name}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between border-t px-5 py-2.5" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
              <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "#64748B" }}>
                {ordered.length} updates · {profile.representation_agency || "—"}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "#64748B" }}>memorytransfer.app</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 border-t border-slate-100 px-5 py-3.5">
          <button
            data-testid="transfer-card-copy"
            onClick={copySummary}
            className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:border-slate-400 hover:text-slate-900"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />} {t.shareCard}
          </button>
          <button
            data-testid="transfer-card-download"
            onClick={download}
            disabled={busy}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#05A845] px-5 py-2.5 font-heading text-sm font-black uppercase tracking-wider text-white transition-all hover:bg-[#048B39] disabled:opacity-60"
          >
            {busy ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            {busy ? t.downloading : t.downloadImage}
          </button>
        </div>
      </div>
    </div>
  );
};
