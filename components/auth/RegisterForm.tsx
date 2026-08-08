"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { AuthField } from "@/components/auth/AuthField";
import { AuthShell } from "@/components/auth/AuthShell";
import { useLocale } from "@/components/providers/LocaleProvider";

export function RegisterForm() {
  const router = useRouter();
  const { t } = useLocale();
  const a = t.auth;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        console.log(res);
        setError(typeof data.error === "string" ? data.error : a.registerFailed);
        setLoading(false);
        return;
      }

      const signInResult = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      setLoading(false);

      if (signInResult?.error) {
        router.push("/login");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setLoading(false);
      setError(a.registerFailed);
    }
  };

  return (
    <AuthShell>
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">{a.registerTitle}</h1>
        <p className="mt-2 text-sm text-gray-500">{a.registerSubtitle}</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <AuthField
            label={a.name}
            value={name}
            onChange={setName}
            placeholder={a.namePlaceholder}
            autoComplete="name"
            icon="user"
          />

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
            placeholder={a.passwordMinHint}
            required
            minLength={8}
            autoComplete="new-password"
            icon="password"
          />

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-xl bg-[#111827] px-4 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#1f2937] disabled:opacity-60"
          >
            {loading ? a.creatingAccount : a.createAccount}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          {a.hasAccount}{" "}
          <Link
            href="/login"
            className="font-semibold text-[var(--primary-green)] hover:text-[var(--primary-green-dark)]"
          >
            {a.signIn}
          </Link>
        </p>

        <p className="mt-4 text-center text-xs text-gray-400">{a.sessionHint}</p>
      </div>
    </AuthShell>
  );
}
