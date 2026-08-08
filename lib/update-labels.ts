import type { Messages } from "@/lib/i18n/types";
import type { AssetStatus } from "@/lib/update-types";

export function getAssetStatusLabel(
  status: AssetStatus,
  update: Messages["update"]
): string {
  const map: Record<AssetStatus, string> = {
    active: update.statusActive,
    needs_repair: update.statusRepair,
    storage: update.statusStorage,
    review: update.statusReview,
  };
  return map[status];
}
