export type LiquidityKind =
  | "stock"
  | "gold"
  | "bond"
  | "fund"
  | "cash"
  | "loan"
  | "other";

export type CouponFrequency = "monthly" | "quarterly" | "semiannual" | "annual" | "";

export function getLiquidityKind(securityType: string): LiquidityKind {
  const lower = securityType.toLowerCase();
  if (lower.includes("gold") || lower.includes("ทอง")) return "gold";
  if (lower.includes("loan") || lower.includes("receivable") || lower.includes("เงินให้กู้")) {
    return "loan";
  }
  if (lower.includes("cash") || lower.includes("เงินสด") || lower.includes("เงินฝาก")) {
    return "cash";
  }
  if (lower.includes("bond") || lower.includes("พันธบัตร")) return "bond";
  if (lower.includes("fund") || lower.includes("กองทุน")) return "fund";
  if (lower.includes("stock") || lower.includes("หุ้น")) return "stock";
  return "other";
}
