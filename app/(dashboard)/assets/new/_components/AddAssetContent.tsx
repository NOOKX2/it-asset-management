"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { LandLocationValue } from "../../../land/_components/LandLocationPicker";
import { API_KEYS, apiPost } from "@/lib/api/client";
import type { LandAsset } from "@/lib/land-types";
import type { LiquidityAsset } from "@/lib/liquidity-types";
import { LandAssetForm, type LandAssetFormState } from "./LandAssetForm";
import {
  getLiquidityTypeLabel,
  LiquidityAssetForm,
  type LiquidityAssetFormState,
} from "./LiquidityAssetForm";
import { AssetCategoryPicker, type AssetCategory } from "./AssetCategoryPicker";
import {
  DEFAULT_LAND_IMAGE,
  INITIAL_LAND_STATE,
  INITIAL_LIQUIDITY_STATE,
} from "./add-asset-defaults";

export function AddAssetContent() {
  const router = useRouter();
  const { locale, t } = useLocale();
  const a = t.addAsset;

  const [category, setCategory] = useState<AssetCategory>("land");
  const [landState, setLandState] = useState<LandAssetFormState>(INITIAL_LAND_STATE);
  const [liquidityState, setLiquidityState] = useState<LiquidityAssetFormState>(
    INITIAL_LIQUIDITY_STATE
  );
  const [mapsUrl, setMapsUrl] = useState("");

  const liquidityTotalCost = useMemo(
    () =>
      liquidityState.quantity * liquidityState.pricePerUnit + liquidityState.fees,
    [liquidityState.quantity, liquidityState.pricePerUnit, liquidityState.fees]
  );

  const liquidityCurrentPrice = useMemo(() => {
    if (liquidityState.marketSync) return liquidityTotalCost;
    return liquidityState.quantity * liquidityState.pricePerUnit;
  }, [
    liquidityState.marketSync,
    liquidityTotalCost,
    liquidityState.quantity,
    liquidityState.pricePerUnit,
  ]);

  const updateLandField = useCallback(
    <K extends keyof LandAssetFormState>(key: K, value: LandAssetFormState[K]) => {
      setLandState((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const updateLiquidityField = useCallback(
    <K extends keyof LiquidityAssetFormState>(
      key: K,
      value: LiquidityAssetFormState[K]
    ) => {
      setLiquidityState((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleLandLocationChange = useCallback((value: LandLocationValue) => {
    setLandState((prev) => ({
      ...prev,
      landLatitude: value.latitude,
      landLongitude: value.longitude,
      landProvince: value.province,
      landDistrict: value.district,
      landLocation: value.displayName,
    }));
    setMapsUrl(value.googleMapsUrl);
  }, []);

  const saveLandAsset = async () => {
    const imageAttachment = landState.attachments.find((f) =>
      f.file.type.startsWith("image/")
    );
    const displayLocation = landState.landLocation || landState.landName;
    const asset: LandAsset = {
      id: `PL-${Date.now().toString().slice(-5)}`,
      purchasePrice: landState.landPurchase,
      sizeRai: landState.sizeRai,
      sizeNgan: landState.sizeNgan,
      location: displayLocation,
      googleMapsUrl:
        mapsUrl || `https://maps.google.com/?q=${encodeURIComponent(displayLocation)}`,
      landStatus: landState.landStatus,
      improvementStatus: landState.improvementStatus,
      hasStructures: landState.hasStructures,
      titleDeedNumber: landState.deedNumber ? String(landState.deedNumber) : "",
      titleDeedBook: landState.deedBook ? String(landState.deedBook) : "",
      titleDeedPage: landState.deedPage ? String(landState.deedPage) : "",
      owner: landState.landOwner,
      description: landState.landDescription || landState.landDetail,
      imageUrl: imageAttachment
        ? URL.createObjectURL(imageAttachment.file)
        : DEFAULT_LAND_IMAGE,
      latitude: landState.landLatitude,
      longitude: landState.landLongitude,
    };
    await apiPost(API_KEYS.landAssets, asset);
    router.push("/land");
  };

  const saveLiquidityAsset = async () => {
    const asset: Omit<LiquidityAsset, "id"> = {
      holder: liquidityState.holder || "Global Assets Co., Ltd.",
      securityType: getLiquidityTypeLabel(liquidityState.liquidityType, locale),
      format: liquidityState.format,
      issuingInstitution: liquidityState.issuer,
      costPrice: liquidityTotalCost,
      currentPrice: liquidityCurrentPrice,
      moneyMarketValue: liquidityCurrentPrice,
      debtorsValue: liquidityState.debtors,
      creditorsValue: liquidityState.creditors,
      assetsValue:
        liquidityCurrentPrice + liquidityState.debtors - liquidityState.creditors,
      remarks:
        liquidityState.remarks ||
        liquidityState.symbol ||
        liquidityState.accountNumber,
    };
    await apiPost(API_KEYS.liquidityAssets, asset);
    router.push("/liquidity");
  };

  const handleSave = () =>
    category === "land" ? saveLandAsset() : saveLiquidityAsset();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{a.title}</h1>
        <p className="mt-1 text-sm text-gray-500">
          {category === "land" ? a.landSubtitle : a.liquiditySubtitle}
        </p>
      </div>

      <AssetCategoryPicker category={category} onChange={setCategory} a={a} />

      {category === "land" ? (
        <LandAssetForm
          state={landState}
          locale={locale}
          a={a}
          onLocationChange={handleLandLocationChange}
          onFieldChange={updateLandField}
        />
      ) : (
        <LiquidityAssetForm
          state={liquidityState}
          locale={locale}
          a={a}
          onFieldChange={updateLiquidityField}
        />
      )}

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
