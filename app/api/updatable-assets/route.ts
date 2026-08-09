import { NextResponse } from "next/server";
import { getSessionUserId, requireSession } from "@/lib/api/require-session";
import { prisma } from "@/lib/prisma";
import type { UpdatableAsset } from "@/lib/update-types";

export async function GET() {
  const authResult = await requireSession();
  if (authResult.response) return authResult.response;

  const userId = getSessionUserId(authResult.session);
  const rows = await prisma.updatableAsset.findMany({
    where: { userId },
    orderBy: { id: "asc" },
  });
  return NextResponse.json(rows as UpdatableAsset[]);
}
