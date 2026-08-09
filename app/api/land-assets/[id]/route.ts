import { NextResponse } from "next/server";
import { getSessionUserId, requireEditor } from "@/lib/api/require-session";
import { prisma } from "@/lib/prisma";
import type { LandAsset } from "@/lib/land-types";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireEditor();
  if (authResult.response) return authResult.response;

  const userId = getSessionUserId(authResult.session);
  const { id } = await params;
  const body = (await request.json()) as LandAsset;

  if (body.id !== id) {
    return NextResponse.json({ error: "ID mismatch." }, { status: 400 });
  }

  const existing = await prisma.landAsset.findFirst({ where: { id, userId } });
  if (!existing) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const updated = await prisma.landAsset.update({
    where: { id },
    data: {
      purchasePrice: body.purchasePrice,
      sizeRai: body.sizeRai,
      sizeNgan: body.sizeNgan,
      location: body.location,
      googleMapsUrl: body.googleMapsUrl,
      landStatus: body.landStatus,
      improvementStatus: body.improvementStatus,
      hasStructures: body.hasStructures,
      titleDeedNumber: body.titleDeedNumber,
      titleDeedBook: body.titleDeedBook,
      titleDeedPage: body.titleDeedPage,
      owner: body.owner,
      description: body.description,
      imageUrl: body.imageUrl,
      latitude: body.latitude,
      longitude: body.longitude,
    },
  });

  return NextResponse.json(updated as LandAsset);
}
