export function formatBaht(amount: number, locale: string) {
  const formatted = new Intl.NumberFormat(locale === "th" ? "th-TH" : "en-US", {
    maximumFractionDigits: 0,
  }).format(amount);
  return `฿${formatted}`;
}
