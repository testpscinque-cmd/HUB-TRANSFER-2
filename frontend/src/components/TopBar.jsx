import { Search, Languages, ArrowLeft } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export const TopBar = ({ query, onSearch, showBack, onBack }) => {
  const { t, lang, toggle } = useI18n();
  return (
    <div className="sticky top-0 z-20 flex items-center gap-4 border-b border-white/10 bg-[#0D1B2A]/85 px-6 py-3 backdrop-blur-xl sm:px-8">
      {showBack && (
        <button
          data-testid="topbar-back"
          onClick={onBack}
          className="flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-2 text-sm font-bold text-gray-300 transition-colors hover:border-[#39FF14] hover:text-[#39FF14]"
        >
          <ArrowLeft size={16} /> {t.back}
        </button>
      )}
      <div className="relative flex-1 max-w-2xl">
        <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          data-testid="global-search-input"
          value={query}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full rounded-lg border border-white/10 bg-[#1B2432] py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-gray-500 transition-all focus:border-[#39FF14] focus:outline-none focus:ring-1 focus:ring-[#39FF14]"
        />
      </div>
      <button
        onClick={toggle}
        data-testid="lang-toggle"
        className="flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-sm font-bold text-white transition-colors hover:border-[#39FF14] hover:text-[#39FF14]"
      >
        <Languages size={16} /> {t.lang}
      </button>
    </div>
  );
};
