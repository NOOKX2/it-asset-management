"use client";

import { useFormStatus } from "react-dom";

export function AuthSubmitButton({
  label,
  pendingLabel,
}: {
  label: string;
  pendingLabel: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center rounded-xl bg-[#111827] px-4 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#1f2937] disabled:opacity-60"
    >
      {pending ? pendingLabel : label}
    </button>
  );
}
