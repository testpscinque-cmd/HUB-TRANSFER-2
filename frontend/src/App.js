import { useEffect, useState, useCallback } from "react";
import "@/App.css";
import { Toaster } from "sonner";
import { I18nProvider } from "@/lib/i18n";
import { getProfiles, getRumors, getSources, getStats } from "@/lib/api";
import { Header } from "@/components/Header";
import { PanelA } from "@/components/PanelA";
import { Timeline } from "@/components/Timeline";
import { PanelC } from "@/components/PanelC";
import { NewRumorDialog } from "@/components/NewRumorDialog";

function Dashboard() {
  const [profiles, setProfiles] = useState([]);
  const [sources, setSources] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [rumors, setRumors] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [checkResult, setCheckResult] = useState(null);
  const [checking, setChecking] = useState(false);

  const selectedProfile = profiles.find((p) => p.id === selectedId) || null;

  const loadStats = useCallback(() => getStats().then(setStats).catch(() => {}), []);

  useEffect(() => {
    getProfiles().then((data) => {
      setProfiles(data);
      if (data.length) setSelectedId(data[0].id);
    });
    getSources().then(setSources);
    loadStats();
  }, [loadStats]);

  const loadRumors = useCallback((id) => {
    if (!id) return;
    getRumors(id).then(setRumors);
  }, []);

  useEffect(() => {
    if (selectedId) {
      setCheckResult(null);
      loadRumors(selectedId);
    }
  }, [selectedId, loadRumors]);

  const handleSelect = (id) => setSelectedId(id);

  const handleSaved = (profileId, result) => {
    setSelectedId(profileId);
    loadRumors(profileId);
    loadStats();
    if (result) setCheckResult(result);
  };

  const handleCheck = (res, isChecking) => {
    setChecking(!!isChecking);
    if (!isChecking) setCheckResult(res);
  };

  return (
    <div className="App min-h-screen tm-grid-bg">
      <Header stats={stats} />
      <main className="mx-auto grid max-w-[1600px] grid-cols-12 gap-5 p-5 sm:p-8" style={{ minHeight: "calc(100vh - 74px)" }}>
        <div className="col-span-12 lg:col-span-3">
          <PanelA
            profiles={profiles}
            selectedId={selectedId}
            selectedProfile={selectedProfile}
            onSelect={handleSelect}
            onNewRumor={() => setDialogOpen(true)}
          />
        </div>
        <div className="col-span-12 lg:col-span-6">
          <Timeline profile={selectedProfile} rumors={rumors} />
        </div>
        <div className="col-span-12 lg:col-span-3">
          <PanelC result={checkResult} checking={checking} sources={sources} />
        </div>
      </main>

      <NewRumorDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        profiles={profiles}
        selectedProfile={selectedProfile}
        sources={sources}
        onSaved={handleSaved}
        onCheck={handleCheck}
      />
      <Toaster position="top-right" theme="dark" richColors />
    </div>
  );
}

function App() {
  return (
    <I18nProvider>
      <Dashboard />
    </I18nProvider>
  );
}

export default App;
