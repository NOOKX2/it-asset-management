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
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.vendors.title}</h1>
          <p className="mt-1 text-sm text-gray-500">{t.vendors.subtitle}</p>
        </div>
        {canEdit && (
        <Link
          href="/vendors/new"
          className="rounded-xl bg-[var(--primary-green)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--primary-green-dark)]"
        >
          + {t.vendors.addVendor}
        </Link>
        )}
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
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      vendor.status === "active"
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
