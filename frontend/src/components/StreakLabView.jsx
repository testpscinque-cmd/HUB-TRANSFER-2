import { useState } from "react";
import { Flame, Trophy, Loader2, Check, X, Crown } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const GoogleG = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
  </svg>
);

const medal = ["#F59E0B", "#94A3B8", "#B45309"];

const QUESTIONS = [
  { id: "q1", question_text: "Bremer si trasferisce al Manchester United?", answer: "SI" },
  { id: "q2", question_text: "Lukaku si trasferisce alla Juventus?", answer: "NO" },
  { id: "q3", question_text: "Koulibaly si trasferisce al Paris Saint-Germain?", answer: "NO" },
  { id: "q4", question_text: "Salah si trasferisce al Real Madrid?", answer: "NO" },
  { id: "q5", question_text: "Vlahovic si trasferisce al Chelsea?", answer: "SI" },
  { id: "q6", question_text: "Barella si trasferisce al Barcellona?", answer: "NO" },
  { id: "q7", question_text: "Zaniolo si trasferisce all'Inter?", answer: "NO" },
  { id: "q8", question_text: "Haaland si trasferisce al Bayern Monaco?", answer: "NO" },
  { id: "q9", question_text: "De Ketelaere si trasferisce al Milan?", answer: "SI" },
  { id: "q10", question_text: "Kvaratskhelia si trasferisce al Chelsea?", answer: "SI" },
  // — Nuove domande 2026 —
  { id: "q11", question_text: "Lamine Yamal rinnova con il Barcellona nel 2026?", answer: "SI" },
  { id: "q12", question_text: "Osimhen si trasferisce al Chelsea nel mercato 2026?", answer: "SI" },
  { id: "q13", question_text: "Mbappé lascia il Real Madrid nel gennaio 2026?", answer: "NO" },
  { id: "q14", question_text: "Zirkzee torna in Serie A al Milan nel 2026?", answer: "NO" },
  { id: "q15", question_text: "Leao si trasferisce al PSG per oltre 100M€ nel 2026?", answer: "NO" },
  { id: "q16", question_text: "Retegui è il nuovo attaccante dell'Atlético Madrid nel 2026?", answer: "SI" },
  { id: "q17", question_text: "Guler diventa titolare fisso al Real Madrid nel 2026?", answer: "SI" },
  { id: "q18", question_text: "Wirtz si trasferisce al Real Madrid nell'estate 2026?", answer: "NO" },
  { id: "q19", question_text: "Camavinga viene ceduto al Manchester City nel 2026?", answer: "NO" },
  { id: "q20", question_text: "Nico Williams firma con il Barcellona nel 2026?", answer: "SI" },
];

const LEADERBOARD = [
  { id: "u-you", mock_username: "You", highest_streak: 18 },
  { id: "u-marketgod", mock_username: "MarketGod", highest_streak: 20 },
  { id: "u-transferwiz", mock_username: "TransferWiz", highest_streak: 19 },
  { id: "u-scoutzero", mock_username: "ScoutZero", highest_streak: 17 },
  { id: "u-velocity", mock_username: "Velocity", highest_streak: 16 },
];

