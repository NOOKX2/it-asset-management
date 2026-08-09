"use client";

import type { Messages } from "@/lib/i18n/types";
import type { AuthActionState } from "@/lib/auth-action-state";

export function getAuthErrorMessage(
  state: AuthActionState | undefined,
  auth: Messages["auth"]
): string {
  if (!state?.error) return "";

  switch (state.error) {
    case "invalidCredentials":
      return auth.invalidCredentials;
    case "emailExists":
      return auth.emailExists;
    case "invalidEmail":
      return auth.invalidEmail;
    case "passwordTooShort":
      return auth.passwordMinHint;
    case "missingFields":
      return auth.registerFailed;
    default:
      return auth.registerFailed;
  }
}
