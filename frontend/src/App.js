import { useEffect, useState, useCallback, useRef } from "react";
import "@/App.css";
import { Toaster, toast } from "sonner";
import { I18nProvider, useI18n } from "@/lib/i18n";
import * as api from "@/lib/api";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { DashboardView } from "@/components/DashboardView";
import { ProfilesView } from "@/components/ProfilesView";
import { ProfileView } from "@/components/ProfileView";
import { SourcesView } from "@/components/SourcesView";
import { RadarView } from "@/components/RadarView";
import { StreakLabView } from "@/components/StreakLabView";
import { LoginScreen } from "@/components/LoginScreen";

function Shell({ onLogout }) {
  const { t } = useI18n();
  const [view, setView] = useState("dashboard");
  const prevView = useRef("dashboard");
  const [query, setQuery] = useState("");

  const [profiles, setProfiles] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [sources, setSources] = useState([]);
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);

  const [selectedId, setSelectedId] = useState(null);
  const [rumors, setRumors] = useState([]);

  const [alerts, setAlerts] = useState([]);
  const [pipeline, setPipeline] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [scanning, setScanning] = useState(false);

  const [challenge, setChallenge] = useState(null);
  const [streakMe, setStreakMe] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);

  const selectedProfile = profiles.find((p) => p.id === selectedId) || null;

  const refreshStats = useCallback(() => api.getStats().then(setStats).catch(() => {}), []);
  const refreshRecent = useCallback(() => api.getRecentRumors(25).then(setRecent).catch(() => {}), []);
  const refreshRadar = useCallback(() => {
    api.getAlerts().then(setAlerts).catch(() => {});
    api.getPipeline().then(setPipeline).catch(() => {});
    api.getTasks().then(setTasks).catch(() => {});
  }, []);
  const refreshStreak = useCallback(() => {
    api.getStreakMe().then(setStreakMe).catch(() => {});
    api.getLeaderboard().then(setLeaderboard).catch(() => {});
  }, []);

  useEffect(() => {
    api.getProfiles().then(setProfiles);
    api.getClubs().then(setClubs);
    api.getSources().then(setSources);
    api.getActiveChallenge().then(setChallenge).catch(() => {});
    refreshStats();
    refreshRecent();
    refreshRadar();
    refreshStreak();
  }, [refreshStats, refreshRecent, refreshRadar, refreshStreak]);

  const loadRumors = useCallback((id) => id && api.getRumors(id).then(setRumors), []);

  useEffect(() => {
    if (selectedId) {
      loadRumors(selectedId);
    }
  }, [selectedId, loadRumors]);

  const navigate = (v) => {
    prevView.current = view;
    setView(v);
  };

  const openProfile = (id) => {
    prevView.current = view === "profile" ? prevView.current : view;
    setSelectedId(id);
    setView("profile");
  };

  const onSearch = (q) => {
    setQuery(q);
    if (view !== "profiles") {
      prevView.current = view;
      setView("profiles");
    }
  };

  const back = () => setView(prevView.current || "dashboard");

  // Radar actions
  const onScan = async () => {
    setScanning(true);
    try {
      await api.radarScan();
      await api.getAlerts().then(setAlerts);
      refreshStats();
      toast.success(t.scanDone);
    } catch { toast.error("Scan failed"); }
    finally { setScanning(false); }
  };
  const onInvestigate = async (id) => {
    await api.investigateAlert(id);
    refreshRadar();
    refreshStats();
    toast.success(t.movedToPipeline);
  };
  const onDismiss = async (id) => {
    await api.dismissAlert(id);
    api.getAlerts().then(setAlerts);
    refreshStats();
    toast.info(t.dismissedToast);
  };
  const onMove = async (id, stage) => {
    setPipeline((prev) => prev.map((p) => (p.id === id ? { ...p, stage } : p)));
    await api.updatePipeline(id, { stage });
  };
  const onToggleTask = async (task) => {
    setTasks((prev) => prev.map((x) => (x.id === task.id ? { ...x, is_done: !x.is_done } : x)));
    await api.updateTask(task.id, { is_done: !task.is_done });
    api.getTasks().then(setTasks);
  };

  const onVote = async (answer) => {
    if (!challenge?.id) return null;
    try {
      const res = await api.submitVote({ challenge_id: challenge.id, answer });
      setStreakMe((prev) => ({ ...(prev || {}), current_streak: res.current_streak, highest_streak: res.highest_streak }));
      api.getLeaderboard().then(setLeaderboard);
      if (res.next_challenge) setChallenge(res.next_challenge);
      else api.getActiveChallenge().then(setChallenge).catch(() => {});
      if (res.correct) toast.success(t.correctToast);
      else toast.error(t.wrongToast);
      return res;
    } catch {
      toast.error("Vote failed");
      return null;
    }
  };

  const alertsCount = alerts.filter((a) => a.status === "New").length;
  const isRadar = view === "radar";

  return (
    <div className="flex h-screen overflow-hidden tm-grid-bg">
      <Sidebar view={view} onNavigate={navigate} alertsCount={alertsCount} onLogout={onLogout} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar query={query} onSearch={onSearch} showBack={view === "profile"} onBack={back} />
        <main className={`flex-1 overflow-y-auto p-6 sm:p-8 ${isRadar ? "" : ""}`}>
          {view === "dashboard" && <DashboardView recent={recent} sources={sources} onOpenProfile={openProfile} />}
          {view === "radar" && (
            <RadarView
              alerts={alerts} pipeline={pipeline} tasks={tasks} sources={sources}
              onInvestigate={onInvestigate} onDismiss={onDismiss} onMove={onMove} onToggleTask={onToggleTask}
            />
          )}
          {view === "profiles" && (
            <ProfilesView profiles={profiles} clubs={clubs} query={query} onOpenProfile={openProfile} />
          )}
          {view === "profile" && selectedProfile && (
            <ProfileView profile={selectedProfile} rumors={rumors} />
          )}
          {view === "sources" && <SourcesView sources={sources} />}
          {view === "streak" && (
            <StreakLabView challenge={challenge} streak={streakMe} leaderboard={leaderboard} onVote={onVote} />
          )}
        </main>
      </div>
    </div>
  );
}

function App() {
  const [authed, setAuthed] = useState(() => localStorage.getItem("mt_authed") === "1");
  const login = () => {
    localStorage.setItem("mt_authed", "1");
    setAuthed(true);
  };
  const logout = () => {
    localStorage.removeItem("mt_authed");
    setAuthed(false);
    toast.info("Signed out (demo).");
  };
  return (
    <I18nProvider>
      {authed ? <Shell onLogout={logout} /> : <LoginScreen onLogin={login} />}
      <Toaster position="top-right" theme="light" richColors />
    </I18nProvider>
  );
}

export default App;
