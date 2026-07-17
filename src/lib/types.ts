export type BlockType =
  | "paragraph"
  | "heading2"
  | "heading3"
  | "heading4"
  | "bulletList"
  | "numberedList"
  | "quote"
  | "button"
  | "divider"
  | "table"
  | "image"
  | "gallery"
  | "video"
  | "embed"
  | "html"
  | "quickAnswer"
  | "hairstyleCard"
  | "stylistTip"
  | "stepByStep"
  | "faq"
  | "prosCons"
  | "relatedPosts"
  | "productRecommendation";

export interface ContentBlock {
  id: string;
  type: BlockType;
  data: Record<string, unknown>;
}

export type PostStatus = "draft" | "review" | "scheduled" | "published" | "private" | "trash";
export type PostVisibility = "public" | "private";
export type UserRole = "administrator" | "collaborator" | "editor" | "author";
export type SchemaType = "article" | "howto" | "faq" | "productReview" | "none";

export const BLOCK_LABELS: Record<BlockType, string> = {
  paragraph: "Paragraph",
  heading2: "H2 Heading",
  heading3: "H3 Heading",
  heading4: "H4 Heading",
  bulletList: "Bullet List",
  numberedList: "Numbered List",
  quote: "Quote",
  button: "Button",
  divider: "Divider",
  table: "Table",
  image: "Image",
  gallery: "Gallery",
  video: "Video",
  embed: "Embed",
  html: "HTML Block",
  quickAnswer: "Quick Answer",
  hairstyleCard: "Hairstyle Card",
  stylistTip: "Stylist Tip",
  stepByStep: "Step-by-Step Tutorial",
  faq: "FAQ",
  prosCons: "Pros and Cons",
  relatedPosts: "Related Posts",
  productRecommendation: "Product Recommendation",
};

export const BLOCK_ICONS: Record<BlockType, string> = {
  paragraph: "¶",
  heading2: "H2",
  heading3: "H3",
  heading4: "H4",
  bulletList: "•",
  numberedList: "1.",
  quote: "❝",
  button: "▣",
  divider: "—",
  table: "⊞",
  image: "🖼",
  gallery: "▦",
  video: "▶",
  embed: "🔗",
  html: "</>",
  quickAnswer: "⚡",
  hairstyleCard: "💇",
  stylistTip: "✂️",
  stepByStep: "📋",
  faq: "❓",
  prosCons: "⚖",
  relatedPosts: "📰",
  productRecommendation: "🛍",
};

const STANDARD_BLOCKS: BlockType[] = [
  "paragraph", "heading2", "heading3", "heading4",
  "bulletList", "numberedList", "quote", "button",
  "divider", "table", "image", "gallery", "video", "embed", "html",
];

const CUSTOM_BLOCKS: BlockType[] = [
  "quickAnswer", "hairstyleCard", "stylistTip", "stepByStep",
  "faq", "prosCons", "relatedPosts", "productRecommendation",
];

export { STANDARD_BLOCKS, CUSTOM_BLOCKS };

export function createBlock(type: BlockType): ContentBlock {
  const defaults: Record<BlockType, Record<string, unknown>> = {
    paragraph: { text: "" },
    heading2: { text: "" },
    heading3: { text: "" },
    heading4: { text: "" },
    bulletList: { items: [""] },
    numberedList: { items: [""] },
    quote: { text: "", citation: "" },
    button: { text: "Click here", url: "#", style: "primary" },
    divider: {},
    table: { headers: ["Column 1", "Column 2"], rows: [["", ""]] },
    image: { src: "", alt: "", caption: "" },
    gallery: { images: [{ src: "", alt: "" }] },
    video: { url: "", caption: "" },
    embed: { url: "", caption: "" },
    html: { code: "" },
    quickAnswer: { question: "", answer: "" },
    hairstyleCard: { title: "", image: "", description: "", difficulty: "Easy", time: "30 min" },
    stylistTip: { tip: "", stylistName: "" },
    stepByStep: { title: "", steps: [{ title: "", description: "", image: "" }] },
    faq: { items: [{ question: "", answer: "" }] },
    prosCons: { title: "", pros: [""], cons: [""] },
    relatedPosts: { postIds: [] },
    productRecommendation: { name: "", image: "", description: "", price: "", url: "", rating: 5 },
  };

  return { id: crypto.randomUUID(), type, data: defaults[type] };
}

export function parseContent(content: string): ContentBlock[] {
  try {
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function parseTags(tags: string): string[] {
  try {
    const parsed = JSON.parse(tags);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
