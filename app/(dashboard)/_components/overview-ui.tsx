export function formatCompactM(amount: number) {
  if (!Number.isFinite(amount)) return "฿0";
  if (amount >= 1_000_000_000) return `฿${(amount / 1_000_000_000).toFixed(1)}B`;
  if (amount >= 1_000_000) return `฿${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `฿${(amount / 1_000).toFixed(1)}K`;
  return `฿${amount}`;
}

export function CardShell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-lg border border-[var(--card-border)] bg-white p-4 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionHeader({
  icon,
  title,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-2.5 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--light-green-bg)] text-[var(--primary-green)]">
          {icon}
        </div>
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      </div>
      {action}
    </div>
  );
}
