import type { ReactNode } from "react";

const LABEL_CLASS = "text-xs leading-snug text-gray-500 sm:text-sm";
const VALUE_COMPACT_CLASS = "mt-1 text-xl font-bold tabular-nums sm:hidden";
const VALUE_FULL_CLASS =
  "mt-1 hidden text-xl font-bold tabular-nums sm:mt-2 sm:block";
const VALUE_SINGLE_CLASS =
  "mt-1 text-lg font-bold tabular-nums sm:mt-2 sm:text-2xl";

type SummaryKpiCardProps = {
  label: string;
  value: string;
  /** When set, `value` is shown on small screens and this on `sm+`. */
  fullValue?: string;
  valueClassName?: string;
  borderAccentClass?: string;
  icon?: ReactNode;
  className?: string;
};

export function SummaryKpiCard({
  label,
  value,
  fullValue,
  valueClassName = "text-gray-900",
  borderAccentClass,
  icon,
  className = "",
}: SummaryKpiCardProps) {
  const borderAccent = borderAccentClass ? `border-l-4 ${borderAccentClass}` : "";

  const valueContent =
    fullValue != null ? (
      <>
        <p className={`${VALUE_COMPACT_CLASS} ${valueClassName}`}>{value}</p>
        <p className={`${VALUE_FULL_CLASS} ${valueClassName}`}>{fullValue}</p>
      </>
    ) : (
      <p className={`${VALUE_SINGLE_CLASS} ${valueClassName}`}>{value}</p>
    );

  return (
    <div
      className={`min-w-0 rounded-2xl border border-[var(--card-border)] bg-white p-3 shadow-sm sm:p-5 ${borderAccent} ${className}`}
    >
      {icon ? (
        <div className="flex items-start justify-between gap-2 sm:gap-4">
          <div className="min-w-0">
            <p className={LABEL_CLASS}>{label}</p>
            {valueContent}
          </div>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-gray-400 sm:h-10 sm:w-10">
            {icon}
          </div>
        </div>
      ) : (
        <>
          <p className={LABEL_CLASS}>{label}</p>
          {valueContent}
        </>
      )}
    </div>
  );
}

export function SummaryKpiGrid({
  children,
  columns = 3,
  className = "",
}: {
  children: ReactNode;
  columns?: 2 | 3;
  className?: string;
}) {
  const cols = columns === 2 ? "grid-cols-2" : "grid-cols-3";

  return (
    <div className={`mb-6 grid ${cols} items-stretch gap-2 sm:gap-4 ${className}`}>
      {children}
    </div>
  );
}
