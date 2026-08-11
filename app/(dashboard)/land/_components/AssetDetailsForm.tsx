"use client";

import { useCallback, useEffect, useState } from "react";
import type { LandAsset } from "@/lib/land-types";
import {
  AssetDetailsFormFooter,
  AssetDetailsFormHeader,
} from "./AssetDetailsFormParts";
import {
  AssetDetailsFormFields,
} from "./AssetDetailsFormFields";
import { AssetDetailsMediaFields } from "./AssetDetailsMediaFields";

interface AssetDetailsFormProps {
  asset: LandAsset;
  onSave: (asset: LandAsset) => void;
  onClose?: () => void;
  variant?: "card" | "panel";
  readOnly?: boolean;
}

export function AssetDetailsForm({
  asset,
  onSave,
  onClose,
  variant = "card",
  readOnly = false,
}: AssetDetailsFormProps) {
  const [form, setForm] = useState<LandAsset>(asset);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm(asset);
    setSaved(false);
  }, [asset]);

  const isPanel = variant === "panel";

  const updateField = <K extends keyof LandAsset>(key: K, value: LandAsset[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = useCallback(() => {
    onSave(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }, [form, onSave]);

  const handleCancel = () => {
    if (onClose) {
      onClose();
      return;
    }
    setForm(asset);
    setSaved(false);
  };

  return (
    <div
      className={`flex flex-col bg-white ${
        isPanel
          ? "h-full"
          : "rounded-2xl border border-[var(--card-border)] shadow-sm"
      }`}
    >
      <AssetDetailsFormHeader formId={form.id} onClose={onClose} />

      <fieldset
        disabled={readOnly}
        className="flex-1 overflow-y-auto border-0 p-5 disabled:opacity-100"
      >
        <AssetDetailsFormFields form={form} updateField={updateField} />
        <AssetDetailsMediaFields form={form} updateField={updateField} />
      </fieldset>

      {!readOnly && (
        <AssetDetailsFormFooter
          saved={saved}
          onCancel={handleCancel}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
