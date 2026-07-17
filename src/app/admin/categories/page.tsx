import { prisma } from "@/lib/db";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { posts: true } } },
    orderBy: { name: "asc" },
  });

  const futureCategories = ["Skincare", "Outfits", "Nails", "Makeup", "Beauty"];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-white/50 text-sm mt-1">
            Manage content categories. Future expansion categories use the same system.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-plum text-white rounded-lg text-sm font-medium">
          <Plus className="w-4 h-4" />
          New Category
        </button>
      </div>

      <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-white/60">
              <th className="text-left p-4 font-medium">Name</th>
              <th className="text-left p-4 font-medium">Slug</th>
              <th className="text-left p-4 font-medium">Type</th>
              <th className="text-left p-4 font-medium">Posts</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-white/5">
                <td className="p-4 font-medium">{cat.name}</td>
                <td className="p-4 text-white/70">{cat.slug}</td>
                <td className="p-4 text-white/70 capitalize">{cat.type}</td>
                <td className="p-4 text-white/70">{cat._count.posts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white/5 rounded-xl border border-white/10 p-6">
        <h2 className="text-lg font-semibold mb-3">Future Expansion</h2>
        <p className="text-white/50 text-sm mb-4">
          These categories can be added using the same system when you expand beyond hair:
        </p>
        <div className="flex flex-wrap gap-2">
          {futureCategories.map((name) => (
            <span
              key={name}
              className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white/60"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
