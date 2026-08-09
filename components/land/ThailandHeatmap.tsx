"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
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

function formatMarkerValue(amount: number) {
  if (amount >= 1_000_000) return `฿${(amount / 1_000_000).toFixed(1)}M`;
  return `฿${(amount / 1_000).toFixed(0)}K`;
}

function createAssetDotIcon(intensity: number) {
  const size = 10 + intensity * 8;
  return L.divIcon({
    className: "",
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:#4b6f1c;border:2px solid #fff;box-shadow:0 2px 6px rgba(75,111,28,0.45);cursor:pointer;"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function createAssetMarkerIcon(id: string, value: number, isSelected: boolean) {
  const bg = isSelected ? "#4b6f1c" : "#ffffff";

  return L.divIcon({
    className: "",
    html: `<div style="display:flex;flex-direction:column;align-items:center;transform:translate(-50%,-100%);cursor:pointer;">
      <div style="background:white;padding:2px 8px;border-radius:8px;font-size:10px;font-weight:700;color:#3d5a16;box-shadow:0 2px 6px rgba(0,0,0,.12);margin-bottom:2px;">${id} · ${formatMarkerValue(value)}</div>
      <div style="width:14px;height:14px;border-radius:50%;background:${bg};border:2px solid #4b6f1c;box-shadow:0 2px 6px rgba(0,0,0,.2);${isSelected ? "box-shadow:0 0 0 4px rgba(75,111,28,0.35);" : ""}"></div>
      <div style="width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:6px solid #4b6f1c;"></div>
    </div>`,
    iconSize: [80, 44],
    iconAnchor: [40, 44],
  });
}

/** Point heat at exact asset coordinates — not province-wide fill */
function IntensityHeatLayer({ assets }: { assets: LandAsset[] }) {
  const map = useMap();
  const layerRef = useRef<L.HeatLayer | null>(null);

  const heatPoints = useMemo(() => {
    const maxPrice = Math.max(...assets.map((a) => a.purchasePrice), 1);
    return assets.map(
      (a) =>
        [
          a.latitude,
          a.longitude,
          Math.max(0.5, a.purchasePrice / maxPrice),
        ] as [number, number, number]
    );
  }, [assets]);

  useEffect(() => {
    const heat = L.heatLayer(heatPoints, {
      radius: 22,
      blur: 14,
      maxZoom: 18,
      max: 1,
      minOpacity: 0.55,
      gradient: {
        0.2: "#c8e6a0",
        0.45: "#8fbc5a",
        0.7: "#4b6f1c",
        1: "#1e3d12",
      },
    });
    heat.addTo(map);
    const canvas = (heat as L.HeatLayer & { _canvas?: HTMLCanvasElement })._canvas;
    if (canvas) canvas.style.pointerEvents = "none";
    layerRef.current = heat;

    return () => {
      map.removeLayer(heat);
      layerRef.current = null;
    };
  }, [map, heatPoints]);

  return null;
}

/** Province outlines only — no choropleth fill */
function ProvinceBoundariesLayer({
  geo,
  focusedProvinceCode,
  onProvinceFocus,
}: {
  geo: ProvinceFeatureCollection;
  focusedProvinceCode: string | null;
  onProvinceFocus: (code: string, nameTh: string, nameEn: string) => void;
}) {
  const map = useMap();
  const layerRef = useRef<L.GeoJSON | null>(null);

  useEffect(() => {
    const layer = L.geoJSON(geo, {
      style: (feature) => {
        const code = feature?.properties?.pro_code as string | undefined;
        const isFocused = focusedProvinceCode === code;

        return {
          fillColor: "#eef2ea",
          fillOpacity: isFocused ? 0.12 : 0,
          color: isFocused ? "#2d5016" : "#c5cdd3",
          weight: isFocused ? 2 : 0.6,
          opacity: isFocused ? 1 : 0.7,
        };
      },
      onEachFeature: (feature, featureLayer) => {
        const code = feature.properties?.pro_code as string | undefined;
        const nameTh = feature.properties?.pro_th as string | undefined;
        const nameEn = feature.properties?.pro_en as string | undefined;
        if (!code) return;

        featureLayer.on("click", () => {
          onProvinceFocus(code, nameTh ?? code, nameEn ?? code);
        });
      },
    });

    layer.addTo(map);
    layerRef.current = layer;

    return () => {
      map.removeLayer(layer);
      layerRef.current = null;
    };
  }, [map, geo, focusedProvinceCode, onProvinceFocus]);

  return null;
}

function MapController({
  mapRef,
  focusedProvinceCode,
}: {
  mapRef: React.Ref<ThailandHeatmapHandle>;
  focusedProvinceCode: string | null;
}) {
  const map = useMap();

  useImperativeHandle(mapRef, () => ({
    zoomIn: () => map.zoomIn(),
    zoomOut: () => map.zoomOut(),
    recenter: () =>
      map.fitBounds(THAILAND_BOUNDS, { padding: [24, 24], maxZoom: 7 }),
  }));

  useEffect(() => {
    if (!focusedProvinceCode) {
      map.fitBounds(THAILAND_BOUNDS, { padding: [24, 24], maxZoom: 7 });
    }
  }, [map, focusedProvinceCode]);

  return null;
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
