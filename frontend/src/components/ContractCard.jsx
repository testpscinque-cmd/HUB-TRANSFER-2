import { Building2, CalendarClock, Wallet, Briefcase, Flag } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const yearOf = (d) => (d && d.length >= 4 ? d.slice(0, 4) : "—");

const Row = ({ icon: Icon, label, value, accent }) => (
  <div className="flex items-center justify-between border-t border-white/5 py-2.5 first:border-0">
    <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-gray-500">
      <Icon size={14} /> {label}
    </span>
    <span
      className="font-heading text-sm font-bold text-white"
      style={accent ? { color: accent } : {}}
    >
      {value || "—"}
    </span>
  </div>
);

export const ContractCard = ({ profile }) => {
  const { t } = useI18n();
  const expiringSoon = profile?.contract_expiry && Number(yearOf(profile.contract_expiry)) <= 2026;

  return (
    <div
      className="tm-fade-up overflow-hidden rounded-xl border border-white/10 bg-[#121620] shadow-lg"
      data-testid="contract-card"
    >
      <div className="relative h-32 overflow-hidden">
        <img
          src={profile.image}
          alt={profile.full_name}
          className="h-full w-full object-cover object-top opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121620] via-[#121620]/50 to-transparent" />
        <div className="absolute left-4 top-3">
          <span className="rounded-full border border-white/15 bg-black/40 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur">
            {profile.role}
          </span>
        </div>
        <div className="absolute bottom-3 left-4 right-4">
          <h3 className="font-heading text-xl font-black leading-tight text-white drop-shadow">
            {profile.full_name}
          </h3>
          {profile.position && (
            <p className="text-xs font-semibold text-[#39FF14]">{profile.position}</p>
          )}
        </div>
      </div>

      <div className="px-4 py-1.5">
        <Row icon={Building2} label={t.club} value={profile.current_club} />
        <Row
          icon={CalendarClock}
          label={t.expiry}
          value={yearOf(profile.contract_expiry)}
          accent={expiringSoon ? "#FF007F" : "#39FF14"}
        />
        <Row icon={Wallet} label={t.salary} value={profile.estimated_salary} />
        <Row icon={Briefcase} label={t.agent} value={profile.representation_agency} />
        <Row icon={Flag} label={t.nationality} value={profile.nationality} />
      </div>

      {profile.internal_notes && (
        <div className="border-t border-white/5 px-4 py-3">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-gray-500">
            {t.notes}
          </p>
          <p className="text-xs leading-relaxed text-gray-300">{profile.internal_notes}</p>
        </div>
      )}
    </div>
  );
};
