import { Search, Languages, ArrowLeft } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export const TopBar = ({ query, onSearch, showBack, onBack }) => {
  const { t, toggle } = useI18n();
  return (
    <div className="sticky top-0 z-20 flex items-center gap-4 border-b border-slate-200 bg-white/85 px-6 py-3 backdrop-blur-xl sm:px-8">
      {showBack && (
        <button
          data-testid="topbar-back"
          onClick={onBack}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-slate-600 transition-colors hover:border-[#05A845] hover:text-[#05A845]"
        >
          <ArrowLeft size={16} /> {t.back}
        </button>
      )}
      <div className="relative flex-1 max-w-2xl">
        <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          data-testid="global-search-input"
          value={query}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-[#05A845] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#05A845]/20"
        />
      </div>
      <button
        onClick={toggle}
        data-testid="lang-toggle"
        className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 transition-colors hover:border-[#05A845] hover:text-[#05A845]"
      >
        <Languages size={16} /> {t.lang}
      </button>
    </div>
  );
};
