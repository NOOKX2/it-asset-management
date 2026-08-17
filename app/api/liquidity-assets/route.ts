import { NextResponse } from "next/server";
import { getSessionUserId, requireEditor, requireSession } from "@/lib/api/require-session";
import { prisma } from "@/lib/prisma";
import type { LiquidityAsset } from "@/lib/liquidity-types";
import { liquidityWriteFields } from "@/lib/liquidity-write";

export async function GET() {
  const authResult = await requireSession();
  if (authResult.response) return authResult.response;

  const userId = getSessionUserId(authResult.session);
  const rows = await prisma.liquidityAsset.findMany({
    where: { userId },
    orderBy: { id: "asc" },
  });
  return NextResponse.json(rows as LiquidityAsset[]);
}

export async function POST(request: Request) {
  const authResult = await requireEditor();
  if (authResult.response) return authResult.response;

  const userId = getSessionUserId(authResult.session);
  const body = (await request.json()) as Omit<LiquidityAsset, "id">;

  try {
    const created = await prisma.liquidityAsset.create({
      data: {
        userId,
        ...liquidityWriteFields(body),
      },
    });
    return NextResponse.json(created as LiquidityAsset, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save asset.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
