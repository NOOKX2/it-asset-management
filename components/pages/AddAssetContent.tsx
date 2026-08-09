"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { LandLocationValue } from "@/components/land/LandLocationPicker";
import { API_KEYS, apiPost } from "@/lib/api/client";
import { formatBaht } from "@/lib/format-currency";
import {
  IMPROVEMENT_OPTIONS,
  LAND_STATUS_OPTIONS,
  type ImprovementStatus,
  type LandAsset,
  type LandStatus,
} from "@/lib/land-types";
import type { LiquidityAsset } from "@/lib/liquidity-types";

const LandLocationPicker = dynamic(
  () =>
    import("@/components/land/LandLocationPicker").then((m) => m.LandLocationPicker),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[420px] items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-500">
        Loading map…
      </div>
    ),
  }
);

type AssetCategory = "land" | "liquidity";
type LiquidityType = "stock" | "gold" | "bond" | "fund";

const DEFAULT_LAND_IMAGE =
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=400&fit=crop";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
]);
const FILE_ACCEPT = ".pdf,.jpg,.jpeg,.png";

type UploadedFile = {
  id: string;
  file: File;
};

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isAcceptedFile(file: File) {
  if (ACCEPTED_FILE_TYPES.has(file.type)) return true;
  return /\.(pdf|jpe?g|png)$/i.test(file.name);
}

const LIQUIDITY_TYPE_LABELS: Record<
  LiquidityType,
  { th: string; en: string }
> = {
  stock: { th: "หุ้นสามัญ (Common Stock)", en: "Common Stock" },
  gold: { th: "ทองคำ (Gold)", en: "Gold" },
  bond: { th: "พันธบัตร (Bond)", en: "Bond" },
  fund: { th: "กองทุนรวม (Fund)", en: "Mutual Fund" },
};

function SectionCard({
  icon,
  title,
  step,
  children,
}: {
  icon: ReactNode;
  title: string;
  step?: number;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[var(--card-border)] bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--light-green-bg)] text-[var(--primary-green)]">
          {icon}
        </span>
        {step !== undefined && (
          <span className="text-sm font-bold text-[var(--primary-green)]">
            {step}.
          </span>
        )}
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <label className="mb-1.5 block text-sm font-medium text-gray-700">
      {children}
    </label>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-[var(--primary-green)] focus:ring-1 focus:ring-[var(--primary-green)]"
    />
  );
}

function NumberInput({
  value,
  onChange,
  placeholder,
  min,
  max,
}: {
  value: number;
  onChange: (v: number) => void;
  placeholder?: string;
  min?: number;
  max?: number;
}) {
  return (
    <input
      type="number"
      value={value || ""}
      min={min}
      max={max}
      onChange={(e) => onChange(Number(e.target.value))}
      placeholder={placeholder}
      className="no-spin w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-[var(--primary-green)] focus:ring-1 focus:ring-[var(--primary-green)]"
    />
  );
}

