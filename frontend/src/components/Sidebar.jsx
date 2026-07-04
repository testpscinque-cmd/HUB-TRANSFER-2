import { Zap, LayoutDashboard, Radar, Users, Signal, LogOut, Flame } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const NavBtn = ({ icon: Icon, label, active, onClick, testid, badge, dot }) => (
  <button
    data-testid={testid}
    onClick={onClick}
    className={`group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold transition-all ${
      active
        ? "bg-[#05A845]/10 text-[#05A845] shadow-[inset_3px_0_0_#05A845]"
        : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
    }`}
  >
    <span className="relative">
      <Icon size={18} />
      {dot && (
        <span className="absolute -right-1 -top-1 flex h-2.5 w-2.5" data-testid="nav-live-dot">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
        </span>
      )}
    </span>
    <span>{label}</span>
    {badge > 0 ? (
      <span className="ml-auto rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-black text-white">
        {badge}
      </span>
    ) : dot ? (
      <span className="ml-auto rounded-full bg-red-100 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-red-500">
        Live
      </span>
    ) : null}
  </button>
);

export const Sidebar = ({ view, onNavigate, alertsCount, onLogout }) => {
  const { t } = useI18n();
  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-slate-200 bg-white px-3 py-5">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#05A845] shadow-[0_4px_14px_rgba(5,168,69,0.35)]">
          <Zap size={22} className="text-white" fill="white" />
        </div>
        <div>
          <h1 className="font-heading text-lg font-black uppercase leading-none tracking-tight text-slate-900">
            Memory<span className="text-[#05A845]">Transfer</span>
          </h1>
          <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">Transfer Intelligence</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        <NavBtn testid="nav-dashboard" icon={LayoutDashboard} label={t.nav.dashboard} active={view === "dashboard"} onClick={() => onNavigate("dashboard")} />
        <NavBtn testid="nav-radar" icon={Radar} label={t.nav.radar} active={view === "radar"} onClick={() => onNavigate("radar")} badge={alertsCount} dot />
        <NavBtn testid="nav-profiles" icon={Users} label={t.nav.profiles} active={view === "profiles" || view === "profile"} onClick={() => onNavigate("profiles")} />
        <NavBtn testid="nav-sources" icon={Signal} label={t.nav.sources} active={view === "sources"} onClick={() => onNavigate("sources")} />
        <div className="my-2 h-px bg-slate-200" />
        <NavBtn testid="nav-streak" icon={Flame} label={t.nav.streak} active={view === "streak"} onClick={() => onNavigate("streak")} />
      </nav>

      <NavBtn
        testid="nav-logout"
        icon={LogOut}
        label={t.nav.logout}
        active={false}
        onClick={onLogout}
      />
    </aside>
  );
};
