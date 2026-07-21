import { LayoutGrid, Users, Briefcase, Zap } from "lucide-react";

const items = [
  { key: "dashboard", label: "Dashboard", icon: LayoutGrid },
  { key: "profili", label: "Profili", icon: Users },
  { key: "workspace", label: "Workspace", icon: Briefcase },
];

export const SideNav = ({ tab, onNav }) => (
  <aside
    data-testid="side-nav"
    className="fixed left-0 top-0 z-40 hidden h-screen w-60 flex-col border-r border-white/10 px-4 py-6 lg:flex"
    style={{ background: "linear-gradient(180deg, rgba(43,224,122,0.06), rgba(10,14,23,0.0) 30%), rgba(10,14,23,0.85)", backdropFilter: "blur(18px)" }}
  >
    <div className="mb-9 flex items-center gap-2 px-2">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2BE07A]"><Zap size={19} className="text-black" fill="black" /></span>
      <span className="font-heading text-xl font-black uppercase tracking-tight text-white">Transfer<span style={{ color: "#2BE07A" }}>Hub</span></span>
    </div>
    <nav className="flex flex-col gap-1.5">
      {items.map((it) => {
        const active = tab === it.key;
        return (
          <button
            key={it.key}
            data-testid={`side-nav-${it.key}`}
            onClick={() => onNav(it.key)}
            className="group relative flex items-center gap-3 rounded-xl px-3 py-3 transition-all hover:bg-white/5"
            style={active ? { background: "rgba(43,224,122,0.12)" } : {}}
          >
            {active && <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-[#2BE07A]" style={{ boxShadow: "0 0 12px #2BE07A" }} />}
            <it.icon size={20} style={{ color: active ? "#2BE07A" : "#9AA3B5" }} strokeWidth={active ? 2.5 : 2} />
            <span className="text-sm font-bold uppercase tracking-wide" style={{ color: active ? "#E9EEF7" : "#9AA3B5" }}>{it.label}</span>
          </button>
        );
      })}
    </nav>
    <div className="mt-auto flex items-center gap-2 rounded-xl bg-white/5 px-3 py-3">
      <span className="pulse-dot h-2 w-2 rounded-full bg-[#2BE07A]" />
      <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Serie A · Live</span>
    </div>
  </aside>
);
