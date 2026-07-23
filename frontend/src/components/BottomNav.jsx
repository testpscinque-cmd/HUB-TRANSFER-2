import { LayoutGrid, Users, Briefcase, Sparkles, BadgeCheck } from "lucide-react";

const items = [
  { key: "dashboard", label: "Home", icon: LayoutGrid },
  { key: "profili", label: "Database", icon: Users },
  { key: "workspace", label: "Workspace", icon: Briefcase },
  { key: "streak", label: "Streak", icon: Sparkles },
  { key: "verified", label: "Verified", icon: BadgeCheck },
];

export const BottomNav = ({ tab, onNav }) => (
  <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-4 lg:hidden">
    <div className="glass-strong flex w-full max-w-md items-center justify-around gap-1 rounded-2xl border border-white/10 px-2 py-2 shadow-[0_20px_80px_rgba(0,0,0,0.25)]">
      {items.map((it) => {
        const active = tab === it.key;
        return (
          <button
            key={it.key}
            data-testid={`nav-${it.key}`}
            onClick={() => onNav(it.key)}
            className="relative flex flex-1 flex-col items-center gap-1 rounded-xl py-2 transition-all duration-200"
            style={active ? { background: "rgba(43,224,122,0.16)", boxShadow: "0 0 18px rgba(43,224,122,0.18)" } : {}}
          >
            <it.icon size={21} style={{ color: active ? "#2BE07A" : "#9AA3B5" }} strokeWidth={active ? 2.5 : 2} />
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: active ? "#E9EEF7" : "#9AA3B5" }}>
              {it.label}
            </span>
          </button>
        );
      })}
    </div>
  </nav>
);
