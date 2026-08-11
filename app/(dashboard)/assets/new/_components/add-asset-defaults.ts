import type { LandAssetFormState } from "./LandAssetForm";
import type { LiquidityAssetFormState } from "./LiquidityAssetForm";

export const DEFAULT_LAND_IMAGE =
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=400&fit=crop";

export const INITIAL_LAND_STATE: LandAssetFormState = {
  landName: "",
  landDetail: "",
  landLocation: "",
  landLatitude: 13.7563,
  landLongitude: 100.5018,
  landProvince: "",
  landDistrict: "",
  sizeRai: 0,
  sizeNgan: 0,
  landPurchase: 0,
  landCurrent: 0,
  purchaseDate: "",
  landOwner: "",
  landDescription: "",
  landStatus: "in_use",
  improvementStatus: "undeveloped",
  hasStructures: false,
  deedNumber: 0,
  deedBook: 0,
  deedPage: 0,
  attachments: [],
};

export const INITIAL_LIQUIDITY_STATE: LiquidityAssetFormState = {
  liquidityType: "stock",
  marketSync: true,
  symbol: "",
  issuer: "",
  accountNumber: "",
  holder: "",
  format: "Scriptless",
  quantity: 0,
  pricePerUnit: 0,
  fees: 0,
  debtors: 0,
  creditors: 0,
  remarks: "",
  attachments: [],
};
