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
      className="flex w-full items-center justify-center rounded-xl bg-[var(--primary-green)] px-4 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--primary-green-dark)] disabled:opacity-60"
    >
      {pending ? pendingLabel : label}
    </button>
  );
}
