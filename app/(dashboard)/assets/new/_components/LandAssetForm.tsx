"use client";

import dynamic from "next/dynamic";
import type { LandLocationValue } from "../../../land/_components/LandLocationPicker";
import type { ImprovementStatus, LandStatus } from "@/lib/land-types";
import type { Messages } from "@/lib/i18n/types";
import {
  FieldLabel,
  FileUploadZone,
  SectionCard,
  TextInput,
  type UploadedFile,
} from "./add-asset-form-ui";
import {
  LandFinancialFields,
  LandLocationReadonlyFields,
  LandOwnershipFields,
} from "./land-form-sections";

const LandLocationPicker = dynamic(
  () =>
    import("../../../land/_components/LandLocationPicker").then((m) => m.LandLocationPicker),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[420px] items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-500">
        Loading map…
      </div>
    ),
  }
);

export type LandAssetFormState = {
  landName: string;
  landDetail: string;
  landLocation: string;
  landLatitude: number;
  landLongitude: number;
  landProvince: string;
  landDistrict: string;
  sizeRai: number;
  sizeNgan: number;
  landPurchase: number;
  landCurrent: number;
  purchaseDate: string;
  landOwner: string;
  landDescription: string;
  landStatus: LandStatus;
  improvementStatus: ImprovementStatus;
  hasStructures: boolean;
  deedNumber: number;
  deedBook: number;
  deedPage: number;
  attachments: UploadedFile[];
};

type LandAssetFormProps = {
  state: LandAssetFormState;
  locale: "th" | "en";
  a: Messages["addAsset"];
  onLocationChange: (value: LandLocationValue) => void;
  onFieldChange: <K extends keyof LandAssetFormState>(
    key: K,
    value: LandAssetFormState[K]
  ) => void;
};

export function LandAssetForm({
  state,
  locale,
  a,
  onLocationChange,
  onFieldChange,
}: LandAssetFormProps) {
  return (
    <>
      <SectionCard
        step={1}
        title={a.sectionBasic}
        icon={
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel>{a.assetName}</FieldLabel>
            <TextInput
              value={state.landName}
              onChange={(v) => onFieldChange("landName", v)}
              placeholder={a.assetNamePlaceholder}
            />
          </div>
          <div>
            <FieldLabel>{a.brandModel}</FieldLabel>
            <TextInput
              value={state.landDetail}
              onChange={(v) => onFieldChange("landDetail", v)}
              placeholder={a.brandModelPlaceholder}
            />
          </div>
        </div>

        <div className="mt-5">
          <FieldLabel>{a.mapLocationTitle}</FieldLabel>
          <LandLocationPicker
            latitude={state.landLatitude}
            longitude={state.landLongitude}
            onLocationChange={onLocationChange}
            searchPlaceholder={a.searchLocation}
            locale={locale}
          />
        </div>

        <LandLocationReadonlyFields state={state} a={a} />
      </SectionCard>

      <SectionCard
        step={2}
        title={a.sectionFinancial}
        icon={
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
          </svg>
        }
      >
        <LandFinancialFields state={state} a={a} onFieldChange={onFieldChange} />
      </SectionCard>

      <SectionCard
        step={3}
        title={a.sectionLocation}
        icon={
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        }
      >
        <LandOwnershipFields
          state={state}
          locale={locale}
          a={a}
          onFieldChange={onFieldChange}
        />
      </SectionCard>

      <SectionCard
        title={a.sectionAttachments}
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
