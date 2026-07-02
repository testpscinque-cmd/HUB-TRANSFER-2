import { Zap, LayoutDashboard, Radar, Users, PlusCircle, Signal, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

const NavBtn = ({ icon: Icon, label, active, onClick, testid, badge }) => (
  <button
    data-testid={testid}
    onClick={onClick}
    className={`group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold transition-all ${
      active
        ? "bg-[#39FF14]/10 text-[#39FF14] shadow-[inset_2px_0_0_#39FF14]"
        : "text-gray-400 hover:bg-white/5 hover:text-white"
    }`}
  >
    <Icon size={18} />
    <span>{label}</span>
    {badge > 0 && (
      <span className="ml-auto rounded-full bg-[#FF007F] px-1.5 py-0.5 text-[10px] font-black text-white">
        {badge}
      </span>
    )}
  </button>
);

export const Sidebar = ({ view, onNavigate, onAddRumor, alertsCount }) => {
  const { t } = useI18n();
  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-white/10 bg-[#0A1420] px-3 py-5">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#39FF14] shadow-[0_0_18px_rgba(57,255,20,0.5)]">
          <Zap size={22} className="text-black" fill="black" />
        </div>
        <div>
          <h1 className="font-heading text-lg font-black uppercase leading-none tracking-tight text-white">
            Transfer<span className="text-[#39FF14]">Memory</span>
          </h1>
          <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-[#FF007F]">
            {t.tagline}
          </p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        <NavBtn testid="nav-dashboard" icon={LayoutDashboard} label={t.nav.dashboard} active={view === "dashboard"} onClick={() => onNavigate("dashboard")} />
        <NavBtn testid="nav-radar" icon={Radar} label={t.nav.radar} active={view === "radar"} onClick={() => onNavigate("radar")} badge={alertsCount} />
        <NavBtn testid="nav-profiles" icon={Users} label={t.nav.profiles} active={view === "profiles" || view === "profile"} onClick={() => onNavigate("profiles")} />
        <NavBtn testid="nav-add-rumor" icon={PlusCircle} label={t.nav.addRumor} active={false} onClick={onAddRumor} />
        <NavBtn testid="nav-sources" icon={Signal} label={t.nav.sources} active={view === "sources"} onClick={() => onNavigate("sources")} />
      </nav>

      <NavBtn
        testid="nav-logout"
        icon={LogOut}
        label={t.nav.logout}
        active={false}
        onClick={() => toast.info(t.logoutToast)}
      />
    </aside>
  );
};
