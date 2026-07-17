import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  const { ids, action } = await request.json();

  if (!ids?.length || !action) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  switch (action) {
    case "publish":
      await prisma.post.updateMany({
        where: { id: { in: ids } },
        data: { status: "published", publishedAt: new Date(), deletedAt: null },
      });
      break;
    case "draft":
      await prisma.post.updateMany({
        where: { id: { in: ids } },
        data: { status: "draft", deletedAt: null },
      });
      break;
    case "trash":
      await prisma.post.updateMany({
        where: { id: { in: ids } },
        data: { status: "trash", deletedAt: new Date() },
      });
      break;
    default:
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
