export type LandStatus =
  | "for_rent"
  | "bank_mortgage"
  | "in_use"
  | "vacant";

export type ImprovementStatus = "developed" | "undeveloped" | "partial";

export interface LandAsset {
  id: string;
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

export const MOCK_LAND_ASSETS: LandAsset[] = [
  {
    id: "PL-882",
    purchasePrice: 45000000,
    sizeRai: 5,
    sizeNgan: 2,
    location: "Sukhumvit, Bangkok",
    googleMapsUrl: "https://maps.google.com/?q=Sukhumvit+Bangkok",
    landStatus: "in_use",
    improvementStatus: "developed",
    hasStructures: true,
    titleDeedNumber: "12345",
    titleDeedBook: "789",
    titleDeedPage: "12",
    owner: "Global Assets Co., Ltd.",
    description:
      "Prime commercial land in central Bangkok with existing office building. High foot traffic area near BTS station.",
    imageUrl:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=400&fit=crop",
    latitude: 13.7367,
    longitude: 100.5611,
  },
  {
    id: "PL-441",
    purchasePrice: 28000000,
    sizeRai: 3,
    sizeNgan: 1,
    location: "Chiang Mai Old City",
    googleMapsUrl: "https://maps.google.com/?q=Chiang+Mai+Old+City",
    landStatus: "for_rent",
    improvementStatus: "developed",
    hasStructures: true,
    titleDeedNumber: "98765",
    titleDeedBook: "456",
    titleDeedPage: "8",
    owner: "Northern Holdings Ltd.",
    description: "Historic district property suitable for boutique hotel or restaurant.",
    imageUrl:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=400&fit=crop",
    latitude: 18.7883,
    longitude: 98.9853,
  },
  {
    id: "PL-203",
    purchasePrice: 12000000,
    sizeRai: 8,
    sizeNgan: 0,
    location: "Ayutthaya Province",
    googleMapsUrl: "https://maps.google.com/?q=Ayutthaya+Province",
    landStatus: "vacant",
    improvementStatus: "undeveloped",
    hasStructures: false,
    titleDeedNumber: "54321",
    titleDeedBook: "321",
    titleDeedPage: "15",
    owner: "Riverside Development Co.",
    description: "Agricultural land with river access. Potential for resort development.",
    imageUrl:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=400&fit=crop",
    latitude: 14.3532,
    longitude: 100.5675,
  },
];
