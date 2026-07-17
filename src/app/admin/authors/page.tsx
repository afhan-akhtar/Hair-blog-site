import { prisma } from "@/lib/db";
import Image from "next/image";

export default async function AuthorsPage() {
  const authors = await prisma.author.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-2">Authors and Experts</h1>
      <p className="text-white/50 text-sm mb-8">Manage writers and expert reviewers.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {authors.map((author) => (
          <div
            key={author.id}
            className="bg-white/5 rounded-xl border border-white/10 p-6 flex gap-4"
          >
            {author.avatar && (
              <Image
                src={author.avatar}
                alt={author.name}
                width={64}
                height={64}
                className="rounded-full"
              />
            )}
            <div>
              <h3 className="font-semibold">{author.name}</h3>
              <span className="text-xs uppercase tracking-wider text-white/40 capitalize">
                {author.role}
              </span>
              {author.bio && (
                <p className="text-sm text-white/60 mt-2">{author.bio}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
