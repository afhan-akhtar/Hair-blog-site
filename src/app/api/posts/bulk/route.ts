import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession, canPublish } from "@/lib/auth";

async function permanentlyDeletePosts(ids: string[]) {
  await prisma.redirect.deleteMany({ where: { postId: { in: ids } } });
  await prisma.post.deleteMany({ where: { id: { in: ids }, status: "trash" } });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { ids, action } = await request.json();

  if (!ids?.length || !action) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (action === "publish" && !canPublish(session.role)) {
    return NextResponse.json({ error: "Only administrators can publish posts" }, { status: 403 });
  }

  if (session.role === "collaborator" && action !== "trash") {
    return NextResponse.json({ error: "Collaborators can only manage drafts" }, { status: 403 });
  }

  if ((action === "restore" || action === "delete_permanent") && !canPublish(session.role)) {
    return NextResponse.json({ error: "Only administrators can manage trash" }, { status: 403 });
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
    case "trash": {
      const where =
        session.role === "collaborator"
          ? { id: { in: ids }, authorId: session.id, status: "draft" }
          : { id: { in: ids } };
      await prisma.post.updateMany({
        where,
        data: { status: "trash", deletedAt: new Date() },
      });
      break;
    }
    case "restore":
      await prisma.post.updateMany({
        where: { id: { in: ids }, status: "trash" },
        data: { status: "draft", deletedAt: null },
      });
      break;
    case "delete_permanent":
      await permanentlyDeletePosts(ids);
      break;
    default:
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
