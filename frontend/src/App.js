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
import { NewRumorDialog } from "@/components/NewRumorDialog";
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

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogProfile, setDialogProfile] = useState(null);
  const [checkResult, setCheckResult] = useState(null);
  const [checking, setChecking] = useState(false);
  const preserveResult = useRef(false);

  const [alerts, setAlerts] = useState([]);
  const [pipeline, setPipeline] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [scanning, setScanning] = useState(false);

  const selectedProfile = profiles.find((p) => p.id === selectedId) || null;

  const refreshStats = useCallback(() => api.getStats().then(setStats).catch(() => {}), []);
  const refreshRecent = useCallback(() => api.getRecentRumors(25).then(setRecent).catch(() => {}), []);
  const refreshRadar = useCallback(() => {
    api.getAlerts().then(setAlerts).catch(() => {});
    api.getPipeline().then(setPipeline).catch(() => {});
    api.getTasks().then(setTasks).catch(() => {});
  }, []);

  useEffect(() => {
    api.getProfiles().then(setProfiles);
    api.getClubs().then(setClubs);
    api.getSources().then(setSources);
    refreshStats();
    refreshRecent();
    refreshRadar();
  }, [refreshStats, refreshRecent, refreshRadar]);

  const loadRumors = useCallback((id) => id && api.getRumors(id).then(setRumors), []);

  useEffect(() => {
    if (selectedId) {
      if (preserveResult.current) preserveResult.current = false;
      else setCheckResult(null);
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

  const openDialog = (profileId) => {
    setDialogProfile(profiles.find((p) => p.id === profileId) || selectedProfile);
    setDialogOpen(true);
  };

  const handleSaved = (profileId, result) => {
    if (result) preserveResult.current = true;
    setSelectedId(profileId);
    setView("profile");
    loadRumors(profileId);
    refreshRecent();
    refreshStats();
    if (result) setCheckResult(result);
  };

  const handleCheck = (res, isChecking) => {
    setChecking(!!isChecking);
    if (!isChecking) setCheckResult(res);
  };

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

  const alertsCount = alerts.filter((a) => a.status === "New").length;
  const isRadar = view === "radar";

  return (
    <div className="flex h-screen overflow-hidden tm-grid-bg">
      <Sidebar view={view} onNavigate={navigate} onAddRumor={() => openDialog(selectedId)} alertsCount={alertsCount} onLogout={onLogout} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar query={query} onSearch={onSearch} showBack={view === "profile"} onBack={back} />
        <main className={`flex-1 overflow-y-auto p-6 sm:p-8 ${isRadar ? "" : ""}`}>
          {view === "dashboard" && <DashboardView recent={recent} stats={stats} onOpenProfile={openProfile} />}
          {view === "radar" && (
            <RadarView
              alerts={alerts} pipeline={pipeline} tasks={tasks} scanning={scanning}
              onScan={onScan} onInvestigate={onInvestigate} onDismiss={onDismiss} onMove={onMove} onToggleTask={onToggleTask}
            />
          )}
          {view === "profiles" && (
            <ProfilesView profiles={profiles} clubs={clubs} query={query} onOpenProfile={openProfile} />
          )}
          {view === "profile" && selectedProfile && (
            <ProfileView
              profile={selectedProfile} rumors={rumors} checkResult={checkResult} checking={checking}
              onAddRumor={openDialog}
            />
          )}
          {view === "sources" && <SourcesView sources={sources} />}
        </main>
      </div>

      <NewRumorDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        profiles={profiles}
        selectedProfile={dialogProfile}
        sources={sources}
        onSaved={handleSaved}
        onCheck={handleCheck}
      />
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
      <Toaster position="top-right" theme="dark" richColors />
    </I18nProvider>
  );
}

export default App;
