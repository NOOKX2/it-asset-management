"use client";

import { useLocale } from "@/components/providers/LocaleProvider";

const VENDORS = [
  {
    id: "V-001",
    name: "Dell Technologies Thailand",
    category: "IT Hardware",
    contact: "sales@dell.co.th",
    phone: "02-123-4567",
    assets: 45,
    status: "active" as const,
  },
  {
    id: "V-002",
    name: "Gold Traders Association",
    category: "Precious Metals",
    contact: "info@goldtraders.or.th",
    phone: "02-234-5678",
    assets: 12,
    status: "active" as const,
  },
  {
    id: "V-003",
    name: "Bangkok Land Survey Co.",
    category: "Property Services",
    contact: "survey@bangkokland.co.th",
    phone: "02-345-6789",
    assets: 8,
    status: "active" as const,
  },
  {
    id: "V-004",
    name: "SET Brokerage Partners",
    category: "Securities",
    contact: "broker@setpartners.co.th",
    phone: "02-456-7890",
    assets: 22,
    status: "active" as const,
  },
  {
    id: "V-005",
    name: "Cisco Systems Thailand",
    category: "Networking",
    contact: "support@cisco.co.th",
    phone: "02-567-8901",
    assets: 18,
    status: "inactive" as const,
  },
];

export function VendorsContent() {
  const { t } = useLocale();

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.vendors.title}</h1>
          <p className="mt-1 text-sm text-gray-500">{t.vendors.subtitle}</p>
        </div>
        <button
          type="button"
          className="rounded-xl bg-[var(--primary-green)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--primary-green-dark)]"
        >
          + {t.vendors.addVendor}
        </button>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[var(--card-border)] bg-white p-5 shadow-sm">
          <p className="text-2xl font-bold text-gray-900">{VENDORS.length}</p>
          <p className="text-sm text-gray-500">{t.vendors.totalVendors}</p>
        </div>
        <div className="rounded-2xl border border-[var(--card-border)] bg-white p-5 shadow-sm">
          <p className="text-2xl font-bold text-green-600">
            {VENDORS.filter((v) => v.status === "active").length}
          </p>
          <p className="text-sm text-gray-500">{t.vendors.active}</p>
        </div>
        <div className="rounded-2xl border border-[var(--card-border)] bg-white p-5 shadow-sm">
          <p className="text-2xl font-bold text-gray-900">
            {VENDORS.reduce((s, v) => s + v.assets, 0)}
          </p>
          <p className="text-sm text-gray-500">{t.vendors.linkedAssets}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {VENDORS.map((vendor) => (
          <div
            key={vendor.id}
            className="rounded-2xl border border-[var(--card-border)] bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="mb-3 flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--light-green-bg)] text-sm font-bold text-[var(--primary-green-dark)]">
                {vendor.name.charAt(0)}
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  vendor.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {vendor.status === "active" ? t.vendors.active : t.vendors.inactive}
              </span>
            </div>
            <h3 className="font-semibold text-gray-900">{vendor.name}</h3>
            <p className="text-xs text-[var(--primary-green)]">{vendor.category}</p>
            <div className="mt-3 space-y-1 text-sm text-gray-500">
              <p>{vendor.contact}</p>
              <p>{vendor.phone}</p>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
              <span className="text-xs text-gray-400">
                {vendor.assets} {t.vendors.assetsLinked}
              </span>
              <button
                type="button"
                className="text-xs font-medium text-[var(--primary-green)] hover:underline"
              >
                {t.common.viewDetails}
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
