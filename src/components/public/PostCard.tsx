import Link from "next/link";
import Image from "next/image";

interface StoryCardProps {
  tag: string;
  title: string;
  excerpt: string;
  date: string;
  slug: string;
  image: string;
}

export function StoryCard({ tag, title, excerpt, date, slug, image }: StoryCardProps) {
  return (
    <Link href={`/blog/${slug}`} className="group block">
      <div className="relative aspect-[4/3] rounded-[20px] overflow-hidden mb-5">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
        />
      </div>
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-terracotta">
        {tag}
      </span>
      <h3 className="font-serif text-[1.35rem] font-bold mt-2 leading-snug text-charcoal group-hover:text-plum transition-colors">
        {title}
      </h3>
      <p className="text-sm text-gray-500 mt-2 line-clamp-2 leading-relaxed">{excerpt}</p>
      <p className="text-xs text-gray-400 mt-3">{date}</p>
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
