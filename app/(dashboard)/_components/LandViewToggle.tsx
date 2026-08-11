"use client";

import { useLocale } from "@/components/providers/LocaleProvider";
import type { LandViewMode } from "@/lib/land-view";

interface LandViewToggleProps {
  mode: LandViewMode;
  onChange: (mode: LandViewMode) => void;
  className?: string;
}

export function LandViewToggle({ mode, onChange, className = "" }: LandViewToggleProps) {
  const { t } = useLocale();

  return (
    <div
      className={`inline-flex rounded-xl border border-gray-200 bg-white p-1 shadow-sm ${className}`}
    >
      <button
        type="button"
        onClick={() => onChange("map")}
        className={`flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium transition-colors sm:px-4 ${
          mode === "map"
            ? "bg-[var(--light-green-bg)] text-[var(--primary-green-dark)]"
            : "text-gray-600 hover:bg-gray-50"
        }`}
      >
        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
          />
        </svg>
        <span className="hidden sm:inline">{t.land.viewMap}</span>
      </button>
      <button
        type="button"
        onClick={() => onChange("table")}
        className={`flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium transition-colors sm:px-4 ${
          mode === "table"
            ? "bg-[var(--light-green-bg)] text-[var(--primary-green-dark)]"
            : "text-gray-600 hover:bg-gray-50"
        }`}
      >
        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 6h16M4 10h16M4 14h16M4 18h16"
          />
        </svg>
        <span className="hidden sm:inline">{t.land.viewTable}</span>
      </button>
    </div>
  );
}