function FileUploadZone({
  files,
  onFilesChange,
  hint,
  subhint,
  removeLabel,
  fileTooLarge,
  invalidFileType,
}: {
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
  hint: string;
  subhint: string;
  removeLabel: string;
  fileTooLarge: string;
  invalidFileType: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addFiles = (fileList: FileList | File[]) => {
    const incoming = Array.from(fileList);
    if (incoming.length === 0) return;

    const next = [...files];
    let hadError = false;

    for (const file of incoming) {
      if (!isAcceptedFile(file)) {
        setError(invalidFileType);
        hadError = true;
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError(fileTooLarge);
        hadError = true;
        continue;
      }
      next.push({
        id: `${file.name}-${file.size}-${crypto.randomUUID()}`,
        file,
      });
    }

    if (next.length > files.length) {
      onFilesChange(next);
      if (!hadError) setError(null);
    }
  };

  const removeFile = (id: string) => {
    onFilesChange(files.filter((f) => f.id !== id));
    setError(null);
  };

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragOver(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          addFiles(e.dataTransfer.files);
        }}
        className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors cursor-pointer ${
          dragOver
            ? "border-[var(--primary-green)] bg-[var(--light-green-bg)]"
            : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100/80"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={FILE_ACCEPT}
          className="hidden"
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <svg
          className="mb-3 h-10 w-10 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <p className="text-sm font-medium text-gray-700">{hint}</p>
        <p className="mt-1 text-xs text-gray-500">{subhint}</p>
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">{error}</p>
      )}

      {files.length > 0 && (
        <ul className="mt-4 space-y-2">
          {files.map(({ id, file }) => (
            <li
              key={id}
              className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2.5"
            >
              <svg
                className="h-5 w-5 shrink-0 text-[var(--primary-green)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
              </div>
              <button
                type="button"
                onClick={() => removeFile(id)}
                className="shrink-0 text-sm font-medium text-gray-500 transition-colors hover:text-red-600"
              >
                {removeLabel}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function AddAssetContent() {
  const router = useRouter();
  const { locale, t } = useLocale();
  const a = t.addAsset;

  const [category, setCategory] = useState<AssetCategory>("land");
  const [liquidityType, setLiquidityType] = useState<LiquidityType>("stock");
  const [marketSync, setMarketSync] = useState(true);

  // Land fields
  const [landName, setLandName] = useState("");
  const [landDetail, setLandDetail] = useState("");
  const [landLocation, setLandLocation] = useState("");
  const [mapsUrl, setMapsUrl] = useState("");
  const [landLatitude, setLandLatitude] = useState(13.7563);
  const [landLongitude, setLandLongitude] = useState(100.5018);
  const [landProvince, setLandProvince] = useState("");
  const [landDistrict, setLandDistrict] = useState("");
  const [sizeRai, setSizeRai] = useState(0);
  const [sizeNgan, setSizeNgan] = useState(0);
  const [landPurchase, setLandPurchase] = useState(0);
  const [landCurrent, setLandCurrent] = useState(0);
  const [purchaseDate, setPurchaseDate] = useState("");
  const [landOwner, setLandOwner] = useState("");
  const [landDescription, setLandDescription] = useState("");
  const [landStatus, setLandStatus] = useState<LandStatus>("in_use");
  const [improvementStatus, setImprovementStatus] =
    useState<ImprovementStatus>("undeveloped");
  const [hasStructures, setHasStructures] = useState(false);
  const [deedNumber, setDeedNumber] = useState(0);
  const [deedBook, setDeedBook] = useState(0);
  const [deedPage, setDeedPage] = useState(0);
  const [attachments, setAttachments] = useState<UploadedFile[]>([]);

  // Liquidity fields
  const [symbol, setSymbol] = useState("");
  const [issuer, setIssuer] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [holder, setHolder] = useState("");
  const [format, setFormat] = useState("Scriptless");
  const [quantity, setQuantity] = useState(0);
  const [pricePerUnit, setPricePerUnit] = useState(0);
  const [fees, setFees] = useState(0);
  const [debtors, setDebtors] = useState(0);
  const [creditors, setCreditors] = useState(0);
  const [remarks, setRemarks] = useState("");

  const liquidityTotalCost = useMemo(
    () => quantity * pricePerUnit + fees,
    [quantity, pricePerUnit, fees]
  );

  const liquidityCurrentPrice = useMemo(() => {
    if (marketSync) return liquidityTotalCost;
    return quantity * pricePerUnit;
  }, [marketSync, liquidityTotalCost, quantity, pricePerUnit]);

  const handleLandLocationChange = useCallback((value: LandLocationValue) => {
    setLandLatitude(value.latitude);
    setLandLongitude(value.longitude);
    setLandProvince(value.province);
    setLandDistrict(value.district);
    setLandLocation(value.displayName);
    setMapsUrl(value.googleMapsUrl);
  }, []);

  const handleSave = async () => {
    if (category === "land") {
      const id = `PL-${Date.now().toString().slice(-5)}`;
      const imageAttachment = attachments.find((a) =>
        a.file.type.startsWith("image/")
      );
      const asset: LandAsset = {
        id,
        purchasePrice: landPurchase,
        sizeRai,
        sizeNgan,
        location: landLocation || landName,
        googleMapsUrl:
          mapsUrl ||
          `https://maps.google.com/?q=${encodeURIComponent(landLocation || landName)}`,
        landStatus,
        improvementStatus,
        hasStructures,
        titleDeedNumber: deedNumber ? String(deedNumber) : "",
        titleDeedBook: deedBook ? String(deedBook) : "",
        titleDeedPage: deedPage ? String(deedPage) : "",
        owner: landOwner,
        description: landDescription || landDetail,
        imageUrl: imageAttachment
          ? URL.createObjectURL(imageAttachment.file)
          : DEFAULT_LAND_IMAGE,
        latitude: landLatitude,
        longitude: landLongitude,
      };
      await apiPost(API_KEYS.landAssets, asset);
      router.push("/land");
      return;
    }

    const typeLabel =
      locale === "th"
        ? LIQUIDITY_TYPE_LABELS[liquidityType].th
        : LIQUIDITY_TYPE_LABELS[liquidityType].en;

    const asset: Omit<LiquidityAsset, "id"> = {
      holder: holder || "Global Assets Co., Ltd.",
      securityType: typeLabel,
      format,
      issuingInstitution: issuer,
      costPrice: liquidityTotalCost,
      currentPrice: liquidityCurrentPrice,
      moneyMarketValue: liquidityCurrentPrice,
      debtorsValue: debtors,
      creditorsValue: creditors,
      assetsValue: liquidityCurrentPrice + debtors - creditors,
      remarks: remarks || symbol || accountNumber,
    };
    await apiPost(API_KEYS.liquidityAssets, asset);
    router.push("/liquidity");
  };

  const categoryCards: {
    key: AssetCategory;
    label: string;
    icon: ReactNode;
  }[] = [
    {
      key: "land",
      label: a.categoryLand,
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
          />
        </svg>
      ),
    },
    {
      key: "liquidity",
      label: a.categoryLiquidity,
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
  ];

  const liquidityTypes: { key: LiquidityType; label: string; icon: ReactNode }[] = [
    {
      key: "stock",
      label: a.typeStock,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      key: "gold",
      label: a.typeGold,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      key: "bond",
      label: a.typeBond,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      key: "fund",
      label: a.typeFund,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{a.title}</h1>
        {category === "land" && (
          <p className="mt-1 text-sm text-gray-500">{a.landSubtitle}</p>
        )}
        {category === "liquidity" && (
          <p className="mt-1 text-sm text-gray-500">{a.liquiditySubtitle}</p>
        )}
      </div>

      {/* Category picker */}
      <section className="rounded-2xl border border-[var(--card-border)] bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--light-green-bg)] text-[var(--primary-green)]">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </span>
          <h2 className="text-base font-semibold text-gray-900">{a.categoryTitle}</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {categoryCards.map((card) => {
            const selected = category === card.key;
            return (
              <button
                key={card.key}
                type="button"
                onClick={() => setCategory(card.key)}
                className={`flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all ${
                  selected
                    ? "border-[var(--primary-green)] bg-[var(--light-green-bg)]"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                    selected
                      ? "bg-[var(--primary-green)] text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {card.icon}
                </span>
                <span className="text-sm font-semibold text-gray-900">{card.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {category === "land" ? (
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
                  value={landName}
                  onChange={setLandName}
                  placeholder={a.assetNamePlaceholder}
                />
              </div>
              <div>
                <FieldLabel>{a.brandModel}</FieldLabel>
                <TextInput
                  value={landDetail}
                  onChange={setLandDetail}
                  placeholder={a.brandModelPlaceholder}
                />
              </div>
            </div>

            <div className="mt-5">
              <FieldLabel>{a.mapLocationTitle}</FieldLabel>
              <LandLocationPicker
                latitude={landLatitude}
                longitude={landLongitude}
                onLocationChange={handleLandLocationChange}
                searchPlaceholder={a.searchLocation}
                locale={locale}
              />
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel>{a.provinceLabel}</FieldLabel>
                <input
                  type="text"
                  readOnly
                  value={landProvince}
                  placeholder="—"
                  className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm text-gray-700 outline-none"
                />
              </div>
              <div>
                <FieldLabel>{a.districtLabel}</FieldLabel>
                <input
                  type="text"
                  readOnly
                  value={landDistrict}
                  placeholder="—"
                  className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm text-gray-700 outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <FieldLabel>{a.locationLabel}</FieldLabel>
                <input
                  type="text"
                  readOnly
                  value={landLocation}
                  placeholder={a.locationPlaceholder}
                  className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm text-gray-700 outline-none"
                />
              </div>
            </div>
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
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel>{a.sizeRai}</FieldLabel>
                <NumberInput value={sizeRai} onChange={setSizeRai} min={0} />
              </div>
              <div>
                <FieldLabel>{a.sizeNgan}</FieldLabel>
                <NumberInput value={sizeNgan} onChange={setSizeNgan} min={0} max={3} />
              </div>
              <div>
                <FieldLabel>{a.purchasePrice}</FieldLabel>
                <NumberInput value={landPurchase} onChange={setLandPurchase} min={0} />
              </div>
              <div>
                <FieldLabel>{a.currentValue}</FieldLabel>
                <NumberInput value={landCurrent} onChange={setLandCurrent} min={0} />
              </div>
              <div>
                <FieldLabel>{a.purchaseDate}</FieldLabel>
                <input
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-[var(--primary-green)] focus:ring-1 focus:ring-[var(--primary-green)]"
                />
              </div>
            </div>
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
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel>{a.owner}</FieldLabel>
                <TextInput
                  value={landOwner}
                  onChange={setLandOwner}
                  placeholder={a.ownerPlaceholder}
                />
              </div>
              <div>
                <FieldLabel>{a.landStatus}</FieldLabel>
                <select
                  value={landStatus}
                  onChange={(e) => setLandStatus(e.target.value as LandStatus)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-[var(--primary-green)]"
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
                  value={improvementStatus}
                  onChange={(e) =>
                    setImprovementStatus(e.target.value as ImprovementStatus)
                  }
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-[var(--primary-green)]"
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
                    checked={hasStructures}
                    onChange={(e) => setHasStructures(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-[var(--primary-green)] focus:ring-[var(--primary-green)]"
                  />
                  {a.hasStructures}
                </label>
              </div>
              <div>
                <FieldLabel>{a.titleDeedNumber}</FieldLabel>
                <NumberInput value={deedNumber} onChange={setDeedNumber} min={0} />
              </div>
              <div>
                <FieldLabel>{a.titleDeedBook}</FieldLabel>
                <NumberInput value={deedBook} onChange={setDeedBook} min={0} />
              </div>
              <div>
                <FieldLabel>{a.titleDeedPage}</FieldLabel>
                <NumberInput value={deedPage} onChange={setDeedPage} min={0} />
              </div>
              <div className="sm:col-span-2">
                <FieldLabel>{a.description}</FieldLabel>
                <textarea
                  value={landDescription}
                  onChange={(e) => setLandDescription(e.target.value)}
                  rows={3}
                  placeholder={a.descriptionPlaceholder}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-[var(--primary-green)] focus:ring-1 focus:ring-[var(--primary-green)]"
                />
              </div>
            </div>
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
              files={attachments}
              onFilesChange={setAttachments}
              hint={a.uploadHint}
              subhint={a.uploadSubhint}
              removeLabel={a.removeFile}
              fileTooLarge={a.fileTooLarge}
              invalidFileType={a.invalidFileType}
            />
          </SectionCard>
        </>
      ) : (
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
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {liquidityTypes.map((lt) => {
                const selected = liquidityType === lt.key;
                return (
                  <button
                    key={lt.key}
                    type="button"
                    onClick={() => setLiquidityType(lt.key)}
                    className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                      selected
                        ? "border-[var(--primary-green)] bg-[var(--light-green-bg)]"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        selected
                          ? "bg-[var(--primary-green)] text-white"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {lt.icon}
                    </span>
                    <span className="text-xs font-semibold text-gray-800">{lt.label}</span>
                  </button>
                );
              })}
            </div>
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
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel>{a.symbolName}</FieldLabel>
                <TextInput
                  value={symbol}
                  onChange={setSymbol}
                  placeholder={a.symbolPlaceholder}
                />
              </div>
              <div>
                <FieldLabel>{a.holder}</FieldLabel>
                <TextInput
                  value={holder}
                  onChange={setHolder}
                  placeholder={a.holderPlaceholder}
                />
              </div>
              <div>
                <FieldLabel>{a.issuer}</FieldLabel>
                <TextInput
                  value={issuer}
                  onChange={setIssuer}
                  placeholder={a.issuerPlaceholder}
                />
              </div>
              <div>
                <FieldLabel>{a.accountNumber}</FieldLabel>
                <TextInput
                  value={accountNumber}
                  onChange={setAccountNumber}
                  placeholder={a.accountPlaceholder}
                />
              </div>
              <div>
                <FieldLabel>{a.format}</FieldLabel>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-[var(--primary-green)]"
                >
                  <option value="Physical">{a.formatPhysical}</option>
                  <option value="Scriptless">{a.formatScriptless}</option>
                </select>
              </div>
            </div>
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
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel>{a.quantity}</FieldLabel>
                <NumberInput value={quantity} onChange={setQuantity} min={0} />
              </div>
              <div>
                <FieldLabel>{a.pricePerUnit}</FieldLabel>
                <NumberInput value={pricePerUnit} onChange={setPricePerUnit} min={0} />
              </div>
              <div>
                <FieldLabel>{a.currency}</FieldLabel>
                <select
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-[var(--primary-green)]"
                  defaultValue="THB"
                >
                  <option value="THB">THB - Thai Baht</option>
                  <option value="USD">USD - US Dollar</option>
                </select>
              </div>
              <div>
                <FieldLabel>{a.fees}</FieldLabel>
                <NumberInput value={fees} onChange={setFees} min={0} />
              </div>
              <div>
                <FieldLabel>{a.debtors}</FieldLabel>
                <NumberInput value={debtors} onChange={setDebtors} min={0} />
              </div>
              <div>
                <FieldLabel>{a.creditors}</FieldLabel>
                <NumberInput value={creditors} onChange={setCreditors} min={0} />
              </div>
              <div className="sm:col-span-2">
                <FieldLabel>{a.remarks}</FieldLabel>
                <TextInput
                  value={remarks}
                  onChange={setRemarks}
                  placeholder={a.remarksPlaceholder}
                />
              </div>
            </div>
            <div className="mt-4 rounded-xl bg-gray-100 px-6 py-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                {a.totalCost}
              </p>
              <p className="mt-1 text-3xl font-bold text-gray-900">
                {formatBaht(liquidityTotalCost, locale)}
              </p>
            </div>
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
                checked={marketSync}
                onChange={(e) => setMarketSync(e.target.checked)}
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
              files={attachments}
              onFilesChange={setAttachments}
              hint={a.uploadHint}
              subhint={a.uploadSubhint}
              removeLabel={a.removeFile}
              fileTooLarge={a.fileTooLarge}
              invalidFileType={a.invalidFileType}
            />
          </SectionCard>
        </>
      )}

      {/* Footer actions */}
      <div className="flex justify-end gap-3 pt-2">
        <Link
          href="/"
          className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          {t.common.cancel}
        </Link>
        <button
          type="button"
          onClick={handleSave}
          className="flex items-center gap-2 rounded-xl bg-[var(--primary-green)] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--primary-green-dark)]"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          {a.save}
        </button>
      </div>
    </div>
  );
}
