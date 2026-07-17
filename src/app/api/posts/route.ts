import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const posts = await prisma.post.findMany({
    include: { category: true, author: true, reviewer: true },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const post = await prisma.post.create({
    data: {
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt || null,
      featuredImage: body.featuredImage || null,
      content: JSON.stringify(body.content || []),
      status: body.status || "draft",
      categoryId: body.categoryId || null,
      authorId: body.authorId || null,
      reviewerId: body.reviewerId || null,
      publishedAt: body.status === "published" ? new Date() : null,
    },
  });

  return NextResponse.json(post, { status: 201 });
}
