"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { AuthField } from "@/components/auth/AuthField";
import { AuthShell } from "@/components/auth/AuthShell";
import { useLocale } from "@/components/providers/LocaleProvider";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLocale();
  const a = t.auth;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email: email.trim().toLowerCase(),
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError(a.invalidCredentials);
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <AuthShell>
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">{a.loginTitle}</h1>
        <p className="mt-2 text-sm text-gray-500">{a.loginSubtitle}</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <AuthField
            label={a.email}
            type="email"
            value={email}
            onChange={setEmail}
            placeholder={a.emailPlaceholder}
            required
            autoComplete="email"
            icon="email"
          />

          <AuthField
            label={a.password}
            type="password"
            value={password}
            onChange={setPassword}
            placeholder={a.passwordPlaceholder}
            required
            autoComplete="current-password"
            icon="password"
          />

          <div className="flex items-center justify-between gap-4">
            <label className="flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-[var(--primary-green)] focus:ring-[var(--primary-green)]"
              />
              <span className="text-sm text-gray-600">{a.rememberMe}</span>
            </label>
            <button
              type="button"
              className="text-sm font-medium text-[var(--primary-green)] hover:text-[var(--primary-green-dark)]"
            >
              {a.forgotPassword}
            </button>
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-xl bg-[#111827] px-4 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#1f2937] disabled:opacity-60"
          >
            {loading ? a.signingIn : a.signIn}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          {a.noAccount}{" "}
          <Link
            href="/register"
            className="font-semibold text-[var(--primary-green)] hover:text-[var(--primary-green-dark)]"
          >
            {a.signUpFree}
          </Link>
        </p>

        <p className="mt-4 text-center text-xs text-gray-400">{a.sessionHint}</p>
      </div>
    </AuthShell>
  );
}
