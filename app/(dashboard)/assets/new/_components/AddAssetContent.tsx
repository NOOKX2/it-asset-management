"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { LandLocationValue } from "../../../land/_components/LandLocationPicker";
import { API_KEYS, apiPost } from "@/lib/api/client";
import { useGoldPrice } from "@/lib/hooks/use-gold-price";
import { useStockQuotes } from "@/lib/hooks/use-stock-quotes";
import type { LandAsset } from "@/lib/land-types";
import { LandAssetForm, type LandAssetFormState } from "./LandAssetForm";
import { LiquidityAssetForm, type LiquidityAssetFormState } from "./LiquidityAssetForm";
import { computeLiquidityValues, toLiquidityPayload } from "./liquidity-form-model";
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
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const { buyPerBaht } = useGoldPrice();
  const { quotes } = useStockQuotes(
    liquidityState.liquidityType === "stock" && liquidityState.symbol
      ? [liquidityState.symbol]
      : []
  );
  const marketPrice = quotes[liquidityState.symbol.trim().toUpperCase()] ?? null;

  const { cost: liquidityTotalCost, current: liquidityCurrentPrice } = useMemo(
    () =>
      computeLiquidityValues(liquidityState, {
        marketPrice,
        goldBuyPerBaht: buyPerBaht,
      }),
    [liquidityState, marketPrice, buyPerBaht]
  );

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
    await apiPost(
      API_KEYS.liquidityAssets,
      toLiquidityPayload(liquidityState, locale, liquidityTotalCost, liquidityCurrentPrice)
    );
    router.push("/liquidity");
  };

  const handleSave = async () => {
    setSaveError(null);
    setSaving(true);
    try {
      if (category === "land") {
        await saveLandAsset();
      } else {
        await saveLiquidityAsset();
      }
    } catch {
      setSaveError(
        locale === "th"
          ? "บันทึกไม่สำเร็จ กรุณาลองอีกครั้ง"
          : "Could not save. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

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

      <div className="flex items-center justify-end gap-3 pt-2">
        {saveError ? <p className="mr-auto text-sm text-red-600">{saveError}</p> : null}
        <Link
          href="/"
          className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          {t.common.cancel}
        </Link>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-[var(--primary-green)] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--primary-green-dark)] disabled:opacity-50"
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
