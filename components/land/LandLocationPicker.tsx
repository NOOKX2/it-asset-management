"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

export type LandLocationValue = {
  latitude: number;
  longitude: number;
  province: string;
  district: string;
  displayName: string;
  googleMapsUrl: string;
};

interface LandLocationPickerProps {
  latitude: number;
  longitude: number;
  onLocationChange: (value: LandLocationValue) => void;
  searchPlaceholder: string;
  locale: "th" | "en";
}

type SearchResult = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
};

const NOMINATIM_HEADERS = { "User-Agent": "ITAM-Pro/1.0 (land-asset-form)" };

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

async function reverseGeocode(
  lat: number,
  lng: number,
  locale: "th" | "en"
): Promise<Omit<LandLocationValue, "googleMapsUrl"> & { googleMapsUrl: string }> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1&accept-language=${locale === "th" ? "th" : "en"}`,
      { headers: NOMINATIM_HEADERS }
    );
    if (!res.ok) throw new Error("reverse geocode failed");
    const data = await res.json();
    const addr = data.address ?? {};
    const province =
      addr.state || addr.province || addr.city || addr.region || "";
    const district =
      addr.county ||
      addr.district ||
      addr.municipality ||
      addr.suburb ||
      addr.town ||
      "";
    const displayName = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    return {
      latitude: lat,
      longitude: lng,
      province,
      district,
      displayName,
      googleMapsUrl: `https://www.google.com/maps?q=${lat},${lng}`,
    };
  } catch {
    return {
      latitude: lat,
      longitude: lng,
      province: "",
      district: "",
      displayName: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
      googleMapsUrl: `https://www.google.com/maps?q=${lat},${lng}`,
    };
  }
}

async function searchPlaces(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return [];
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&countrycodes=th&format=json&limit=6`,
    { headers: NOMINATIM_HEADERS }
  );
  if (!res.ok) return [];
  return res.json();
}

function MapClickHandler({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function DraggableMarker({
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

function ZoomControls() {
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

function MapViewSync({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [map, center, zoom]);
  return null;
}

export function LandLocationPicker({
  latitude,
  longitude,
  onLocationChange,
  searchPlaceholder,
  locale,
}: LandLocationPickerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didInitRef = useRef(false);

  const position: [number, number] = [latitude, longitude];
  const mapCenter: [number, number] = [latitude, longitude];
  const mapZoom = 14;

  const applyCoordinates = useCallback(
    async (lat: number, lng: number) => {
      setLoading(true);
      const result = await reverseGeocode(lat, lng, locale);
      onLocationChange(result);
      setLoading(false);
    },
    [locale, onLocationChange]
  );

  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;
    applyCoordinates(latitude, longitude);
  }, [applyCoordinates, latitude, longitude]);

  const handleSearchInput = (value: string) => {
    setSearchQuery(value);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    if (!value.trim()) {
      setSearchResults([]);
      setSearchOpen(false);
      return;
    }
    searchTimeoutRef.current = setTimeout(async () => {
      const results = await searchPlaces(value);
      setSearchResults(results);
      setSearchOpen(results.length > 0);
    }, 350);
  };

  const selectSearchResult = async (result: SearchResult) => {
    const lat = Number(result.lat);
    const lng = Number(result.lon);
    setSearchQuery(result.display_name.split(",").slice(0, 2).join(","));
    setSearchOpen(false);
    setSearchResults([]);
    await applyCoordinates(lat, lng);
  };

  return (
    <div className="space-y-3">
      <div className="relative max-w-md">
        <svg
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearchInput(e.target.value)}
          onFocus={() => searchResults.length > 0 && setSearchOpen(true)}
          placeholder={searchPlaceholder}
          className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[var(--primary-green)] focus:ring-1 focus:ring-[var(--primary-green)]"
        />
        {searchOpen && searchResults.length > 0 && (
          <ul className="absolute left-0 right-0 top-full z-10 mt-1 max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
            {searchResults.map((r) => (
              <li key={r.place_id}>
                <button
                  type="button"
                  onClick={() => selectSearchResult(r)}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  {r.display_name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

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
        <MapClickHandler onPick={applyCoordinates} />
        <DraggableMarker position={position} onDragEnd={applyCoordinates} />
        <ZoomControls />
      </MapContainer>
      </div>
    </div>
  );
}
