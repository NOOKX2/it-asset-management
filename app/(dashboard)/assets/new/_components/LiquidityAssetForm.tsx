"use client";

import { useMemo } from "react";
import type { Messages } from "@/lib/i18n/types";
import {
  FileUploadZone,
  SectionCard,
  type UploadedFile,
} from "./add-asset-form-ui";
import {
  LiquidityFinancialFields,
  LiquidityTransactionFields,
  LiquidityTypePicker,
} from "./liquidity-form-sections";

export type LiquidityType = "stock" | "gold" | "bond" | "fund";

const LIQUIDITY_TYPE_LABELS: Record<LiquidityType, { th: string; en: string }> = {
  stock: { th: "หุ้นสามัญ (Common Stock)", en: "Common Stock" },
  gold: { th: "ทองคำ (Gold)", en: "Gold" },
  bond: { th: "พันธบัตร (Bond)", en: "Bond" },
  fund: { th: "กองทุนรวม (Fund)", en: "Mutual Fund" },
};

export function getLiquidityTypeLabel(type: LiquidityType, locale: "th" | "en") {
  return locale === "th"
    ? LIQUIDITY_TYPE_LABELS[type].th
    : LIQUIDITY_TYPE_LABELS[type].en;
}

export type LiquidityAssetFormState = {
  liquidityType: LiquidityType;
  marketSync: boolean;
  symbol: string;
  issuer: string;
  accountNumber: string;
  holder: string;
  format: string;
  quantity: number;
  pricePerUnit: number;
  fees: number;
  debtors: number;
  creditors: number;
  remarks: string;
  attachments: UploadedFile[];
};

type LiquidityAssetFormProps = {
  state: LiquidityAssetFormState;
  locale: "th" | "en";
  a: Messages["addAsset"];
  onFieldChange: <K extends keyof LiquidityAssetFormState>(
    key: K,
    value: LiquidityAssetFormState[K]
  ) => void;
};

export function LiquidityAssetForm({
  state,
  locale,
  a,
  onFieldChange,
}: LiquidityAssetFormProps) {
  const liquidityTotalCost = useMemo(
    () => state.quantity * state.pricePerUnit + state.fees,
    [state.quantity, state.pricePerUnit, state.fees]
  );

  return (
    <>
      <SectionCard
        step={1}
        title={a.sectionAssetType}
        icon={
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
          </svg>
        }
      >
        <LiquidityTypePicker
          value={state.liquidityType}
          onChange={(type) => onFieldChange("liquidityType", type)}
          a={a}
        />
      </SectionCard>

      <SectionCard
        step={2}
        title={a.sectionTransaction}
        icon={
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        }
      >
        <LiquidityTransactionFields state={state} a={a} onFieldChange={onFieldChange} />
      </SectionCard>

      <SectionCard
        step={3}
        title={a.sectionFinancial}
        icon={
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
          </svg>
        }
      >
        <LiquidityFinancialFields
          state={state}
          locale={locale}
          a={a}
          totalCost={liquidityTotalCost}
          onFieldChange={onFieldChange}
        />
      </SectionCard>

      <SectionCard
        step={4}
        title={a.sectionIntegration}
        icon={
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        }
      >
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={state.marketSync}
            onChange={(e) => onFieldChange("marketSync", e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-[var(--primary-green)] focus:ring-[var(--primary-green)]"
          />
          <div>
            <p className="text-sm font-medium text-gray-900">{a.marketSync}</p>
            <p className="text-xs text-gray-500">{a.marketSyncHint}</p>
          </div>
        </label>
      </SectionCard>

      <SectionCard
        step={5}
        title={a.sectionDocumentation}
        icon={
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        }
      >
        <FileUploadZone
          files={state.attachments}
          onFilesChange={(files) => onFieldChange("attachments", files)}
          hint={a.uploadHint}
          subhint={a.uploadSubhint}
          removeLabel={a.removeFile}
          fileTooLarge={a.fileTooLarge}
          invalidFileType={a.invalidFileType}
        />
      </SectionCard>
    </>
  );
}
