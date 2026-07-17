import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import bcrypt from "bcryptjs";
import { IMAGES } from "../src/lib/images";

const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "hairblog",
  password: process.env.DB_PASSWORD || "hairblog123",
  database: process.env.DB_NAME || "hair_blog",
  connectionLimit: 5,
  allowPublicKeyRetrieval: true,
});

const prisma = new PrismaClient({ adapter });

async function hash(password: string) {
  return bcrypt.hash(password, 12);
}

async function main() {
  await prisma.redirect.deleteMany();
  await prisma.postRevision.deleteMany();
  await prisma.post.deleteMany();
  await prisma.media.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  await prisma.siteSetting.deleteMany();

  const adminPassword = await hash("password");

  const admin = await prisma.user.create({
    data: {
      username: "admin",
      name: "Admin",
      email: "admin@hairedit.com",
      password: adminPassword,
      role: "administrator",
      avatar: IMAGES.authorAvatar,
      bio: "Site administrator.",
    },
  });

  const collaboratorPassword = await hash("password");

  const collaborator = await prisma.user.create({
    data: {
      username: "jane",
      name: "Jane Collaborator",
      email: "jane@hairedit.com",
      password: collaboratorPassword,
      role: "collaborator",
      avatar: IMAGES.expertAvatar,
      bio: "Content collaborator — drafts only.",
    },
  });

  const categoryData = [
    { name: "Hairstyles", slug: "hairstyles" },
    { name: "Hair Colors", slug: "hair-colors" },
    { name: "Hair Care", slug: "hair-care" },
    { name: "Haircuts", slug: "haircuts" },
    { name: "Hair Trends", slug: "hair-trends" },
    { name: "Hair Products", slug: "hair-products" },
    { name: "Hair Tutorials", slug: "hair-tutorials" },
  ];

  const categories = [];
  for (const cat of categoryData) {
    categories.push(
      await prisma.category.create({
        data: {
          ...cat,
          seoTitle: `${cat.name} | Hair Club`,
          metaDescription: `Explore the best ${cat.name.toLowerCase()} tips, guides, and inspiration.`,
          indexable: true,
        },
      })
    );
  }

  const articleContent = JSON.stringify([
    { id: "1", type: "quickAnswer", data: { question: "What are soft layered haircuts?", answer: "Soft layered haircuts add movement and dimension without sacrificing length." } },
    { id: "2", type: "paragraph", data: { text: "Soft layered haircuts are having a major moment—and for good reason." } },
    { id: "3", type: "heading2", data: { text: "What Makes Soft Layers Different?" } },
    { id: "4", type: "stylistTip", data: { tip: "The best layered cut should look like you woke up with perfect hair.", stylistName: "Jamie Cook" } },
    { id: "5", type: "image", data: { src: IMAGES.articleInline, alt: "Face-framing layered haircut", caption: "Face-framing layers add softness" } },
    { id: "6", type: "faq", data: { items: [{ question: "How often should I trim?", answer: "Every 8-12 weeks." }] } },
  ]);

  await prisma.post.create({
    data: {
      title: "25 Soft Layered Haircuts That Add Movement Without Losing Length",
      slug: "soft-layered-haircuts",
      excerpt: "Discover the most flattering soft layered cuts that add movement and dimension.",
      featuredImage: IMAGES.heroMain,
      featuredImageAlt: "Woman with soft layered blonde hair",
      content: articleContent,
      status: "published",
      visibility: "public",
      seoTitle: "25 Soft Layered Haircuts for Movement & Length (2025)",
      metaDescription: "Discover 25 soft layered haircuts that add movement without losing length.",
      focusKeyword: "soft layered haircuts",
      seoScore: 92,
      traffic: 12450,
      publishedAt: new Date("2025-06-15"),
      categoryId: categories[0].id,
      authorId: admin.id,
      tags: JSON.stringify(["haircuts", "layers"]),
      schemaType: "article",
      inSitemap: true,
    },
  });

  const morePosts = [
    { title: "Warm Brunette Shades That Look Expensive", slug: "warm-brunette-shades", excerpt: "Rich brunette tones.", featuredImage: IMAGES.heroSecondary1, categoryId: categories[1].id, status: "published", seoScore: 85, traffic: 8320, seoTitle: "Warm Brunette Shades", metaDescription: "Rich brunette hair color ideas.", focusKeyword: "warm brunette" },
    { title: "A Simple Guide to Realistic Synthetic Hair", slug: "synthetic-hair-guide", excerpt: "Synthetic hair guide.", featuredImage: IMAGES.heroSecondary2, categoryId: categories[6].id, status: "published", seoScore: 78, traffic: 5670 },
    { title: "How to Repair Damaged Hair in 4 Weeks", slug: "repair-damaged-hair", excerpt: "Repair routine.", featuredImage: IMAGES.story1, categoryId: categories[2].id, status: "published", seoScore: 88, traffic: 9100 },
    { title: "Best Leave-In Conditioners for Curly Hair", slug: "leave-in-conditioners-curly", excerpt: "Top picks.", featuredImage: IMAGES.story2, categoryId: categories[2].id, status: "draft", seoScore: 45, traffic: 0, authorId: collaborator.id },
    { title: "Balayage vs. Highlights", slug: "balayage-vs-highlights", excerpt: "Which is right?", featuredImage: IMAGES.story3, categoryId: categories[1].id, status: "review", seoScore: 55, traffic: 0 },
  ];

  for (const post of morePosts) {
    await prisma.post.create({
      data: {
        ...post,
        content: "[]",
        authorId: post.authorId || admin.id,
        visibility: "public",
        publishedAt: post.status === "published" ? new Date() : null,
        tags: "[]",
        schemaType: "article",
        inSitemap: post.status === "published",
      },
    });
  }

  await prisma.siteSetting.createMany({
    data: [
      { key: "site_title", value: "The Hair Edit" },
      { key: "site_tagline", value: "Hair • Beauty • Style" },
      { key: "site_description", value: "Beauty advice that feels inspiring—and genuinely useful." },
      { key: "site_logo", value: "" },
      { key: "site_favicon", value: "" },
      { key: "hero_video", value: "" },
      { key: "publisher_name", value: "The Hair Edit" },
      { key: "publisher_logo", value: "" },
      { key: "social_instagram", value: "https://instagram.com/hairclub" },
      { key: "social_pinterest", value: "https://pinterest.com/hairclub" },
      { key: "social_tiktok", value: "https://tiktok.com/@hairclub" },
      { key: "copyright_text", value: "© {year} {site}. All rights reserved." },
      { key: "copyright_link", value: "/" },
      { key: "header_menu", value: "" },
      { key: "footer_menu", value: "" },
    ],
  });

  console.log("Seed completed successfully!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
