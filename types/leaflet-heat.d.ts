import type * as L from "leaflet";

declare module "leaflet" {
  interface HeatLayer extends L.Layer {
    setLatLngs(latlngs: [number, number, number][]): HeatLayer;
  }

  interface HeatMapOptions {
    minOpacity?: number;
    maxZoom?: number;
    max?: number;
    radius?: number;
    blur?: number;
    gradient?: Record<number, string>;
  }

  function heatLayer(
    latlngs: [number, number, number][],
    options?: HeatMapOptions
  ): HeatLayer;
}

declare module "leaflet.heat" {}
