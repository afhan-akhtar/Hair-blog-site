import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession, sanitizePostStatus, canPublish } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id },
    include: { category: true, author: true },
  });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (
    session.role === "collaborator" &&
    (post.status !== "draft" || post.authorId !== session.id)
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(post);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (
    session.role === "collaborator" &&
    (existing.status !== "draft" || existing.authorId !== session.id)
  ) {
    return NextResponse.json({ error: "You can only edit your own drafts" }, { status: 403 });
  }

  const status = sanitizePostStatus(session.role, body.status);

  if (body.slug !== existing.slug) {
    const slugTaken = await prisma.post.findFirst({
      where: { slug: body.slug, id: { not: id } },
    });
    if (slugTaken) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
    }
    if (existing.status === "published") {
      await prisma.redirect.create({
        data: {
          fromPath: `/blog/${existing.slug}`,
          toPath: `/blog/${body.slug}`,
          postId: id,
        },
      });
    }
    await prisma.postRevision.create({
      data: { postId: id, title: existing.title, content: existing.content },
    });
  }

  const post = await prisma.post.update({
    where: { id },
    data: {
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt || null,
      featuredImage: body.featuredImage || null,
      featuredImageAlt: body.featuredImageAlt || null,
      featuredImageTitle: body.featuredImageTitle || null,
      featuredImageCaption: body.featuredImageCaption || null,
      featuredImageCredit: body.featuredImageCredit || null,
      content: JSON.stringify(body.content || []),
      status,
      visibility: body.visibility || "public",
      categoryId: body.categoryId || null,
      authorId:
        session.role === "collaborator" ? session.id : body.authorId || existing.authorId,
      tags: JSON.stringify(body.tags || []),
      focusKeyword: body.focusKeyword || null,
      seoTitle: body.seoTitle || null,
      metaDescription: body.metaDescription || null,
      canonicalUrl: body.canonicalUrl || null,
      robots: body.robots || "index,follow",
      breadcrumbTitle: body.breadcrumbTitle || null,
      inSitemap: body.inSitemap ?? true,
      socialTitle: body.socialTitle || null,
      socialDescription: body.socialDescription || null,
      socialImage: body.socialImage || null,
      pinterestImage: body.pinterestImage || null,
      schemaType: body.schemaType || "article",
      seoScore: body.seoScore || 0,
      publishedAt:
        status === "published" && !existing.publishedAt ? new Date() : existing.publishedAt,
      scheduledAt: status === "scheduled" && body.scheduledAt ? new Date(body.scheduledAt) : null,
    },
  });

  return NextResponse.json(post);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (
    session.role === "collaborator" &&
    (existing.status !== "draft" || existing.authorId !== session.id)
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (existing.status === "trash") {
    if (!canPublish(session.role)) {
      return NextResponse.json({ error: "Only administrators can permanently delete posts" }, { status: 403 });
    }
    await prisma.redirect.deleteMany({ where: { postId: id } });
    await prisma.post.delete({ where: { id } });
    return NextResponse.json({ success: true });
  }

  await prisma.post.update({
    where: { id },
    data: { status: "trash", deletedAt: new Date() },
  });
  return NextResponse.json({ success: true });
}
