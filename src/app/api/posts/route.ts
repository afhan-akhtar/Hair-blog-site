import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession, sanitizePostStatus } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const where =
    session.role === "collaborator"
      ? { deletedAt: null, status: "draft", authorId: session.id }
      : { deletedAt: null };

  const posts = await prisma.post.findMany({
    where,
    include: { category: true, author: true },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const status = sanitizePostStatus(session.role, body.status);

  const existing = await prisma.post.findUnique({ where: { slug: body.slug } });
  if (existing) {
    return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
  }

  const post = await prisma.post.create({
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
      authorId: session.role === "collaborator" ? session.id : body.authorId || session.id,
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
      publishedAt: status === "published" ? new Date() : null,
      scheduledAt: status === "scheduled" && body.scheduledAt ? new Date(body.scheduledAt) : null,
    },
  });

  return NextResponse.json(post, { status: 201 });
}
