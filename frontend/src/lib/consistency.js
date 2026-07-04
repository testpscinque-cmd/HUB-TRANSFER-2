// Detects a contract mismatch: a free-transfer claim while the contract still runs beyond this year.
const FREE_HINTS = ["free transfer", "free agent", "parametro zero", "a parametro zero", "svincolat", "a zero"];

export function contractMismatch(dealFormula, description, contractExpiry, role) {
  if (role && role !== "Player") return false;
  const text = `${dealFormula || ""} ${description || ""}`.toLowerCase();
  const impliesFree =
    (dealFormula || "").toLowerCase() === "free transfer" || FREE_HINTS.some((h) => text.includes(h));
  const year =
    contractExpiry && contractExpiry.length >= 4 ? parseInt(contractExpiry.slice(0, 4), 10) : null;
  const currentYear = new Date().getFullYear();
  return Boolean(impliesFree && year && year > currentYear);
}
