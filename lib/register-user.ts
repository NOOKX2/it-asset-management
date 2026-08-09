import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";

export type RegisterUserError =
  | "missingFields"
  | "invalidEmail"
  | "passwordTooShort"
  | "emailExists"
  | "registerFailed";

export type RegisterUserResult =
  | { ok: true; email: string; password: string }
  | { ok: false; error: RegisterUserError };

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
}): Promise<RegisterUserResult> {
  const email = input.email.trim().toLowerCase();
  const password = input.password;
  const name = input.name.trim() ? input.name.trim() : null;

  if (!email || !password) {
    return { ok: false, error: "missingFields" };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "invalidEmail" };
  }

  if (password.length < 8) {
    return { ok: false, error: "passwordTooShort" };
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { ok: false, error: "emailExists" };
    }

    const passwordHash = await hashPassword(password);
    await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
      },
    });

    return { ok: true, email, password };
  } catch {
    return { ok: false, error: "registerFailed" };
  }
}
