import type { CouponFrequency } from "@/lib/liquidity-kind";
import type { UploadedFile } from "./add-asset-form-ui";

export type LiquidityType = "stock" | "gold" | "bond" | "fund" | "cash" | "loan";
export type CashHolding = "on_hand" | "bank_deposit";

export type LiquidityAssetFormState = {
  liquidityType: LiquidityType;
  symbol: string;
  issuer: string;
  accountNumber: string;
  holder: string;
  format: string;
  cashHolding: CashHolding;
  quantity: number;
  pricePerUnit: number;
  fees: number;
  debtors: number;
  creditors: number;
  remarks: string;
  goldWeightBaht: number;
  yieldPercent: number;
  couponFrequency: CouponFrequency;
  navPerUnit: number;
  borrowerName: string;
  borrowedOn: string;
  attachments: UploadedFile[];
};

const LIQUIDITY_TYPE_LABELS: Record<LiquidityType, { th: string; en: string }> = {
  stock: { th: "หุ้นสามัญ (Common Stock)", en: "Common Stock" },
  gold: { th: "ทองคำ (Gold)", en: "Gold" },
  bond: { th: "พันธบัตร (Bond)", en: "Bond" },
  fund: { th: "กองทุนรวม (Fund)", en: "Mutual Fund" },
  cash: { th: "เงินสด (Cash)", en: "Cash" },
  loan: { th: "เงินให้กู้ยืม (Loan Receivable)", en: "Loan Receivable" },
};

const CASH_HOLDING_LABELS: Record<CashHolding, { th: string; en: string }> = {
  on_hand: { th: "เงินสดในครอบครอง", en: "Cash on Hand" },
  bank_deposit: { th: "เงินฝากธนาคาร", en: "Bank Demand Deposit" },
};

export function getCashHoldingLabel(holding: CashHolding, locale: "th" | "en") {
  return locale === "th" ? CASH_HOLDING_LABELS[holding].th : CASH_HOLDING_LABELS[holding].en;
}

export function getLiquidityTypeLabel(type: LiquidityType, locale: "th" | "en") {
  return locale === "th"
    ? LIQUIDITY_TYPE_LABELS[type].th
    : LIQUIDITY_TYPE_LABELS[type].en;
}

export function toLiquidityPayload(
  state: LiquidityAssetFormState,
  locale: "th" | "en",
  cost: number,
  current: number
) {
  const goldRemarks =
    state.liquidityType === "gold" && state.goldWeightBaht > 0
      ? `${state.goldWeightBaht} บาท`
      : "";
  const holdingFormat =
    state.liquidityType === "cash"
      ? getCashHoldingLabel(state.cashHolding, locale)
      : state.liquidityType === "loan"
        ? locale === "th"
          ? "เงินให้กู้ยืม"
          : "Funds advanced"
        : state.format;
  const cashInstitution =
    state.liquidityType === "cash" && state.cashHolding === "on_hand"
      ? state.issuer || (locale === "th" ? "เก็บรักษาส่วนบุคคล" : "Personal custody")
      : state.liquidityType === "loan"
        ? state.borrowerName
        : state.issuer;

  return {
    holder: state.holder || "Global Assets Co., Ltd.",
    securityType: getLiquidityTypeLabel(state.liquidityType, locale),
    format: holdingFormat,
    issuingInstitution: cashInstitution,
    costPrice: Math.round(cost),
    currentPrice: Math.round(current),
    moneyMarketValue: Math.round(current),
    debtorsValue: state.debtors,
    creditorsValue: state.creditors,
    assetsValue: Math.round(current) + state.debtors - state.creditors,
    remarks: state.remarks || goldRemarks || state.borrowerName || state.symbol || state.accountNumber,
    symbol: state.liquidityType === "loan" ? state.borrowerName : state.symbol,
    quantity: state.liquidityType === "gold" ? state.goldWeightBaht : state.quantity,
    goldWeightBaht: state.goldWeightBaht,
    yieldPercent: state.yieldPercent,
    couponFrequency: state.couponFrequency,
    navPerUnit: state.navPerUnit,
    borrowerName: state.liquidityType === "loan" ? state.borrowerName : "",
    borrowedOn: state.liquidityType === "loan" ? state.borrowedOn : "",
  };
}

export function computeLiquidityValues(
  state: LiquidityAssetFormState,
  extras?: { marketPrice?: number | null; goldBuyPerBaht?: number | null }
) {
  const cost =
    state.liquidityType === "gold" ||
    state.liquidityType === "cash" ||
    state.liquidityType === "loan"
      ? state.pricePerUnit + state.fees
      : state.quantity * state.pricePerUnit + state.fees;

  let current = cost;
  if (state.liquidityType === "cash" || state.liquidityType === "loan") {
    return { cost, current: cost };
  }
  if (state.liquidityType === "stock" && extras?.marketPrice && state.quantity > 0) {
    current = Math.round(state.quantity * extras.marketPrice);
  } else if (
    state.liquidityType === "gold" &&
    extras?.goldBuyPerBaht &&
    state.goldWeightBaht > 0
  ) {
    current = Math.round(state.goldWeightBaht * extras.goldBuyPerBaht);
  } else if (state.liquidityType === "fund" && state.navPerUnit > 0 && state.quantity > 0) {
    current = Math.round(state.quantity * state.navPerUnit);
  } else if (state.liquidityType === "bond") {
    current = state.pricePerUnit * (state.quantity || 1) + state.fees;
  }

  return { cost, current };
}
