export interface LiquidityAsset {
  id: number;
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

export const MOCK_LIQUIDITY_ASSETS: LiquidityAsset[] = [
  {
    id: 1,
    holder: "Global Assets Co., Ltd.",
    securityType: "ทองคำ (Gold)",
    format: "Physical",
    issuingInstitution: "Gold Traders Association",
    costPrice: 3200000,
    currentPrice: 3850000,
    moneyMarketValue: 3850000,
    debtorsValue: 0,
    creditorsValue: 0,
    assetsValue: 3850000,
    remarks: "99.99% gold bars",
  },
  {
    id: 2,
    holder: "Global Assets Co., Ltd.",
    securityType: "หุ้นสามัญ (Common Stock)",
    format: "Scriptless",
    issuingInstitution: "SET",
    costPrice: 1500000,
    currentPrice: 1820000,
    moneyMarketValue: 1820000,
    debtorsValue: 0,
    creditorsValue: 0,
    assetsValue: 1820000,
    remarks: "PTT, CPALL portfolio",
  },
  {
    id: 3,
    holder: "Northern Holdings Ltd.",
    securityType: "พันธบัตร (Bond)",
    format: "Scriptless",
    issuingInstitution: "ธนาคารกรุงเทพ",
    costPrice: 5000000,
    currentPrice: 5150000,
    moneyMarketValue: 5150000,
    debtorsValue: 0,
    creditorsValue: 200000,
    assetsValue: 4950000,
    remarks: "Corporate bond, 3.5% yield",
  },
  {
    id: 4,
    holder: "Riverside Development Co.",
    securityType: "หุ้นสามัญ (Common Stock)",
    format: "Physical certificate",
    issuingInstitution: "SET",
    costPrice: 800000,
    currentPrice: 720000,
    moneyMarketValue: 720000,
    debtorsValue: 50000,
    creditorsValue: 0,
    assetsValue: 770000,
    remarks: "SCB holdings",
  },
];
