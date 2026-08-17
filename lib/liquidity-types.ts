import type { CouponFrequency } from "@/lib/liquidity-kind";

export interface LiquidityAsset {
  id: number;
  userId?: string;
  holder: string;
  securityType: string;
  format: string;
  issuingInstitution: string;
  costPrice: number;
  currentPrice: number;
  moneyMarketValue: number;
  debtorsValue: number;
  creditorsValue: number;
  assetsValue: number;
  remarks: string;
  symbol: string;
  quantity: number;
  goldWeightBaht: number;
  yieldPercent: number;
  couponFrequency: CouponFrequency | string;
  navPerUnit: number;
  borrowerName: string;
  borrowedOn: string;
}

export const EMPTY_LIQUIDITY_DETAILS = {
  symbol: "",
  quantity: 0,
  goldWeightBaht: 0,
  yieldPercent: 0,
  couponFrequency: "",
  navPerUnit: 0,
  borrowerName: "",
  borrowedOn: "",
};
