"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { addVendor, getAddedVendors } from "@/lib/asset-storage";
import {
  BUSINESS_TYPES,
  MOCK_VENDORS,
  type Vendor,
} from "@/lib/vendor-types";

function SectionCard({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[var(--card-border)] bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--light-green-bg)] text-[var(--primary-green)]">
          {icon}
        </span>
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function FieldLabel({
  children,
  required,
}: {
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label className="mb-1.5 block text-sm font-medium text-gray-700">
      {children}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>
  );
}

const inputCls =
  "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-[var(--primary-green)] focus:ring-1 focus:ring-[var(--primary-green)]";

export function AddVendorContent() {
  const router = useRouter();
  const { t } = useLocale();
  const v = t.addVendor;

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [taxId, setTaxId] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");

  const handleSave = () => {
    if (!name.trim()) return;

    const allIds = [...MOCK_VENDORS, ...getAddedVendors()].map((x) => x.id);
    const num = allIds.length + 1;
    const id = `V-${String(num).padStart(3, "0")}`;

    const vendor: Vendor = {
      id,
      name: name.trim(),
      category: category || "Other",
      taxId,
      contactPerson,
      email,
      phone,
      website,
      address,
      province,
      district,
      assets: 0,
      status: "active",
    };

    addVendor(vendor);
    router.push("/vendors");
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{v.title}</h1>
        <p className="mt-1 text-sm text-gray-500">{v.subtitle}</p>
      </div>

      <SectionCard
        title={v.sectionBasic}
        icon={
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        }
      >
        <div className="space-y-4">
          <div>
            <FieldLabel required>{v.vendorName}</FieldLabel>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={v.vendorNamePlaceholder}
              className={inputCls}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel>{v.businessType}</FieldLabel>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={inputCls}
              >
                <option value="">{v.businessTypePlaceholder}</option>
                {BUSINESS_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <FieldLabel>{v.taxId}</FieldLabel>
              <input
                type="text"
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
                placeholder={v.taxIdPlaceholder}
                maxLength={13}
                className={inputCls}
              />
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title={v.sectionContact}
        icon={
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel>{v.contactPerson}</FieldLabel>
            <input
              type="text"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              placeholder={v.contactPersonPlaceholder}
              className={inputCls}
            />
          </div>
          <div>
            <FieldLabel>{v.email}</FieldLabel>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={v.emailPlaceholder}
              className={inputCls}
            />
          </div>
          <div>
            <FieldLabel>{v.phone}</FieldLabel>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={v.phonePlaceholder}
              className={inputCls}
            />
          </div>
          <div>
            <FieldLabel>{v.website}</FieldLabel>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder={v.websitePlaceholder}
              className={inputCls}
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title={v.sectionAddress}
        icon={
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        }
      >
        <div className="space-y-4">
          <div>
            <FieldLabel>{v.address}</FieldLabel>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              placeholder={v.addressPlaceholder}
              className={inputCls}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel>{v.province}</FieldLabel>
              <input
                type="text"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                placeholder={v.provincePlaceholder}
                className={inputCls}
              />
            </div>
            <div>
              <FieldLabel>{v.district}</FieldLabel>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder={v.districtPlaceholder}
                className={inputCls}
              />
            </div>
          </div>
        </div>
      </SectionCard>

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
          disabled={!name.trim()}
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
