export function formatBaht(amount: number, locale: string) {
  const formatted = new Intl.NumberFormat(locale === "th" ? "th-TH" : "en-US", {
    maximumFractionDigits: 0,
  }).format(amount);
  return `฿${formatted}`;
}

export function formatBahtCompact(amount: number) {
  if (!Number.isFinite(amount)) return "฿0";
  if (amount >= 1_000_000_000) return `฿${(amount / 1_000_000_000).toFixed(1)}B`;
  if (amount >= 1_000_000) return `฿${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `฿${(amount / 1_000).toFixed(1)}K`;
  return `฿${amount}`;
}
