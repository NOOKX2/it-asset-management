export type VendorStatus = "active" | "inactive";

export interface Vendor {
  id: string;
  userId?: string;
  name: string;
  category: string;
  taxId: string;
  contactPerson: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  province: string;
  district: string;
  assets: number;
  status: VendorStatus;
}

export const BUSINESS_TYPES = [
  "IT Hardware",
  "Precious Metals",
  "Property Services",
  "Securities",
  "Networking",
  "Software",
  "Maintenance",
  "Other",
] as const;
