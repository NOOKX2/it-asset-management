export type LandStatus =
  | "for_rent"
  | "bank_mortgage"
  | "in_use"
  | "vacant";

export type ImprovementStatus = "developed" | "undeveloped" | "partial";

export interface LandAsset {
  id: string;
  userId?: string;
  purchasePrice: number;
  sizeRai: number;
  sizeNgan: number;
  location: string;
  googleMapsUrl: string;
  landStatus: LandStatus;
  improvementStatus: ImprovementStatus;
  hasStructures: boolean;
  titleDeedNumber: string;
  titleDeedBook: string;
  titleDeedPage: string;
  owner: string;
  description: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
}

export const LAND_STATUS_OPTIONS: {
  value: LandStatus;
  label: string;
  labelTh: string;
}[] = [
  { value: "for_rent", label: "For Rent", labelTh: "ปล่อยเช่า" },
  { value: "bank_mortgage", label: "Bank Mortgage", labelTh: "ติดแบงค์" },
  { value: "in_use", label: "In Use", labelTh: "ใช้งานอยู่" },
  { value: "vacant", label: "Vacant", labelTh: "ว่าง" },
];

export const IMPROVEMENT_OPTIONS: {
  value: ImprovementStatus;
  label: string;
}[] = [
  { value: "developed", label: "Developed" },
  { value: "undeveloped", label: "Undeveloped" },
  { value: "partial", label: "Partial Development" },
];
