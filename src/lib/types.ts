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
  | "html";

export interface ContentBlock {
  id: string;
  type: BlockType;
  data: Record<string, unknown>;
}

export type PostStatus = "draft" | "review" | "scheduled" | "published";

export interface PostFormData {
  title: string;
  slug: string;
  excerpt?: string;
  featuredImage?: string;
  content: ContentBlock[];
  status: PostStatus;
  categoryId?: string;
  authorId?: string;
  reviewerId?: string;
  seoScore?: number;
  publishedAt?: string;
}

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
};

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
    table: {
      headers: ["Column 1", "Column 2"],
      rows: [["", ""]],
    },
    image: { src: "", alt: "", caption: "" },
    gallery: { images: [{ src: "", alt: "" }] },
    video: { url: "", caption: "" },
    embed: { url: "", caption: "" },
    html: { code: "" },
  };

  return {
    id: crypto.randomUUID(),
    type,
    data: defaults[type],
  };
}

export function parseContent(content: string): ContentBlock[] {
  try {
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
