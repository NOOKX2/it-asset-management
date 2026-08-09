import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { Session } from "next-auth";

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
