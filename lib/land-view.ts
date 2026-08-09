export type LandViewMode = "map" | "table";

export function parseLandViewMode(view: string | null): LandViewMode {
  return view === "table" ? "table" : "map";
}
