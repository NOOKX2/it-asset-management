"use client";

import Link from "next/link";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useCanEdit } from "@/lib/hooks/use-can-edit";
import { useVendors } from "@/lib/hooks/use-vendors";

export function VendorsContent() {
  const { t } = useLocale();
  const canEdit = useCanEdit();
  const { vendors, isLoading } = useVendors();

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-gray-500">
        Loading vendors…
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">{t.vendors.title}</h1>
          <p className="mt-1 text-sm text-gray-500">{t.vendors.subtitle}</p>
        </div>
        {canEdit && (
          <Link
            href="/vendors/new"
            className="inline-flex w-fit shrink-0 items-center self-end rounded-xl bg-[var(--primary-green)] px-3 py-2 text-xs font-medium text-white hover:bg-[var(--primary-green-dark)] sm:px-5 sm:py-2.5 sm:text-sm lg:self-auto"
          >
            + {t.vendors.addVendor}
          </Link>
        )}
      </div>

      <div className="mb-6 grid grid-cols-3 gap-2 sm:gap-4">
        <div className="min-w-0 rounded-2xl border border-[var(--card-border)] bg-white p-3 shadow-sm sm:p-5">
          <p className="text-xs leading-snug text-gray-500 sm:text-sm">
            {t.vendors.totalVendors}
          </p>
          <p className="mt-1 text-lg font-bold tabular-nums text-gray-900 sm:mt-2 sm:text-2xl">
            {vendors.length}
          </p>
        </div>
        <div className="min-w-0 rounded-2xl border border-[var(--card-border)] bg-white p-3 shadow-sm sm:p-5">
          <p className="text-xs leading-snug text-gray-500 sm:text-sm">{t.vendors.active}</p>
          <p className="mt-1 text-lg font-bold tabular-nums text-[var(--primary-green)] sm:mt-2 sm:text-2xl">
            {vendors.filter((v) => v.status === "active").length}
          </p>
        </div>
        <div className="min-w-0 rounded-2xl border border-[var(--card-border)] bg-white p-3 shadow-sm sm:p-5">
          <p className="text-xs leading-snug text-gray-500 sm:text-sm">
            {t.vendors.linkedAssets}
          </p>
          <p className="mt-1 text-lg font-bold tabular-nums text-gray-900 sm:mt-2 sm:text-2xl">
            {vendors.reduce((s, v) => s + v.assets, 0)}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--card-border)] bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--card-border)] bg-gray-50 text-left text-xs font-medium text-gray-500">
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {vendors.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm text-gray-500">
                  {t.vendors.empty}
                </td>
              </tr>
            ) : (
              vendors.map((vendor) => (
                <tr
                  key={vendor.id}
                  className="border-t border-[var(--card-border)] hover:bg-gray-50"
                >
                  <td className="px-4 py-3 font-medium text-[var(--primary-green)]">
                    {vendor.id}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">{vendor.name}</td>
                  <td className="px-4 py-3 text-gray-600">{vendor.category}</td>
                  <td className="px-4 py-3 text-gray-600">{vendor.email}</td>
                  <td className="px-4 py-3 text-gray-600">{vendor.phone}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${vendor.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                        }`}
                    >
                      {vendor.status === "active" ? t.vendors.active : t.vendors.inactive}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
