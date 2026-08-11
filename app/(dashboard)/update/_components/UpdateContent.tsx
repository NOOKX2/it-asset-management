"use client";

import { useCallback, useMemo, useState } from "react";
import { useUpdatableAssets } from "@/lib/hooks/use-updatable-assets";
import { useCanEdit } from "@/lib/hooks/use-can-edit";
import type { UpdatableAsset } from "@/lib/update-types";
import { UpdateAssetTable } from "./UpdateAssetTable";
import { UpdateEditPanel } from "./UpdateEditPanel";
import { UpdateStatsCards } from "./UpdateStatsCards";
import { isRecentUpdate } from "./update-constants";

export function UpdateContent() {
  const { assets, isLoading, updateAsset } = useUpdatableAssets();
  const canEdit = useCanEdit();
  const [selected, setSelected] = useState<UpdatableAsset | null>(null);
  const [form, setForm] = useState<UpdatableAsset | null>(null);
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const assetTypes = useMemo(
    () => [...new Set(assets.map((a) => a.type))].sort(),
    [assets]
  );

  const stats = useMemo(() => {
    const underReview = assets.filter((a) => a.status === "review").length;
    const recentUpdates = assets.filter((a) => isRecentUpdate(a.updatedAt)).length;
    return {
      total: assets.length,
      recentUpdates,
      underReview,
    };
  }, [assets]);

  const filteredAssets = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return assets.filter((asset) => {
      if (typeFilter && asset.type !== typeFilter) return false;
      if (statusFilter && asset.status !== statusFilter) return false;
      if (query && !asset.id.toLowerCase().includes(query)) return false;
      return true;
    });
  }, [assets, typeFilter, statusFilter, searchQuery]);

  const openEdit = (asset: UpdatableAsset) => {
    setSelected(asset);
    setForm({ ...asset });
  };

  const closeEdit = () => {
    setSelected(null);
    setForm(null);
  };

  const handleSave = useCallback(async () => {
    if (!form) return;
    await updateAsset(form);
    closeEdit();
  }, [form, updateAsset]);

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-gray-500">
        Loading assets…
      </div>
    );
  }

  return (
    <>
      <UpdateStatsCards
        total={stats.total}
        recentUpdates={stats.recentUpdates}
        underReview={stats.underReview}
      />

      <div className="flex flex-col gap-6 lg:flex-row">
        <UpdateAssetTable
          assets={assets}
          filteredAssets={filteredAssets}
          assetTypes={assetTypes}
          typeFilter={typeFilter}
          statusFilter={statusFilter}
          searchQuery={searchQuery}
          canEdit={canEdit}
          onTypeFilterChange={setTypeFilter}
          onStatusFilterChange={setStatusFilter}
          onSearchQueryChange={setSearchQuery}
          onEdit={openEdit}
        />

        {canEdit && form && selected && (
          <UpdateEditPanel
            selected={selected}
            form={form}
            onClose={closeEdit}
            onSave={handleSave}
            onFormChange={setForm}
          />
        )}
      </div>
    </>
  );
}
