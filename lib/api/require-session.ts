import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { Session } from "next-auth";
import { canEdit, parseUserRole, type UserRole } from "@/lib/user-role";

export async function requireSession() {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      session: null,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  return { session, response: null };
}

export function getSessionUserId(session: Session): string {
  const id = session.user?.id;
  if (!id) {
    throw new Error("Session missing user id");
  }
  return id;
}

export function getSessionUserRole(session: Session): UserRole {
  return parseUserRole(session.user?.role);
}

export async function requireEditor() {
  const authResult = await requireSession();
  if (authResult.response) {
    return authResult;
  }

  const role = getSessionUserRole(authResult.session);
  if (!canEdit(role)) {
    return {
      session: null,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return authResult;
}
