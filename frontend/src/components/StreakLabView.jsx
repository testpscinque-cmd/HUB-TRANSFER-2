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

export const StreakLabView = ({ challenge, streak, leaderboard, onVote }) => {
  const { t } = useI18n();
  const [entered, setEntered] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [voting, setVoting] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  const enter = () => {
    setConnecting(true);
    setTimeout(() => { setConnecting(false); setEntered(true); }, 1000);
  };

  const vote = async (answer) => {
    if (voting || !challenge?.id) return;
    setVoting(true);
    setLastResult(null);
    const res = await onVote(answer);
    setVoting(false);
    setLastResult(res?.correct ? "correct" : "wrong");
    setTimeout(() => setLastResult(null), 2500);
  };

  // STATE 1 — Gateway
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

  // STATE 2 — Daily Arena
  return (
    <div className="tm-fade-up mx-auto max-w-2xl" data-testid="streak-arena">
      <div className="mb-6 flex items-center justify-center gap-6 rounded-xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center gap-2" data-testid="current-streak">
          <Flame size={22} className="text-orange-500" />
          <span className="font-heading text-2xl font-black text-slate-900">{streak?.current_streak ?? 0}</span>
          <span className="text-[11px] uppercase tracking-widest text-slate-400">{t.currentStreak}</span>
        </div>
        <div className="h-8 w-px bg-slate-200" />
        <div className="flex items-center gap-2">
          <Trophy size={20} className="text-[#05A845]" />
          <span className="font-heading text-2xl font-black text-slate-900">{streak?.highest_streak ?? 0}</span>
          <span className="text-[11px] uppercase tracking-widest text-slate-400">{t.best}</span>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="mb-2 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">{t.dailyChallenge}</p>
        {challenge?.id ? (
          <>
            <h3 className="mb-6 text-center font-heading text-2xl font-black leading-tight text-slate-900" data-testid="challenge-question">
              {challenge.question_text}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                data-testid="vote-yes"
                onClick={() => vote("SI")}
                disabled={voting}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#05A845] py-6 font-heading text-2xl font-black uppercase text-white transition-all hover:bg-[#048B39] disabled:opacity-60"
              >
                {voting ? <Loader2 size={22} className="animate-spin" /> : t.voteYes}
              </button>
              <button
                data-testid="vote-no"
                onClick={() => vote("NO")}
                disabled={voting}
                className="flex items-center justify-center gap-2 rounded-xl bg-red-500 py-6 font-heading text-2xl font-black uppercase text-white transition-all hover:bg-red-600 disabled:opacity-60"
              >
                {voting ? <Loader2 size={22} className="animate-spin" /> : t.voteNo}
              </button>
            </div>
            {voting && <p className="mt-4 text-center text-sm text-slate-400">{t.verifying}</p>}
            {lastResult && (
              <div className={`mt-4 flex items-center justify-center gap-2 text-sm font-bold ${lastResult === "correct" ? "text-[#05A845]" : "text-red-500"}`}>
                {lastResult === "correct" ? <Check size={16} /> : <X size={16} />}
                {lastResult === "correct" ? t.correctToast : t.wrongToast}
              </div>
            )}
          </>
        ) : (
          <p className="py-8 text-center text-sm text-slate-400">{t.noChallenge}</p>
        )}
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm" data-testid="leaderboard">
        <div className="mb-4 flex items-center gap-2">
          <Crown size={17} className="text-[#F59E0B]" />
          <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-slate-900">{t.topTipsters}</h3>
        </div>
        <div className="space-y-1.5">
          {leaderboard.map((u, i) => {
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
