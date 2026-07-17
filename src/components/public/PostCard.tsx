import Link from "next/link";
import Image from "next/image";

interface PostCard {
  title: string;
  slug: string;
  featuredImage: string | null;
  category?: { name: string } | null;
  excerpt?: string | null;
}

export function PostCard({ post }: { post: PostCard }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group">
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4">
        <Image
          src={post.featuredImage || "/placeholder.jpg"}
          alt={post.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      {post.category && (
        <span className="text-xs font-semibold uppercase tracking-wider text-terracotta">
          {post.category.name}
        </span>
      )}
      <h3 className="font-serif text-xl font-bold mt-2 group-hover:text-plum transition-colors leading-snug">
        {post.title}
      </h3>
      {post.excerpt && (
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{post.excerpt}</p>
      )}
    </Link>
  );
}
