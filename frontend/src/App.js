import { useState, useCallback } from "react";
import { Toaster } from "sonner";
import "@/App.css";
import { BottomNav } from "@/components/BottomNav";
import { SideNav } from "@/components/SideNav";
import { Dashboard } from "@/components/Dashboard";
import { Profili } from "@/components/Profili";
import { Workspace } from "@/components/Workspace";
import { ProfileScreen } from "@/components/ProfileScreen";
import { StreakLabView } from "@/components/StreakLabView";
import { VerifiedView } from "@/components/VerifiedView";

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [profileId, setProfileId] = useState(null);
  const [watchlist, setWatchlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem("th_watchlist") || "{}"); } catch { return {}; }
  });

  const openProfile = useCallback((id) => { if (id) setProfileId(id); }, []);
  const closeProfile = () => setProfileId(null);

  const saveWatch = useCallback((column, item) => {
    setWatchlist((prev) => {
      const next = { ...prev, [column]: [...(prev[column] || []).filter((x) => x.id !== item.id), item] };
      localStorage.setItem("th_watchlist", JSON.stringify(next));
      return next;
    });
  }, []);
  const removeWatch = useCallback((column, id) => {
    setWatchlist((prev) => {
      const next = { ...prev, [column]: (prev[column] || []).filter((x) => x.id !== id) };
      localStorage.setItem("th_watchlist", JSON.stringify(next));
      return next;
    });
  }, []);

  const go = (t) => { setProfileId(null); setTab(t); };

  return (
    <div className="app-bg min-h-full lg:pl-60">
      <SideNav tab={profileId ? "" : tab} onNav={go} />
      <div className="mx-auto min-h-full w-full max-w-[min(calc(100vw-4rem),1600px)] px-4 pb-24 pt-4 sm:px-5 lg:px-10 lg:pb-8 lg:pt-8">
        {profileId ? (
          <ProfileScreen id={profileId} onBack={closeProfile} onOpenProfile={openProfile} saveWatch={saveWatch} go={go} />
        ) : (
          <>
            {tab === "dashboard" && <Dashboard onOpenProfile={openProfile} saveWatch={saveWatch} />}
            {tab === "profili" && <Profili onOpenProfile={openProfile} saveWatch={saveWatch} />}
            {tab === "workspace" && <Workspace watchlist={watchlist} saveWatch={saveWatch} removeWatch={removeWatch} onOpenProfile={openProfile} />}
            {tab === "streak" && <StreakLabView />}
            {tab === "verified" && <VerifiedView />}
          </>
        )}
      </div>
      <BottomNav tab={profileId ? "" : tab} onNav={go} />
      <Toaster position="top-center" theme="dark" richColors />
    </div>
  );
}
