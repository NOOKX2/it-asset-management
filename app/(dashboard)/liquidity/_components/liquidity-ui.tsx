import type { ReactNode } from "react";

export function gainLoss(cost: number, current: number) {
  const diff = current - cost;
  const pct = cost > 0 ? ((diff / cost) * 100).toFixed(1) : "0";
  return { pct, positive: diff >= 0 };
}

export function ThCell({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <th className="px-3 py-3 align-bottom">
      <div className="flex flex-col items-center gap-1.5 text-center">
        <span className="text-gray-400">{icon}</span>
        <span className="text-[11px] font-medium leading-tight text-gray-600">
          {label}
        </span>
      </div>
    </th>
  );
}

export function AssetTypeBadge({ securityType }: { securityType: string }) {
  const lower = securityType.toLowerCase();
  const isGold = lower.includes("gold") || lower.includes("ทอง");
  const isStock = lower.includes("stock") || lower.includes("หุ้น");
  const isBond = lower.includes("bond") || lower.includes("พันธบัตร");

  let icon: ReactNode;
  let bg = "bg-gray-100 text-gray-600";

  if (isGold) {
    bg = "bg-amber-50 text-amber-600";
    icon = (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        />
      </svg>
    );
  } else if (isStock) {
    bg = "bg-green-50 text-[var(--primary-green)]";
    icon = (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    );
  } else if (isBond) {
    bg = "bg-blue-50 text-blue-600";
    icon = (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    );
  } else {
    icon = (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"
        />
      </svg>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${bg}`}>
        {icon}
      </span>
      <span className="text-sm text-gray-800">{securityType}</span>
    </div>
  );
}
