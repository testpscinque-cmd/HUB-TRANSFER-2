import React, { createContext, useContext, useState } from "react";

const translations = {
  en: {
    appName: "TransferMemory",
    tagline: "L'Anagrafe del Calciomercato",
    searchPlaceholder: "Search a player or coach...",
    recent: "Roster",
    newRumor: "+ Log New Rumor",
    contractCard: "Contract Card",
    club: "Club",
    expiry: "Contract Until",
    salary: "Salary",
    agent: "Agent",
    role: "Role",
    nationality: "Nationality",
    age: "Age",
    notes: "Internal Notes",
    selectPrompt: "Select a profile",
    selectSub: "Search or pick someone from the roster to open their full transfer saga.",
    timeline: "Transfer Saga",
    timelineSub: "Chronological memory of the negotiation",
    noRumors: "No rumors logged yet for this profile.",
    source: "Source",
    formula: "Formula",
    consistency: "Consistency Check",
    consistencySub: "AI cross-checks new intel vs. the database",
    consistencyIdle: "Log a new rumor to run the AI audit against verified contract data.",
    checking: "Auditing rumor against database...",
    allClear: "No contradictions detected. Intel is consistent with the database.",
    sourceDir: "Source Directory",
    sourceDirSub: "Reliability of your tipsters",
    reliability: "reliability",
    // dialog
    dialogTitle: "Log New Rumor",
    dialogSub: "The AI will audit it against the contract database before you save.",
    profile: "Profile",
    stage: "Stage",
    dateLogged: "Date",
    dealFormula: "Deal Formula",
    description: "What happened?",
    descPlaceholder: "e.g. Chelsea agree personal terms on a free transfer...",
    runCheck: "Run AI Consistency Check",
    save: "Save Rumor",
    cancel: "Cancel",
    saved: "Rumor logged successfully",
    advice: "Advice",
    stats: { profiles: "Profiles", rumors: "Rumors", hot: "Hot Deals", official: "Official" },
    lang: "IT",
  },
  it: {
    appName: "TransferMemory",
    tagline: "L'Anagrafe del Calciomercato",
    searchPlaceholder: "Cerca un giocatore o allenatore...",
    recent: "Rosa",
    newRumor: "+ Registra Nuovo Rumor",
    contractCard: "Scheda Contratto",
    club: "Club",
    expiry: "Contratto Fino Al",
    salary: "Ingaggio",
    agent: "Agente",
    role: "Ruolo",
    nationality: "Nazionalità",
    age: "Età",
    notes: "Note Interne",
    selectPrompt: "Seleziona un profilo",
    selectSub: "Cerca o scegli un nome dalla rosa per aprire la sua saga di mercato.",
    timeline: "Saga di Mercato",
    timelineSub: "Memoria cronologica della trattativa",
    noRumors: "Nessun rumor registrato per questo profilo.",
    source: "Fonte",
    formula: "Formula",
    consistency: "Controllo Coerenza",
    consistencySub: "L'AI incrocia le nuove notizie con il database",
    consistencyIdle: "Registra un nuovo rumor per avviare l'audit AI sui dati contrattuali verificati.",
    checking: "Analisi del rumor sul database...",
    allClear: "Nessuna contraddizione rilevata. La notizia è coerente con il database.",
    sourceDir: "Directory Fonti",
    sourceDirSub: "Affidabilità dei tuoi informatori",
    reliability: "affidabilità",
    dialogTitle: "Registra Nuovo Rumor",
    dialogSub: "L'AI lo verificherà sul database contrattuale prima del salvataggio.",
    profile: "Profilo",
    stage: "Fase",
    dateLogged: "Data",
    dealFormula: "Formula dell'Affare",
    description: "Cosa è successo?",
    descPlaceholder: "es. Il Chelsea trova l'accordo a parametro zero...",
    runCheck: "Avvia Controllo AI",
    save: "Salva Rumor",
    cancel: "Annulla",
    saved: "Rumor registrato con successo",
    advice: "Consiglio",
    stats: { profiles: "Profili", rumors: "Rumor", hot: "Trattative Calde", official: "Ufficiali" },
    lang: "EN",
  },
};

const I18nContext = createContext(null);

export const I18nProvider = ({ children }) => {
  const [lang, setLang] = useState("en");
  const t = translations[lang];
  const toggle = () => setLang((l) => (l === "en" ? "it" : "en"));
  return (
    <I18nContext.Provider value={{ lang, t, toggle }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
