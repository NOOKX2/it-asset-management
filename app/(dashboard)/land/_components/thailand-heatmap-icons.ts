import L from "leaflet";

export function formatMarkerValue(amount: number) {
  if (amount >= 1_000_000) return `฿${(amount / 1_000_000).toFixed(1)}M`;
  return `฿${(amount / 1_000).toFixed(0)}K`;
}

export function createAssetDotIcon(intensity: number) {
  const size = 10 + intensity * 8;
  return L.divIcon({
    className: "",
        html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:#ff6b1a;border:2px solid #fff;box-shadow:0 2px 6px rgba(255,107,26,0.45);cursor:pointer;"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export function createAssetMarkerIcon(id: string, value: number, isSelected: boolean) {
  const bg = isSelected ? "#ff6b1a" : "#ffffff";

  return L.divIcon({
    className: "",
    html: `<div style="display:flex;flex-direction:column;align-items:center;transform:translate(-50%,-100%);cursor:pointer;">
      <div style="background:white;padding:2px 8px;border-radius:8px;font-size:10px;font-weight:700;color:#e55a0c;box-shadow:0 2px 6px rgba(0,0,0,.12);margin-bottom:2px;">${id} · ${formatMarkerValue(value)}</div>
      <div style="width:14px;height:14px;border-radius:50%;background:${bg};border:2px solid #ff6b1a;box-shadow:0 2px 6px rgba(0,0,0,.2);${isSelected ? "box-shadow:0 0 0 4px rgba(255,107,26,0.35);" : ""}"></div>
      <div style="width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:6px solid #ff6b1a;"></div>
    </div>`,
    iconSize: [80, 44],
    iconAnchor: [40, 44],
  });
}
