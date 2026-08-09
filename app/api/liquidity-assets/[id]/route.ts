import { NextResponse } from "next/server";
import { getSessionUserId, requireSession } from "@/lib/api/require-session";
import { prisma } from "@/lib/prisma";
import type { LiquidityAsset } from "@/lib/liquidity-types";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireSession();
  if (authResult.response) return authResult.response;

  const userId = getSessionUserId(authResult.session);
  const { id } = await params;
  const assetId = Number(id);
  const body = (await request.json()) as LiquidityAsset;

  if (body.id !== assetId) {
    return NextResponse.json({ error: "ID mismatch." }, { status: 400 });
  }

  const existing = await prisma.liquidityAsset.findFirst({
    where: { id: assetId, userId },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const updated = await prisma.liquidityAsset.update({
    where: { id: assetId },
    data: {
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

  return NextResponse.json(updated as LiquidityAsset);
}
