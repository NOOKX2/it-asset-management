"use client";

import L from "leaflet";
import { useEffect, useMemo, useRef } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

function createPinIcon() {
  return L.divIcon({
    className: "",
    html: `<div style="width:28px;height:28px;transform:translate(-50%,-100%);">
      <svg viewBox="0 0 24 24" width="28" height="28" fill="#2563eb" stroke="#fff" stroke-width="1.5">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
        <circle cx="12" cy="9" r="2.5" fill="#fff" stroke="none"/>
      </svg>
    </div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
  });
}

export function MapClickHandler({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export function DraggableMarker({
  position,
  onDragEnd,
}: {
  position: [number, number];
  onDragEnd: (lat: number, lng: number) => void;
}) {
  const markerRef = useRef<L.Marker>(null);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (!marker) return;
        const { lat, lng } = marker.getLatLng();
        onDragEnd(lat, lng);
      },
    }),
    [onDragEnd]
  );

  return (
    <Marker
      draggable
      position={position}
      icon={createPinIcon()}
      eventHandlers={eventHandlers}
      ref={markerRef}
    />
  );
}

export function ZoomControls() {
  const map = useMap();
  return (
    <div className="absolute bottom-3 right-3 z-[1000] flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
      <button
        type="button"
        onClick={() => map.zoomIn()}
        className="flex h-8 w-8 items-center justify-center text-gray-700 hover:bg-gray-50"
        aria-label="Zoom in"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => map.zoomOut()}
        className="flex h-8 w-8 items-center justify-center border-t border-gray-200 text-gray-700 hover:bg-gray-50"
        aria-label="Zoom out"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      </button>
    </div>
  );
}

export function MapViewSync({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [map, center, zoom]);
  return null;
}

type LandLocationMapProps = {
  latitude: number;
  longitude: number;
  loading: boolean;
  onPick: (lat: number, lng: number) => void;
};

export function LandLocationMap({
  latitude,
  longitude,
  loading,
  onPick,
}: LandLocationMapProps) {
  const position: [number, number] = [latitude, longitude];
  const mapCenter: [number, number] = [latitude, longitude];
  const mapZoom = 14;

  return (
    <div className="relative overflow-hidden rounded-xl border border-gray-200">
      <div
        className="pointer-events-none absolute left-1/2 top-4 z-[1000] -translate-x-1/2 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-md"
      >
        {latitude.toFixed(6)}°, {longitude.toFixed(6)}°
        {loading && " …"}
      </div>

      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        className="h-[420px] w-full z-0"
        zoomControl={false}
      >
        <TileLayer
          attribution="Tiles &copy; Esri"
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />
        <MapViewSync center={mapCenter} zoom={mapZoom} />
        <MapClickHandler onPick={onPick} />
        <DraggableMarker position={position} onDragEnd={onPick} />
        <ZoomControls />
      </MapContainer>
    </div>
  );
}
