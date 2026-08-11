"use client";

import type { Messages } from "@/lib/i18n/types";
import { BUSINESS_TYPES } from "@/lib/vendor-types";
import { FieldLabel, inputCls, SectionCard } from "./add-vendor-form-ui";

export type VendorFormState = {
  name: string;
  category: string;
  taxId: string;
  contactPerson: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  province: string;
  district: string;
};

type SectionProps = {
  state: VendorFormState;
  v: Messages["addVendor"];
  onFieldChange: <K extends keyof VendorFormState>(
    key: K,
    value: VendorFormState[K]
  ) => void;
};

export function VendorBasicSection({ state, v, onFieldChange }: SectionProps) {
  return (
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
            value={state.name}
            onChange={(e) => onFieldChange("name", e.target.value)}
            placeholder={v.vendorNamePlaceholder}
            className={inputCls}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel>{v.businessType}</FieldLabel>
            <select
              value={state.category}
              onChange={(e) => onFieldChange("category", e.target.value)}
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
              value={state.taxId}
              onChange={(e) => onFieldChange("taxId", e.target.value)}
              placeholder={v.taxIdPlaceholder}
              maxLength={13}
              className={inputCls}
            />
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

export function VendorContactSection({ state, v, onFieldChange }: SectionProps) {
  return (
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
            value={state.contactPerson}
            onChange={(e) => onFieldChange("contactPerson", e.target.value)}
            placeholder={v.contactPersonPlaceholder}
            className={inputCls}
          />
        </div>
        <div>
          <FieldLabel>{v.email}</FieldLabel>
          <input
            type="email"
            value={state.email}
            onChange={(e) => onFieldChange("email", e.target.value)}
            placeholder={v.emailPlaceholder}
            className={inputCls}
          />
        </div>
        <div>
          <FieldLabel>{v.phone}</FieldLabel>
          <input
            type="tel"
            value={state.phone}
            onChange={(e) => onFieldChange("phone", e.target.value)}
            placeholder={v.phonePlaceholder}
            className={inputCls}
          />
        </div>
        <div>
          <FieldLabel>{v.website}</FieldLabel>
          <input
            type="url"
            value={state.website}
            onChange={(e) => onFieldChange("website", e.target.value)}
            placeholder={v.websitePlaceholder}
            className={inputCls}
          />
        </div>
      </div>
    </SectionCard>
  );
}

export function VendorAddressSection({ state, v, onFieldChange }: SectionProps) {
  return (
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
            value={state.address}
            onChange={(e) => onFieldChange("address", e.target.value)}
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
              value={state.province}
              onChange={(e) => onFieldChange("province", e.target.value)}
              placeholder={v.provincePlaceholder}
              className={inputCls}
            />
          </div>
          <div>
            <FieldLabel>{v.district}</FieldLabel>
            <input
              type="text"
              value={state.district}
              onChange={(e) => onFieldChange("district", e.target.value)}
              placeholder={v.districtPlaceholder}
              className={inputCls}
            />
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
