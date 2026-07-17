import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const posts = await prisma.post.findMany({
    where: { deletedAt: null },
    include: { category: true, author: true },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

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
      publishedAt: body.status === "published" ? new Date() : null,
      scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
    },
  });

  return NextResponse.json(post, { status: 201 });
}
