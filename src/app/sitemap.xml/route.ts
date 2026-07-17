import { prisma } from "@/lib/db";

export async function GET() {
  const posts = await prisma.post.findMany({
    where: {
      status: "published",
      visibility: "public",
      inSitemap: true,
      robots: { not: { contains: "noindex" } },
      deletedAt: null,
    },
    select: { slug: true, updatedAt: true },
  });

  const categories = await prisma.category.findMany({
    where: { indexable: true },
    select: { slug: true, updatedAt: true },
  });

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hairclub.com";

  const urls = [
    ...posts.map((p) => ({
      loc: `${baseUrl}/blog/${p.slug}`,
      lastmod: p.updatedAt.toISOString(),
    })),
    ...categories.map((c) => ({
      loc: `${baseUrl}/category/${c.slug}`,
      lastmod: c.updatedAt.toISOString(),
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod></url>`).join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
