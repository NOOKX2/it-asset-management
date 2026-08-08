export const NAV_ITEMS = [
  { key: "overview", href: "/", icon: "grid" },
  { key: "land", href: "/land", icon: "map" },
  { key: "liquidity", href: "/liquidity", icon: "coin" },
  { key: "analysis", href: "/analysis", icon: "chart" },
  { key: "update", href: "/update", icon: "edit" },
  { key: "depreciation", href: "/depreciation", icon: "trend" },
  { key: "vendors", href: "/vendors", icon: "building" },
] as const;

export type NavKey = (typeof NAV_ITEMS)[number]["key"];
