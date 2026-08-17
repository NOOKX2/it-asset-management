export function parseIsoDate(iso: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  return new Date(year, month - 1, day);
}

export function todayIsoDate(now = new Date()) {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function daysOutstanding(isoDate: string, now = new Date()): number | null {
  const start = parseIsoDate(isoDate);
  if (!start) return null;
  const startUtc = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const todayUtc = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.max(0, Math.round((todayUtc - startUtc) / 86_400_000));
}

export function formatIsoDate(isoDate: string, locale: "th" | "en") {
  const date = parseIsoDate(isoDate);
  if (!date) return isoDate || "—";
  return date.toLocaleDateString(locale === "th" ? "th-TH" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDaysOutstanding(days: number, locale: "th" | "en") {
  if (locale === "th") return `${days} วัน`;
  return days === 1 ? "1 day" : `${days} days`;
}
