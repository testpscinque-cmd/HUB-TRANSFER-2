import { Building2, CalendarClock, Wallet, Briefcase, Flag, TrendingUp } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Crest } from "@/components/Crest";

const yearOf = (d) => (d && d.length >= 4 ? d.slice(0, 4) : "—");

const Row = ({ icon: Icon, label, value, accent }) => (
  <div className="flex items-center justify-between border-t border-white/5 py-2.5 first:border-0">
    <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-gray-500">
      <Icon size={14} /> {label}
    </span>
    <span className="font-heading text-sm font-bold text-white" style={accent ? { color: accent } : {}}>
      {value || "—"}
    </span>
  </div>
);

export const ContractCard = ({ profile }) => {
  const { t } = useI18n();
  const expiringSoon = profile?.contract_expiry && Number(yearOf(profile.contract_expiry)) <= 2026;
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#121620] shadow-lg" data-testid="contract-card">
      <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
        <Crest club={profile.current_club} size={28} />
        <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-white">{t.contractData}</h3>
      </div>
      <div className="px-4 py-1.5">
        <Row icon={Building2} label={t.club} value={profile.current_club} />
        <Row icon={CalendarClock} label={t.expiry} value={yearOf(profile.contract_expiry)} accent={expiringSoon ? "#FF007F" : "#39FF14"} />
        <Row icon={Wallet} label={t.salary} value={profile.estimated_salary} />
        <Row icon={TrendingUp} label={t.marketValue} value={profile.market_value} />
        <Row icon={Briefcase} label={t.agent} value={profile.representation_agency} />
        <Row icon={Flag} label={t.nationality} value={profile.nationality} />
      </div>
      {profile.internal_notes && (
        <div className="border-t border-white/5 px-4 py-3">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-gray-500">{t.notes}</p>
          <p className="text-xs leading-relaxed text-gray-300">{profile.internal_notes}</p>
        </div>
      )}
    </div>
  );
};
