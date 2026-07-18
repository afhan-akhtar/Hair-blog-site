// All URLs verified working (HTTP 200) — simple params for Next.js image optimizer
export const IMAGES = {
  heroMain:
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1400&q=80",
  heroSecondary1: "/images/hero/secondary-1.png",
  heroSecondary2: "/images/hero/secondary-2.png",

  lookPixie:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80",
  lookBob:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80",
  lookShag:
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80",
  lookLayers:
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&q=80",
  lookBuzz:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80",
  lookBangs:
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80",

  story1:
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=700&q=80",
  story2:
    "https://images.unsplash.com/photo-1622287162716-f311baa1a2b8?w=700&q=80",
  story3:
    "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=700&q=80",

  ctaPortrait:
    "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800&q=80",

  concern1:
    "https://images.unsplash.com/photo-1559599101-f09722fb4948?w=600&q=80",
  concern2:
    "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&q=80",
  concern3:
    "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=600&q=80",

  lifestyle:
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80",

  articleHero:
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&q=80",
  articleInline:
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80",
  authorAvatar:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
  expertAvatar:
    "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=200&q=80",
  related1:
    "https://images.unsplash.com/photo-1622287162716-f311baa1a2b8?w=400&q=80",
  related2:
    "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400&q=80",
  related3:
    "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400&q=80",
};

export const HERO_CONTENT = {
  main: {
    tag: "Trending Now",
    title: "25 Soft Layered Haircuts That Add Movement Without Losing Length",
    slug: "soft-layered-haircuts",
  },
  secondary: [
    {
      tag: "Hair Color",
      title: "Warm Brunette Shades That Look Expensive",
      slug: "warm-brunette-shades",
    },
    {
      tag: "Hair Care",
      title: "A Simple Guide For Healthy Scalp & Hair",
      slug: "synthetic-hair-guide",
    },
  ],
};

export const LOOKS = [
  { name: "The Pixie", image: IMAGES.lookPixie },
  { name: "The Bob", image: IMAGES.lookBob },
  { name: "The Shag", image: IMAGES.lookShag },
  { name: "Layers", image: IMAGES.lookLayers },
  { name: "Buzz Cut", image: IMAGES.lookBuzz },
  { name: "Bangs", image: IMAGES.lookBangs },
];

export const LOOK_CATEGORIES = [
  {
    name: "Short Hair",
    subtitle: "Pixies, bobs & crops",
    image: IMAGES.lookPixie,
    href: "/category/short-hairstyles",
  },
  {
    name: "Medium Hair",
    subtitle: "Lobs, layers & bangs",
    image: IMAGES.lookBob,
    href: "/category/medium-hairstyles",
  },
  {
    name: "Long Hair",
    subtitle: "Length with movement",
    image: IMAGES.lookLayers,
    href: "/category/long-hairstyles",
  },
  {
    name: "Curly Hair",
    subtitle: "Shape, definition & care",
    image: IMAGES.lookShag,
    href: "/category/curly-wavy",
  },
  {
    name: "Hair Color",
    subtitle: "Natural to bold",
    image: IMAGES.lookBangs,
    href: "/category/hair-colors",
  },
  {
    name: "Hair Care",
    subtitle: "Healthy-hair routines",
    image: IMAGES.concern1,
    href: "/category/hair-care",
  },
];

export const TRENDING_TAGS = [
  "Butterfly layers",
  "Cherry cola hair",
  "Short cuts over 50",
  "Heatless curls",
  "Fine-hair volume",
  "Summer braids",
];

export const LATEST_STORIES = [
  {
    tag: "Hair Care",
    title: "How to Repair Damaged Hair in 4 Weeks",
    excerpt: "A dermatologist-approved routine to restore strength and shine.",
    date: "Jun 12, 2025",
    slug: "repair-damaged-hair",
    image: IMAGES.story1,
  },
  {
    tag: "Styling",
    title: "The Best Leave-In Conditioners for Curly Hair",
    excerpt: "Our top picks for hydration, definition, and frizz control.",
    date: "Jun 10, 2025",
    slug: "leave-in-conditioners-curly",
    image: IMAGES.story2,
  },
  {
    tag: "Hair Color",
    title: "Balayage vs. Highlights: Which Is Right for You?",
    excerpt: "A stylist breaks down the differences to help you choose.",
    date: "Jun 8, 2025",
    slug: "balayage-vs-highlights",
    image: IMAGES.story3,
  },
];

export const CONCERNS = [
  {
    tag: "Dryness",
    title: "How To Manage Dry & Damaged Hair",
    excerpt: "Gentle routines that restore moisture without weighing hair down.",
    image: IMAGES.concern1,
  },
  {
    tag: "Scalp",
    title: "Alcohol-Free Comfort for the Scalp",
    excerpt: "Soothing solutions for irritation, flakes, and sensitivity.",
    image: IMAGES.concern2,
  },
  {
    tag: "Volume",
    title: "Fine Hair? Here's How to Add Body",
    excerpt: "Stylist tricks for lift, texture, and lasting volume.",
    image: IMAGES.concern3,
  },
];
