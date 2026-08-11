"use client";

import "leaflet/dist/leaflet.css";
import {
  forwardRef,
  useEffect,
  useMemo,
  useState,
} from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import type { LandAsset } from "@/lib/land-types";
import {
  type ProvinceFeatureCollection,
  filterAssetsByProvince,
  findProvinceCode,
} from "@/lib/thailand-provinces";
import {
  THAILAND_BOUNDS,
  THAILAND_CENTER,
  THAILAND_DEFAULT_ZOOM,
} from "@/lib/thailand-map";
import {
  createAssetDotIcon,
  createAssetMarkerIcon,
} from "./thailand-heatmap-icons";
import {
  IntensityHeatLayer,
  MapController,
  ProvinceBoundariesLayer,
} from "./thailand-heatmap-layers";

export type ThailandHeatmapHandle = {
  zoomIn: () => void;
  zoomOut: () => void;
  recenter: () => void;
};

interface ThailandHeatmapProps {
  assets: LandAsset[];
  selectedId: string | null;
  focusedProvinceCode: string | null;
  onProvinceFocus: (code: string, nameTh: string, nameEn: string) => void;
  onSelectAsset: (id: string) => void;
}

export const ThailandHeatmap = forwardRef<ThailandHeatmapHandle, ThailandHeatmapProps>(
  function ThailandHeatmap(
    {
      assets,
      selectedId,
      focusedProvinceCode,
      onProvinceFocus,
      onSelectAsset,
    },
    ref
  ) {
    const [geo, setGeo] = useState<ProvinceFeatureCollection | null>(null);

    useEffect(() => {
      fetch("/geo/thailand-provinces.geojson")
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load geojson");
          return res.json();
        })
        .then((data: ProvinceFeatureCollection) => setGeo(data))
        .catch(() => setGeo(null));
    }, []);

    const isProvinceView = Boolean(focusedProvinceCode);

    const displayAssets = useMemo(() => {
      if (!focusedProvinceCode || !geo) return assets;
      return filterAssetsByProvince(assets, geo, focusedProvinceCode);
    }, [assets, focusedProvinceCode, geo]);

    const maxPrice = useMemo(
      () => Math.max(...assets.map((a) => a.purchasePrice), 1),
      [assets]
    );

    const focusProvinceForAsset = (asset: LandAsset) => {
      if (!geo) return;
      const code = findProvinceCode(geo, asset.latitude, asset.longitude);
      if (!code) return;
      const feature = geo.features.find((f) => f.properties?.pro_code === code);
      const nameTh = feature?.properties?.pro_th ?? code;
      const nameEn = feature?.properties?.pro_en ?? code;
      onProvinceFocus(code, nameTh, nameEn);
    };

    return (
      <MapContainer
        center={THAILAND_CENTER}
        zoom={THAILAND_DEFAULT_ZOOM}
        minZoom={5}
        maxBounds={THAILAND_BOUNDS}
        maxBoundsViscosity={0.85}
        className="h-full w-full z-0"
        zoomControl={false}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap &copy; CARTO"
          url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
        />
        <MapController
          mapRef={ref}
          focusedProvinceCode={focusedProvinceCode}
        />
        {geo && (
          <ProvinceBoundariesLayer
            geo={geo}
            focusedProvinceCode={focusedProvinceCode}
            onProvinceFocus={onProvinceFocus}
          />
        )}
        {assets.length > 0 && <IntensityHeatLayer assets={assets} />}
        {assets.map((asset) => {
          const intensity = asset.purchasePrice / maxPrice;
          const inFocusedProvince =
            !focusedProvinceCode ||
            displayAssets.some((a) => a.id === asset.id);

          if (isProvinceView && inFocusedProvince) {
            return (
              <Marker
                key={asset.id}
                position={[asset.latitude, asset.longitude]}
                icon={createAssetMarkerIcon(
                  asset.id,
                  asset.purchasePrice,
                  asset.id === selectedId
                )}
                zIndexOffset={asset.id === selectedId ? 1000 : 500}
                eventHandlers={{
                  click: () => onSelectAsset(asset.id),
                }}
              />
            );
          }

          return (
            <Marker
              key={asset.id}
              position={[asset.latitude, asset.longitude]}
              icon={createAssetDotIcon(intensity)}
              zIndexOffset={500}
              eventHandlers={{
                click: () => focusProvinceForAsset(asset),
              }}
            />
          );
        })}
      </MapContainer>
    );
  }
);
