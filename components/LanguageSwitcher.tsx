"use client";

import { LOCALES } from "@/lib/i18n/types";
import { useLocale } from "@/components/providers/LocaleProvider";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <div
      className="flex items-center rounded-full border border-gray-200 bg-gray-50 p-0.5"
      role="group"
      aria-label="Language switcher"
    >
      {LOCALES.map((item) => {
        const active = locale === item.value;
        return (
          <button
            key={item.value}
            type="button"
            onClick={() => setLocale(item.value)}
            className={`flex items-center gap-1.5 rounded-full px-2 py-1.5 text-xs font-medium transition-colors sm:gap-1.5 sm:px-3 ${
              active
                ? "bg-[var(--primary-green)] text-white shadow-sm"
                : "text-gray-600 hover:bg-white hover:text-gray-900"
            }`}
            aria-pressed={active}
          >
            <span aria-hidden>{item.flag}</span>
            <span className="hidden sm:inline">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
