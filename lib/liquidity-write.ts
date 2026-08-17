import type { LiquidityAsset } from "@/lib/liquidity-types";

export function liquidityWriteFields(body: Omit<LiquidityAsset, "id"> | LiquidityAsset) {
  return {
    holder: body.holder,
    securityType: body.securityType,
    format: body.format,
    issuingInstitution: body.issuingInstitution,
    costPrice: body.costPrice,
    currentPrice: body.currentPrice,
    moneyMarketValue: body.moneyMarketValue,
    debtorsValue: body.debtorsValue,
    creditorsValue: body.creditorsValue,
    assetsValue: body.assetsValue,
    remarks: body.remarks,
    symbol: body.symbol ?? "",
    quantity: body.quantity ?? 0,
    goldWeightBaht: body.goldWeightBaht ?? 0,
    yieldPercent: body.yieldPercent ?? 0,
    couponFrequency: body.couponFrequency ?? "",
    navPerUnit: body.navPerUnit ?? 0,
    borrowerName: body.borrowerName ?? "",
    borrowedOn: body.borrowedOn ?? "",
  };
}
