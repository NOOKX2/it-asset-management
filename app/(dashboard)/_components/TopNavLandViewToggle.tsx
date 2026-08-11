"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LandViewToggle } from "./LandViewToggle";
import { parseLandViewMode, type LandViewMode } from "@/lib/land-view";

export function TopNavLandViewToggle() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  if (pathname !== "/land") {
    return null;
  }

  const landViewMode = parseLandViewMode(searchParams.get("view"));

  const setLandViewMode = (mode: LandViewMode) => {
    const params = new URLSearchParams(searchParams.toString());
    if (mode === "table") {
      params.set("view", "table");
    } else {
      params.delete("view");
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <LandViewToggle mode={landViewMode} onChange={setLandViewMode} className="shadow-none" />
  );
}
