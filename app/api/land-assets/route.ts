import { NextResponse } from "next/server";
import { getSessionUserId, requireEditor, requireSession } from "@/lib/api/require-session";
import { prisma } from "@/lib/prisma";
import type { LandAsset } from "@/lib/land-types";

export async function GET() {
  const authResult = await requireSession();
  if (authResult.response) return authResult.response;

  const userId = getSessionUserId(authResult.session);
  const rows = await prisma.landAsset.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(rows as LandAsset[]);
}

export async function POST(request: Request) {
  const authResult = await requireEditor();
  if (authResult.response) return authResult.response;

  const userId = getSessionUserId(authResult.session);
  const body = (await request.json()) as LandAsset;

  if (!body.id || !body.location) {
    return NextResponse.json({ error: "Invalid land asset payload." }, { status: 400 });
  }

  const created = await prisma.landAsset.create({
    data: {
      id: body.id,
      userId,
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

  return NextResponse.json(created as LandAsset, { status: 201 });
}
