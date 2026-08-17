import { useLocale } from "@/components/providers/LocaleProvider";
import { CardShell, formatCompactM } from "./overview-ui";
import type { OverviewMetrics } from "./use-overview-metrics";

type Accent = {
  wrap: string;
  icon: string;
  value: string;
};

const ACCENTS = {
  navy: {
    wrap: "bg-[#1e2d4d]/10 text-[#1e2d4d]",
    icon: "text-[#1e2d4d]",
    value: "text-[#1e2d4d]",
  },
  orange: {
    wrap: "bg-[var(--light-green-bg)] text-[var(--primary-green)]",
    icon: "text-[var(--primary-green)]",
    value: "text-[var(--primary-green)]",
  },
  cream: {
    wrap: "bg-orange-50 text-orange-700",
    icon: "text-orange-700",
    value: "text-[#c44500]",
  },
} satisfies Record<string, Accent>;

export function OverviewKpiBar({ metrics }: { metrics: OverviewMetrics }) {
  const { t } = useLocale();

  const cards = [
    {
      key: "total",
      label: t.overview.kpiTotalAssets,
      value: metrics.netBookValue,
      accent: ACCENTS.navy,
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      ),
    },
    {
      key: "liquid",
      label: t.overview.kpiLiquidAssets,
      value: metrics.liquidityTotal,
      accent: ACCENTS.orange,
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
        />
      ),
    },
    {
      key: "land",
      label: t.overview.kpiLandAssets,
      value: metrics.landValue,
      accent: ACCENTS.cream,
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {cards.map((card) => (
        <CardShell key={card.key} className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-500">{card.label}</p>
            <p className={`mt-1 text-xl font-bold tracking-tight sm:text-2xl ${card.accent.value}`}>
              {formatCompactM(card.value)}
            </p>
          </div>
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${card.accent.wrap}`}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {card.icon}
            </svg>
          </div>
        </CardShell>
      ))}
    </div>
  );
}
