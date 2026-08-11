"use client";

import type { ReactNode } from "react";

export {
  FileUploadZone,
  MAX_FILE_SIZE,
  ACCEPTED_FILE_TYPES,
  FILE_ACCEPT,
  type UploadedFile,
} from "./FileUploadZone";

export function SectionCard({
  icon,
  title,
  step,
  children,
}: {
  icon: ReactNode;
  title: string;
  step?: number;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[var(--card-border)] bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--light-green-bg)] text-[var(--primary-green)]">
          {icon}
        </span>
        {step !== undefined && (
          <span className="text-sm font-bold text-[var(--primary-green)]">
            {step}.
          </span>
        )}
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <label className="mb-1.5 block text-sm font-medium text-gray-700">
      {children}
    </label>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-[var(--primary-green)] focus:ring-1 focus:ring-[var(--primary-green)]"
    />
  );
}

export function NumberInput({
  value,
  onChange,
  placeholder,
  min,
  max,
}: {
  value: number;
  onChange: (v: number) => void;
  placeholder?: string;
  min?: number;
  max?: number;
}) {
  return (
    <input
      type="number"
      value={value || ""}
      min={min}
      max={max}
      onChange={(e) => onChange(Number(e.target.value))}
      placeholder={placeholder}
      className="no-spin w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-[var(--primary-green)] focus:ring-1 focus:ring-[var(--primary-green)]"
    />
  );
}
