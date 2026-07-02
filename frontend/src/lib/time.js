export function timeAgo(iso, lang = "en") {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d)) return "";
  const s = Math.max(0, Math.floor((Date.now() - d.getTime()) / 1000));
  const m = Math.floor(s / 60), h = Math.floor(m / 60), day = Math.floor(h / 24);
  if (s < 60) return lang === "it" ? "adesso" : "now";
  if (m < 60) return `${m}m`;
  if (h < 24) return `${h}h`;
  if (day < 7) return `${day}${lang === "it" ? "g" : "d"}`;
  return d.toLocaleDateString(lang === "it" ? "it-IT" : "en-GB", { day: "numeric", month: "short" });
}

export function dateTime(iso, lang = "en") {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d)) return "";
  return d.toLocaleString(lang === "it" ? "it-IT" : "en-GB", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}
