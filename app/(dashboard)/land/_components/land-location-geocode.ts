export type LandLocationValue = {
  latitude: number;
  longitude: number;
  province: string;
  district: string;
  displayName: string;
  googleMapsUrl: string;
};

export type SearchResult = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
};

const NOMINATIM_HEADERS = { "User-Agent": "ITAM-Pro/1.0 (land-asset-form)" };

export async function reverseGeocode(
  lat: number,
  lng: number,
  locale: "th" | "en"
): Promise<LandLocationValue> {
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

export async function searchPlaces(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return [];
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&countrycodes=th&format=json&limit=6`,
    { headers: NOMINATIM_HEADERS }
  );
  if (!res.ok) return [];
  return res.json();
}
