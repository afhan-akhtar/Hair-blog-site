import Link from "next/link";
import Image from "next/image";
import { IMAGES } from "@/lib/images";

interface StoryCardProps {
  tag: string;
  title: string;
  excerpt: string;
  date: string;
  slug: string;
  image: string;
}

export function StoryCard({ tag, title, excerpt, date, slug, image }: StoryCardProps) {
  const imageSrc = image || IMAGES.story1;

  return (
    <Link href={`/blog/${slug}`} className="group block cursor-pointer">
      <div className="story-image-wrap image-zoom-wrap transition-shadow duration-500 group-hover:shadow-[0_12px_40px_rgba(93,58,66,0.12)]">
        <Image
          src={imageSrc}
          alt={title}
          fill
          loading="lazy"
          sizes="(max-width: 768px) 100vw, 33vw"
          unoptimized={imageSrc.startsWith("/uploads")}
          className="object-cover object-center zoom-target"
        />
        <div className="absolute inset-0 bg-plum/0 group-hover:bg-plum/10 transition-colors duration-500" />
        <div className="absolute bottom-4 right-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <span className="bg-white/95 text-charcoal text-xs font-semibold px-3 py-1.5 rounded-full shadow-md">
            Read →
          </span>
        </div>
      </div>
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-terracotta transition-colors duration-300 group-hover:text-plum">
        {tag}
      </span>
      <h3 className="font-serif text-xl md:text-2xl font-bold mt-2 leading-snug text-charcoal transition-colors duration-300 group-hover:text-plum">
        {title}
      </h3>
      <p className="text-sm md:text-base text-gray-500 mt-2 line-clamp-2 leading-relaxed">{excerpt}</p>
      <p className="text-xs md:text-sm text-gray-400 mt-3">{date}</p>
    </Link>
  );
}

interface PostCardProps {
  post: {
    title: string;
    slug: string;
    featuredImage: string | null;
    category?: { name: string } | null;
    excerpt?: string | null;
    publishedAt?: Date | null;
  };
}

export function PostCard({ post }: PostCardProps) {
  return (
    <StoryCard
      tag={post.category?.name || "Hair"}
      title={post.title}
      excerpt={post.excerpt || ""}
      date={
        post.publishedAt
          ? new Date(post.publishedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : ""
      }
      slug={post.slug}
      image={post.featuredImage || ""}
    />
  );
}
