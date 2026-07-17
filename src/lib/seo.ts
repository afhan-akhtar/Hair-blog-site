interface SeoCheckInput {
  title: string;
  seoTitle?: string | null;
  metaDescription?: string | null;
  featuredImage?: string | null;
  featuredImageAlt?: string | null;
  categoryId?: string | null;
  authorId?: string | null;
  content?: string;
  focusKeyword?: string | null;
}

export interface SeoCheckResult {
  score: number;
  warnings: string[];
  passed: string[];
}

export function checkSeo(input: SeoCheckInput): SeoCheckResult {
  const warnings: string[] = [];
  const passed: string[] = [];
  let score = 0;

  if (input.seoTitle?.trim()) {
    passed.push("SEO title set");
    score += 15;
    if (input.seoTitle.length > 60) warnings.push("SEO title exceeds 60 characters");
  } else {
    warnings.push("Missing SEO title");
  }

  if (input.metaDescription?.trim()) {
    passed.push("Meta description set");
    score += 15;
    if (input.metaDescription.length > 160) warnings.push("Meta description exceeds 160 characters");
  } else {
    warnings.push("Missing meta description");
  }

  if (input.featuredImage) {
    passed.push("Featured image set");
    score += 15;
  } else {
    warnings.push("Missing featured image");
  }

  if (input.featuredImageAlt?.trim()) {
    passed.push("Image alt text set");
    score += 10;
  } else if (input.featuredImage) {
    warnings.push("Missing image alt text");
  }

  if (input.categoryId) {
    passed.push("Category assigned");
    score += 10;
  } else {
    warnings.push("Missing category");
  }

  if (input.authorId) {
    passed.push("Author assigned");
    score += 10;
  } else {
    warnings.push("Missing author");
  }

  if (input.focusKeyword?.trim()) {
    passed.push("Focus keyword set");
    score += 10;
  } else {
    warnings.push("Missing focus keyword");
  }

  if (input.title.length >= 10) {
    passed.push("Title length OK");
    score += 5;
  }

  const hasInternalLink = input.content?.includes('href="/blog/') || input.content?.includes('href="/category/');
  if (hasInternalLink) {
    passed.push("Internal link found");
    score += 10;
  } else {
    warnings.push("No internal links found");
  }

  return { score: Math.min(score, 100), warnings, passed };
}

export function getSeoStatusColor(warnings: number): string {
  if (warnings === 0) return "text-green-600 bg-green-50";
  if (warnings <= 2) return "text-yellow-600 bg-yellow-50";
  return "text-red-600 bg-red-50";
}

export function getSeoStatusLabel(warnings: number): string {
  if (warnings === 0) return "Good";
  if (warnings <= 2) return "Needs work";
  return "Poor";
}
