"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getAddedVendors } from "@/lib/asset-storage";
import { MOCK_VENDORS } from "@/lib/vendor-types";

export function VendorsContent() {
  const { t } = useLocale();

  const vendors = useMemo(
    () => [...MOCK_VENDORS, ...getAddedVendors()],
    []
  );

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.vendors.title}</h1>
          <p className="mt-1 text-sm text-gray-500">{t.vendors.subtitle}</p>
        </div>
        <Link
          href="/vendors/new"
          className="rounded-xl bg-[var(--primary-green)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--primary-green-dark)]"
        >
          + {t.vendors.addVendor}
        </Link>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[var(--card-border)] bg-white p-5 shadow-sm">
          <p className="text-2xl font-bold text-gray-900">{vendors.length}</p>
          <p className="text-sm text-gray-500">{t.vendors.totalVendors}</p>
        </div>
        <div className="rounded-2xl border border-[var(--card-border)] bg-white p-5 shadow-sm">
          <p className="text-2xl font-bold text-green-600">
            {vendors.filter((v) => v.status === "active").length}
          </p>
          <p className="text-sm text-gray-500">{t.vendors.active}</p>
        </div>
        <div className="rounded-2xl border border-[var(--card-border)] bg-white p-5 shadow-sm">
          <p className="text-2xl font-bold text-gray-900">
            {vendors.reduce((s, v) => s + v.assets, 0)}
          </p>
          <p className="text-sm text-gray-500">{t.vendors.linkedAssets}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {vendors.map((vendor) => (
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
              <p>{vendor.email || vendor.contactPerson}</p>
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
