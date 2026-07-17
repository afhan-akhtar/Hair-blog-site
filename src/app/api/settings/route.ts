import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession, isAdministrator } from "@/lib/auth";
import { getSiteSettings, SITE_SETTING_KEYS, type SiteSettings } from "@/lib/site-settings";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(await getSiteSettings());
}

export async function PUT(request: NextRequest) {
  const session = await getSession();
  if (!session || !isAdministrator(session.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as Partial<SiteSettings>;

  const updates = SITE_SETTING_KEYS.filter((key) => key in body);

  for (const key of updates) {
    const value = String(body[key] ?? "");
    await prisma.siteSetting.upsert({
      where: { key },
      create: { key, value },
      update: { value },
    });
  }

  return NextResponse.json(await getSiteSettings());
}
