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
}
