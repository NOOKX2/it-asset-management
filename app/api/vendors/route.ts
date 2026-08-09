import { NextResponse } from "next/server";
import { getSessionUserId, requireEditor, requireSession } from "@/lib/api/require-session";
import { prisma } from "@/lib/prisma";
import type { Vendor } from "@/lib/vendor-types";

export async function GET() {
  const authResult = await requireSession();
  if (authResult.response) return authResult.response;

  const userId = getSessionUserId(authResult.session);
  const rows = await prisma.vendor.findMany({
    where: { userId },
    orderBy: { id: "asc" },
  });
  return NextResponse.json(rows as Vendor[]);
}

export async function POST(request: Request) {
  const authResult = await requireEditor();
  if (authResult.response) return authResult.response;

  const userId = getSessionUserId(authResult.session);
  const body = (await request.json()) as Vendor;

  if (!body.id || !body.name?.trim()) {
    return NextResponse.json({ error: "Invalid vendor payload." }, { status: 400 });
  }

  const created = await prisma.vendor.create({
    data: {
      id: body.id,
      userId,
      name: body.name.trim(),
      category: body.category,
      taxId: body.taxId,
      contactPerson: body.contactPerson,
      email: body.email,
      phone: body.phone,
      website: body.website,
      address: body.address,
      province: body.province,
      district: body.district,
      assets: body.assets,
      status: body.status,
    },
  });

  return NextResponse.json(created as Vendor, { status: 201 });
}
