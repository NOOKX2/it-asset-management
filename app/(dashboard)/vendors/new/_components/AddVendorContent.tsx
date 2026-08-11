"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useVendors } from "@/lib/hooks/use-vendors";
import type { Vendor } from "@/lib/vendor-types";
import {
  VendorAddressSection,
  VendorBasicSection,
  VendorContactSection,
  type VendorFormState,
} from "./vendor-form-sections";

const INITIAL_STATE: VendorFormState = {
  name: "",
  category: "",
  taxId: "",
  contactPerson: "",
  email: "",
  phone: "",
  website: "",
  address: "",
  province: "",
  district: "",
};

export function AddVendorContent() {
  const router = useRouter();
  const { t } = useLocale();
  const v = t.addVendor;
  const { vendors, createVendor } = useVendors();

  const [state, setState] = useState<VendorFormState>(INITIAL_STATE);

  const onFieldChange = useCallback(
    <K extends keyof VendorFormState>(key: K, value: VendorFormState[K]) => {
      setState((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleSave = async () => {
    if (!state.name.trim()) return;

    const vendor: Vendor = {
      ...state,
      id: `V-${String(vendors.length + 1).padStart(3, "0")}`,
      name: state.name.trim(),
      category: state.category || "Other",
      assets: 0,
      status: "active",
    };

    await createVendor(vendor);
    router.push("/vendors");
  };

  const sectionProps = { state, v, onFieldChange };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{v.title}</h1>
        <p className="mt-1 text-sm text-gray-500">{v.subtitle}</p>
      </div>

      <VendorBasicSection {...sectionProps} />
      <VendorContactSection {...sectionProps} />
      <VendorAddressSection {...sectionProps} />

      <div className="flex justify-end gap-3 pt-2">
        <Link
          href="/vendors"
          className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          {t.common.cancel}
        </Link>
        <button
          type="button"
          onClick={handleSave}
          disabled={!state.name.trim()}
          className="flex items-center gap-2 rounded-xl bg-[var(--primary-green)] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--primary-green-dark)] disabled:opacity-50"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          {v.save}
        </button>
      </div>
    </div>
  );
}