export const StreakLabView = () => {
  const { t } = useI18n();
  const [entered, setEntered] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [voting, setVoting] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [finished, setFinished] = useState(false);
  const [failed, setFailed] = useState(false);

  const currentQuestion = QUESTIONS[questionIndex];

  const enter = () => {
    setConnecting(true);
    setTimeout(() => {
      setConnecting(false);
      setEntered(true);
    }, 800);
  };

  const restart = () => {
    setQuestionIndex(0);
    setCurrentStreak(0);
    setFeedback(null);
    setFinished(false);
    setFailed(false);
  };

  const vote = async (answer) => {
    if (voting || finished || failed) return;
    setVoting(true);
    setFeedback(null);

    await new Promise((resolve) => setTimeout(resolve, 500));
    setVoting(false);

    if (answer === currentQuestion.answer) {
      const nextIndex = questionIndex + 1;
      setCurrentStreak((value) => value + 1);
      setFeedback(t.correctToast);

      if (nextIndex >= QUESTIONS.length) {
        setFinished(true);
        return;
      }

      setQuestionIndex(nextIndex);
      return;
    }

    setFailed(true);
    setCurrentStreak(0);
    setFeedback(t.wrongToast);
  };

  if (!entered) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center" data-testid="streak-gateway">
        <div className="tm-fade-up w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-lg sm:p-10">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100">
            <Flame size={34} className="text-orange-500" />
          </div>
          <h2 className="font-heading text-3xl font-black uppercase tracking-tight text-slate-900">{t.streakGateTitle}</h2>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-slate-500">{t.streakGateSub}</p>
          <button
            data-testid="streak-google-login"
            onClick={enter}
            disabled={connecting}
            className="mt-8 flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white py-3 font-heading text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-70"
          >
            {connecting ? <Loader2 size={18} className="animate-spin text-slate-400" /> : <GoogleG />}
            {connecting ? t.connecting : t.signInPlay}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tm-fade-up mx-auto max-w-2xl" data-testid="streak-arena">
      <div className="mb-6 flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex items-center gap-3">
          <Flame size={22} className="text-orange-500" />
          <div>
            <div className="text-[11px] uppercase tracking-[0.25em] text-slate-400">{t.currentStreak}</div>
            <div className="font-heading text-3xl font-black text-slate-900">{currentStreak}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Trophy size={20} className="text-[#05A845]" />
          <div>
            <div className="text-[11px] uppercase tracking-[0.25em] text-slate-400">{t.best}</div>
            <div className="font-heading text-3xl font-black text-slate-900">{QUESTIONS.length}</div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">{t.dailyChallenge}</div>
            <div className="text-xs text-slate-500">{t.questionProgress}: {questionIndex + 1}/{QUESTIONS.length}</div>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-slate-600">{t.yesNoHint}</span>
        </div>

        {finished ? (
          <div className="text-center">
            <h3 className="mb-4 text-2xl font-heading font-black uppercase tracking-tight text-slate-900">{t.finisherTitle}</h3>
            <p className="mx-auto max-w-xl text-sm leading-relaxed text-slate-500">{t.finisherSub}</p>
            <button onClick={restart} className="mt-8 rounded-xl bg-[#05A845] px-6 py-3 font-heading text-sm font-black uppercase tracking-wider text-white transition hover:bg-[#048B39]">
              {t.playAgain}
            </button>
          </div>
        ) : (
          <>
            <h3 className="mb-6 text-center font-heading text-2xl font-black leading-tight text-slate-900" data-testid="challenge-question">
              {currentQuestion.question_text}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                data-testid="vote-yes"
                onClick={() => vote("SI")}
                disabled={voting || failed}
                className="flex items-center justify-center rounded-xl bg-[#05A845] py-5 font-heading text-2xl font-black uppercase text-white transition-all hover:bg-[#048B39] disabled:opacity-60"
              >
                {voting ? <Loader2 size={22} className="animate-spin" /> : t.voteYes}
              </button>
              <button
                data-testid="vote-no"
                onClick={() => vote("NO")}
                disabled={voting || failed}
                className="flex items-center justify-center rounded-xl bg-red-500 py-5 font-heading text-2xl font-black uppercase text-white transition-all hover:bg-red-600 disabled:opacity-60"
              >
                {voting ? <Loader2 size={22} className="animate-spin" /> : t.voteNo}
              </button>
            </div>
            {feedback && (
              <div className={`mt-5 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold ${failed ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-700"}`}>
                {failed ? <X size={16} /> : <Check size={16} />}
                {feedback}
              </div>
            )}
            {failed && (
              <div className="mt-5 text-center">
                <button onClick={restart} className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-slate-800">
                  {t.restart}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm" data-testid="leaderboard">
        <div className="mb-4 flex items-center gap-2">
          <Crown size={17} className="text-[#F59E0B]" />
          <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-slate-900">{t.topTipsters}</h3>
        </div>
        <div className="space-y-1.5">
          {LEADERBOARD.map((u, i) => {
            const isYou = u.mock_username === "You";
            return (
              <div
                key={u.id}
                data-testid={`leaderboard-row-${i}`}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 ${isYou ? "border border-[#05A845]/40 bg-[#05A845]/10" : "bg-slate-50"}`}
              >
                <span className="w-6 font-heading text-sm font-black" style={{ color: medal[i] || "#94A3B8" }}>
                  {i + 1}
                </span>
                <span className={`flex-1 text-sm font-bold ${isYou ? "text-[#05A845]" : "text-slate-900"}`}>
                  {isYou ? t.you : u.mock_username}
                </span>
                <span className="flex items-center gap-1 font-mono text-sm font-bold text-slate-900">
                  <Flame size={13} className="text-orange-500" /> {u.highest_streak}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
