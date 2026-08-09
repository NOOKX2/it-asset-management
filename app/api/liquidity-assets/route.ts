import { NextResponse } from "next/server";
import { getSessionUserId, requireSession } from "@/lib/api/require-session";
import { prisma } from "@/lib/prisma";
import type { LiquidityAsset } from "@/lib/liquidity-types";

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
  const authResult = await requireSession();
  if (authResult.response) return authResult.response;

  const userId = getSessionUserId(authResult.session);
  const body = (await request.json()) as Omit<LiquidityAsset, "id">;

  const created = await prisma.liquidityAsset.create({
    data: {
      userId,
      holder: body.holder,
      securityType: body.securityType,
      format: body.format,
      issuingInstitution: body.issuingInstitution,
      costPrice: body.costPrice,
      currentPrice: body.currentPrice,
      moneyMarketValue: body.moneyMarketValue,
      debtorsValue: body.debtorsValue,
      creditorsValue: body.creditorsValue,
      assetsValue: body.assetsValue,
      remarks: body.remarks,
    },
  });

  return NextResponse.json(created as LiquidityAsset, { status: 201 });
}
