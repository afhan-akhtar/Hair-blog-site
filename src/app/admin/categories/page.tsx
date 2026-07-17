import { prisma } from "@/lib/db";
import { Plus } from "lucide-react";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { posts: true } },
      parent: { select: { name: true } },
    },
    orderBy: { name: "asc" },
  });

  const futureCategories = ["Skincare", "Outfits", "Nails", "Makeup", "Beauty"];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="admin-section-title">Categories</h1>
          <p className="text-gray-500 text-sm mt-1">Manage content categories with SEO settings</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-admin-blue text-white rounded-lg text-sm font-medium">
          <Plus className="w-4 h-4" /> New Category
        </button>
      </div>

      <div className="admin-card overflow-hidden mb-6">
        <table className="admin-table w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Slug</th>
              <th>Parent</th>
              <th>SEO Title</th>
              <th>Indexable</th>
              <th>Posts</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td className="font-medium">{cat.name}</td>
                <td className="text-gray-600">{cat.slug}</td>
                <td className="text-gray-600">{cat.parent?.name || "—"}</td>
                <td className="text-gray-600">{cat.seoTitle || "—"}</td>
                <td>
                  <span className={`text-xs px-2 py-1 rounded-full ${cat.indexable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {cat.indexable ? "Index" : "Noindex"}
                  </span>
                </td>
                <td className="text-gray-600">{cat._count.posts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-card p-5">
        <h2 className="font-semibold mb-2">Future Expansion</h2>
        <p className="text-gray-500 text-sm mb-3">These categories use the same system when you expand beyond hair:</p>
        <div className="flex flex-wrap gap-2">
          {futureCategories.map((name) => (
            <span key={name} className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">{name}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
