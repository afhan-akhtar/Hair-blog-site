import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id },
    include: { category: true, author: true },
  });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

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
      status: body.status || "draft",
      visibility: body.visibility || "public",
      categoryId: body.categoryId || null,
      authorId: body.authorId || null,
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
        body.status === "published" && !existing.publishedAt
          ? new Date()
          : existing.publishedAt,
      scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
    },
  });

  return NextResponse.json(post);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.post.update({
    where: { id },
    data: { status: "trash", deletedAt: new Date() },
  });
  return NextResponse.json({ success: true });
}
