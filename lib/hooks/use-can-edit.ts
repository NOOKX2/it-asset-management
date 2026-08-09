"use client";

import { useSession } from "next-auth/react";
import { canEdit, parseUserRole } from "@/lib/user-role";

export function useCanEdit(): boolean {
  const { data: session } = useSession();
  const role = parseUserRole(session?.user?.role);
  return canEdit(role);
}
