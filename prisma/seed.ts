import { PrismaClient } from "../src/generated/prisma/client";
import { IMAGES } from "../src/lib/images";

const prisma = new PrismaClient();

async function main() {
  await prisma.post.deleteMany();
  await prisma.category.deleteMany();
  await prisma.author.deleteMany();

  const categories = await Promise.all([
    prisma.category.create({ data: { name: "Hairstyles", slug: "hairstyles", type: "hair" } }),
    prisma.category.create({ data: { name: "Hair Color", slug: "hair-color", type: "hair" } }),
    prisma.category.create({ data: { name: "Hair Care", slug: "hair-care", type: "hair" } }),
    prisma.category.create({ data: { name: "Styling", slug: "styling", type: "hair" } }),
  ]);

  const author = await prisma.author.create({
    data: {
      name: "Gabrielle Hurwitz",
      email: "gabrielle@hairclub.com",
      avatar: IMAGES.authorAvatar,
      bio: "Gabrielle is a beauty editor with over 10 years of experience covering hair trends, styling techniques, and product reviews.",
      role: "writer",
    },
  });

  const reviewer = await prisma.author.create({
    data: {
      name: "Dr. Sarah Chen",
      email: "sarah@hairclub.com",
      avatar: IMAGES.expertAvatar,
      bio: "Board-certified dermatologist specializing in hair and scalp health.",
      role: "expert",
    },
  });

  const articleContent = JSON.stringify([
    {
      id: "1",
      type: "paragraph",
      data: {
        text: "Soft layered haircuts are having a major moment—and for good reason. They add movement, dimension, and that effortless, lived-in texture we all crave, without sacrificing the length you've worked so hard to grow.",
      },
    },
    {
      id: "2",
      type: "heading2",
      data: { text: "What Makes Soft Layers Different?" },
    },
    {
      id: "3",
      type: "paragraph",
      data: {
        text: "Unlike choppy, dramatic layers of the past, soft layers are blended seamlessly into your hair. The result is subtle texture that catches light beautifully and moves naturally with every step.",
      },
    },
    {
      id: "4",
      type: "quote",
      data: {
        text: "The best layered cut should look like you woke up with perfect hair—not like you just left the salon.",
        citation: "Celebrity stylist Jamie Cook",
      },
    },
    {
      id: "5",
      type: "heading2",
      data: { text: "25 Soft Layered Haircuts to Try" },
    },
    {
      id: "6",
      type: "heading3",
      data: { text: "1. Face-Framing Layers" },
    },
    {
      id: "7",
      type: "paragraph",
      data: {
        text: "These delicate layers start at the chin and gently curve around your face, highlighting your best features. Perfect for oval and heart-shaped faces.",
      },
    },
    {
      id: "8",
      type: "image",
      data: {
        src: IMAGES.articleInline,
        alt: "Face-framing layered haircut",
        caption: "Face-framing layers add softness and dimension",
      },
    },
    {
      id: "9",
      type: "heading3",
      data: { text: "2. Butterfly Layers" },
    },
    {
      id: "10",
      type: "paragraph",
      data: {
        text: "Inspired by the butterfly haircut trend, this style features longer layers on top that gradually shorten toward the bottom, creating a feathered, voluminous effect.",
      },
    },
    {
      id: "11",
      type: "bulletList",
      data: {
        items: [
          "Works on all hair textures",
          "Adds volume without bulk",
          "Low maintenance styling",
          "Grows out beautifully",
        ],
      },
    },
    {
      id: "12",
      type: "heading2",
      data: { text: "How to Style Soft Layers at Home" },
    },
    {
      id: "13",
      type: "numberedList",
      data: {
        items: [
          "Apply a heat protectant to damp hair",
          "Blow-dry with a round brush, directing layers away from face",
          "Use a large-barrel curling iron for loose waves",
          "Finish with a texturizing spray for hold",
        ],
      },
    },
    {
      id: "14",
      type: "divider",
      data: {},
    },
    {
      id: "15",
      type: "heading2",
      data: { text: "Frequently Asked Questions" },
    },
    {
      id: "16",
      type: "paragraph",
      data: {
        text: "Q: How often should I trim soft layers?\nA: Every 8-12 weeks to maintain shape and prevent split ends.",
      },
    },
  ]);

  await prisma.post.create({
    data: {
      title: "25 Soft Layered Haircuts That Add Movement Without Losing Length",
      slug: "soft-layered-haircuts",
      excerpt:
        "Discover the most flattering soft layered cuts that add movement and dimension while keeping your length intact.",
      featuredImage: IMAGES.heroMain,
      content: articleContent,
      status: "published",
      seoScore: 92,
      traffic: 12450,
      publishedAt: new Date("2025-06-15"),
      categoryId: categories[0].id,
      authorId: author.id,
      reviewerId: reviewer.id,
    },
  });

  const posts = [
    {
      title: "Warm Brunette Shades That Look Expensive",
      slug: "warm-brunette-shades",
      excerpt: "Rich, dimensional brunette tones that elevate your look without a salon visit.",
      featuredImage: IMAGES.heroSecondary1,
      categoryId: categories[1].id,
      status: "published",
      seoScore: 85,
      traffic: 8320,
    },
    {
      title: "A Simple Guide to Realistic Synthetic Hair",
      slug: "synthetic-hair-guide",
      excerpt: "Everything you need to know about choosing and caring for synthetic hair pieces.",
      featuredImage: IMAGES.heroSecondary2,
      categoryId: categories[3].id,
      status: "published",
      seoScore: 78,
      traffic: 5670,
    },
    {
      title: "How to Repair Damaged Hair in 4 Weeks",
      slug: "repair-damaged-hair",
      excerpt: "A dermatologist-approved routine to restore strength and shine.",
      featuredImage: IMAGES.story1,
      categoryId: categories[2].id,
      status: "published",
      seoScore: 88,
      traffic: 9100,
    },
    {
      title: "The Best Leave-In Conditioners for Curly Hair",
      slug: "leave-in-conditioners-curly",
      excerpt: "Our top picks for hydration, definition, and frizz control.",
      featuredImage: IMAGES.story2,
      categoryId: categories[2].id,
      status: "review",
      seoScore: 65,
      traffic: 0,
    },
    {
      title: "Balayage vs. Highlights: Which Is Right for You?",
      slug: "balayage-vs-highlights",
      excerpt: "A stylist breaks down the differences to help you choose.",
      featuredImage: IMAGES.story3,
      categoryId: categories[1].id,
      status: "draft",
      seoScore: 45,
      traffic: 0,
    },
  ];

  for (const post of posts) {
    await prisma.post.create({
      data: {
        ...post,
        content: "[]",
        authorId: author.id,
        publishedAt: post.status === "published" ? new Date() : null,
      },
    });
  }

  console.log("Seed completed successfully!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
