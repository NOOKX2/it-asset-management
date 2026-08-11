"use client";

import type { Messages } from "@/lib/i18n/types";
import {
  IMPROVEMENT_OPTIONS,
  LAND_STATUS_OPTIONS,
  type ImprovementStatus,
  type LandStatus,
} from "@/lib/land-types";
import { FieldLabel, NumberInput, TextInput } from "./add-asset-form-ui";
import type { LandAssetFormState } from "./LandAssetForm";

type FieldChange = <K extends keyof LandAssetFormState>(
  key: K,
  value: LandAssetFormState[K]
) => void;

const READONLY_INPUT_CLASS =
  "w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm text-gray-700 outline-none";
const INPUT_CLASS =
  "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-[var(--primary-green)] focus:ring-1 focus:ring-[var(--primary-green)]";
const SELECT_CLASS =
  "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-[var(--primary-green)]";

export function LandLocationReadonlyFields({
  state,
  a,
}: {
  state: LandAssetFormState;
  a: Messages["addAsset"];
}) {
  return (
    <div className="mt-4 grid gap-4 sm:grid-cols-2">
      <div>
        <FieldLabel>{a.provinceLabel}</FieldLabel>
        <input
          type="text"
          readOnly
          value={state.landProvince}
          placeholder="—"
          className={READONLY_INPUT_CLASS}
        />
      </div>
      <div>
        <FieldLabel>{a.districtLabel}</FieldLabel>
        <input
          type="text"
          readOnly
          value={state.landDistrict}
          placeholder="—"
          className={READONLY_INPUT_CLASS}
        />
      </div>
      <div className="sm:col-span-2">
        <FieldLabel>{a.locationLabel}</FieldLabel>
        <input
          type="text"
          readOnly
          value={state.landLocation}
          placeholder={a.locationPlaceholder}
          className={READONLY_INPUT_CLASS}
        />
      </div>
    </div>
  );
}

export function LandFinancialFields({
  state,
  a,
  onFieldChange,
}: {
  state: LandAssetFormState;
  a: Messages["addAsset"];
  onFieldChange: FieldChange;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <FieldLabel>{a.sizeRai}</FieldLabel>
        <NumberInput value={state.sizeRai} onChange={(v) => onFieldChange("sizeRai", v)} min={0} />
      </div>
      <div>
        <FieldLabel>{a.sizeNgan}</FieldLabel>
        <NumberInput value={state.sizeNgan} onChange={(v) => onFieldChange("sizeNgan", v)} min={0} max={3} />
      </div>
      <div>
        <FieldLabel>{a.purchasePrice}</FieldLabel>
        <NumberInput value={state.landPurchase} onChange={(v) => onFieldChange("landPurchase", v)} min={0} />
      </div>
      <div>
        <FieldLabel>{a.currentValue}</FieldLabel>
        <NumberInput value={state.landCurrent} onChange={(v) => onFieldChange("landCurrent", v)} min={0} />
      </div>
      <div>
        <FieldLabel>{a.purchaseDate}</FieldLabel>
        <input
          type="date"
          value={state.purchaseDate}
          onChange={(e) => onFieldChange("purchaseDate", e.target.value)}
          className={INPUT_CLASS}
        />
      </div>
    </div>
  );
}

export function LandOwnershipFields({
  state,
  locale,
  a,
  onFieldChange,
}: {
  state: LandAssetFormState;
  locale: "th" | "en";
  a: Messages["addAsset"];
  onFieldChange: FieldChange;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <FieldLabel>{a.owner}</FieldLabel>
        <TextInput
          value={state.landOwner}
          onChange={(v) => onFieldChange("landOwner", v)}
          placeholder={a.ownerPlaceholder}
        />
      </div>
      <div>
        <FieldLabel>{a.landStatus}</FieldLabel>
        <select
          value={state.landStatus}
          onChange={(e) => onFieldChange("landStatus", e.target.value as LandStatus)}
          className={SELECT_CLASS}
        >
          {LAND_STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {locale === "th" ? opt.labelTh : opt.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <FieldLabel>{a.improvementStatus}</FieldLabel>
        <select
          value={state.improvementStatus}
          onChange={(e) =>
            onFieldChange("improvementStatus", e.target.value as ImprovementStatus)
          }
          className={SELECT_CLASS}
        >
          {IMPROVEMENT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div className="flex items-end">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={state.hasStructures}
            onChange={(e) => onFieldChange("hasStructures", e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-[var(--primary-green)] focus:ring-[var(--primary-green)]"
          />
          {a.hasStructures}
        </label>
      </div>
      <div>
        <FieldLabel>{a.titleDeedNumber}</FieldLabel>
        <NumberInput value={state.deedNumber} onChange={(v) => onFieldChange("deedNumber", v)} min={0} />
      </div>
      <div>
        <FieldLabel>{a.titleDeedBook}</FieldLabel>
        <NumberInput value={state.deedBook} onChange={(v) => onFieldChange("deedBook", v)} min={0} />
      </div>
      <div>
        <FieldLabel>{a.titleDeedPage}</FieldLabel>
        <NumberInput value={state.deedPage} onChange={(v) => onFieldChange("deedPage", v)} min={0} />
      </div>
      <div className="sm:col-span-2">
        <FieldLabel>{a.description}</FieldLabel>
        <textarea
          value={state.landDescription}
          onChange={(e) => onFieldChange("landDescription", e.target.value)}
          rows={3}
          placeholder={a.descriptionPlaceholder}
          className={INPUT_CLASS}
        />
      </div>
    </div>
  );
}
