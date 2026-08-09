"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { registerAction } from "@/app/actions/auth";
import { initialAuthActionState } from "@/lib/auth-action-state";
import { AuthField } from "@/components/auth/AuthField";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthSubmitButton } from "@/components/auth/AuthSubmitButton";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getAuthErrorMessage } from "@/lib/auth-errors";

export function RegisterForm() {
  const { t } = useLocale();
  const a = t.auth;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, formAction] = useActionState(registerAction, initialAuthActionState);

  const error = getAuthErrorMessage(state, a);

  return (
    <AuthShell>
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">{a.registerTitle}</h1>
        <p className="mt-2 text-sm text-gray-500">{a.registerSubtitle}</p>

        <form action={formAction} className="mt-8 space-y-5">
          <AuthField
            name="name"
            label={a.name}
            value={name}
            onChange={setName}
            placeholder={a.namePlaceholder}
            autoComplete="name"
            icon="user"
          />

          <AuthField
            name="email"
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
            name="password"
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

          <AuthSubmitButton label={a.createAccount} pendingLabel={a.creatingAccount} />
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
