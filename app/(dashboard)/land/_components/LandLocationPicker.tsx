"use client";

import "leaflet/dist/leaflet.css";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { LandLocationMap } from "./land-location-map-parts";
import {
  reverseGeocode,
  searchPlaces,
  type LandLocationValue,
  type SearchResult,
} from "./land-location-geocode";

export type { LandLocationValue };

interface LandLocationPickerProps {
  latitude: number;
  longitude: number;
  onLocationChange: (value: LandLocationValue) => void;
  searchPlaceholder: string;
  locale: "th" | "en";
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

      <LandLocationMap
        latitude={latitude}
        longitude={longitude}
        loading={loading}
        onPick={applyCoordinates}
      />
    </div>
  );
}
