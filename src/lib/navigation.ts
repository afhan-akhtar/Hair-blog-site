import { IMAGES } from "./images";

export interface NavLink {
  label: string;
  href: string;
}

export interface NavColumn {
  title: string;
  links: NavLink[];
}

export interface NavFeatured {
  tag: string;
  title: string;
  href: string;
  image: string;
}

export interface NavItem {
  label: string;
  href: string;
  mega?: {
    columns: NavColumn[];
    featured: NavFeatured;
  };
}

export const SITE = {
  name: "The Hair Edit",
  tagline: "Hair • Beauty • Style",
  description:
    "Beauty advice that feels inspiring—and genuinely useful. Hairstyles, hair color, and hair care from experts.",
};

export const MAIN_NAV: NavItem[] = [
  {
    label: "Hairstyles",
    href: "/category/hairstyles",
    mega: {
      columns: [
        {
          title: "By length",
          links: [
            { label: "Short hairstyles", href: "/category/short-hairstyles" },
            { label: "Medium hairstyles", href: "/category/medium-hairstyles" },
            { label: "Long hairstyles", href: "/category/long-hairstyles" },
            { label: "Haircuts & layers", href: "/category/haircuts" },
          ],
        },
        {
          title: "By style",
          links: [
            { label: "Bobs & pixies", href: "/category/bobs-pixies" },
            { label: "Braids & protective styles", href: "/category/braids" },
            { label: "Curly & wavy hair", href: "/category/curly-wavy" },
            { label: "Updos & occasion hair", href: "/category/updos" },
          ],
        },
      ],
      featured: {
        tag: "Editor's pick",
        title: "24 face-framing cuts that make styling easier",
        href: "/blog/soft-layered-haircuts",
        image: IMAGES.heroMain,
      },
    },
  },
  {
    label: "Hair Color",
    href: "/category/hair-colors",
    mega: {
      columns: [
        {
          title: "Shades",
          links: [
            { label: "Blonde & highlights", href: "/category/blonde" },
            { label: "Brunette & warm tones", href: "/category/brunette" },
            { label: "Red & copper", href: "/category/red-copper" },
            { label: "Bold & vivid color", href: "/category/vivid-color" },
          ],
        },
        {
          title: "Techniques",
          links: [
            { label: "Balayage & ombré", href: "/category/balayage" },
            { label: "Root touch-ups", href: "/category/root-touchup" },
            { label: "Gray blending", href: "/category/gray-blending" },
            { label: "At-home color", href: "/category/at-home-color" },
          ],
        },
      ],
      featured: {
        tag: "Trending",
        title: "Warm brunette shades that look expensive",
        href: "/blog/warm-brunette-shades",
        image: IMAGES.heroSecondary1,
      },
    },
  },
  {
    label: "Hair Care",
    href: "/category/hair-care",
    mega: {
      columns: [
        {
          title: "By concern",
          links: [
            { label: "Dry & damaged hair", href: "/category/dry-damaged" },
            { label: "Frizz & flyaways", href: "/category/frizz" },
            { label: "Scalp health", href: "/category/scalp-health" },
            { label: "Hair loss & thinning", href: "/category/hair-loss" },
          ],
        },
        {
          title: "Routines",
          links: [
            { label: "Wash day guides", href: "/category/wash-day" },
            { label: "Deep conditioning", href: "/category/deep-conditioning" },
            { label: "Heat protection", href: "/category/heat-protection" },
            { label: "Product guides", href: "/category/hair-products" },
          ],
        },
      ],
      featured: {
        tag: "Must read",
        title: "How to repair damaged hair in 4 weeks",
        href: "/blog/repair-damaged-hair",
        image: IMAGES.story1,
      },
    },
  },
  {
    label: "Trends",
    href: "/trends",
  },
  {
    label: "About",
    href: "/about",
  },
];

export const FOOTER_LINKS = {
  explore: [
    { label: "Hairstyles", href: "/category/hairstyles" },
    { label: "Hair Color", href: "/category/hair-colors" },
    { label: "Hair Care", href: "/category/hair-care" },
    { label: "Trends", href: "/trends" },
  ],
  company: [
    { label: "About us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "FAQ", href: "/faq" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Use", href: "/terms" },
  ],
};
