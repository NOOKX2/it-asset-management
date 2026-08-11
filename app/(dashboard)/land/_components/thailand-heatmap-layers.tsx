"use client";

import L from "leaflet";
import "leaflet.heat";
import { useEffect, useImperativeHandle, useMemo, useRef } from "react";
import { useMap } from "react-leaflet";
import type { LandAsset } from "@/lib/land-types";
import type { ProvinceFeatureCollection } from "@/lib/thailand-provinces";
import { THAILAND_BOUNDS } from "@/lib/thailand-map";
import type { ThailandHeatmapHandle } from "./ThailandHeatmap";

/** Point heat at exact asset coordinates — not province-wide fill */
export function IntensityHeatLayer({ assets }: { assets: LandAsset[] }) {
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
export function ProvinceBoundariesLayer({
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

export function MapController({
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
