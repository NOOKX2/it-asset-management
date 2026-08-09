import { NextResponse } from "next/server";
import { getSessionUserId, requireEditor } from "@/lib/api/require-session";
import { prisma } from "@/lib/prisma";
import { serializeUpdatableAsset, type UpdatableAsset } from "@/lib/update-types";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireEditor();
  if (authResult.response) return authResult.response;

  const userId = getSessionUserId(authResult.session);
  const { id } = await params;
  const body = (await request.json()) as UpdatableAsset;

  if (body.id !== id) {
    return NextResponse.json({ error: "ID mismatch." }, { status: 400 });
  }

  const existing = await prisma.updatableAsset.findFirst({ where: { id, userId } });
  if (!existing) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const updated = await prisma.updatableAsset.update({
    where: { id },
    data: {
      type: body.type,
      assignedTo: body.assignedTo,
      location: body.location,
      status: body.status,
      warrantyExpiry: body.warrantyExpiry,
      purchasePrice: body.purchasePrice,
      depreciationRatePercent: body.depreciationRatePercent,
      usefulLifeYears: body.usefulLifeYears,
    },
  });

  return NextResponse.json(serializeUpdatableAsset(updated));
}
