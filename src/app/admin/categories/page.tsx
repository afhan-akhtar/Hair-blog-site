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
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto overflow-x-hidden">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="admin-section-title">Categories</h1>
          <p className="text-gray-500 text-sm mt-1">Manage content categories with SEO settings</p>
        </div>
        <button
          type="button"
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-admin-blue text-white rounded-lg text-sm font-medium w-full sm:w-auto shrink-0"
        >
          <Plus className="w-4 h-4" /> New Category
        </button>
      </div>

      <div className="admin-card overflow-hidden mb-6">
        {/* Mobile: card list */}
        <div className="md:hidden divide-y divide-gray-100">
          {categories.map((cat) => (
            <div key={cat.id} className="p-4 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-gray-900">{cat.name}</p>
                  <p className="text-sm text-gray-500 truncate">{cat.slug}</p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full shrink-0 ${
                    cat.indexable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {cat.indexable ? "Index" : "Noindex"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <div>
                  <span className="text-gray-400 text-xs uppercase tracking-wide">Parent</span>
                  <p className="text-gray-600">{cat.parent?.name || "—"}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-xs uppercase tracking-wide">Posts</span>
                  <p className="text-gray-600">{cat._count.posts}</p>
                </div>
              </div>
              {cat.seoTitle && (
                <div>
                  <span className="text-gray-400 text-xs uppercase tracking-wide">SEO Title</span>
                  <p className="text-sm text-gray-600 line-clamp-2">{cat.seoTitle}</p>
                </div>
              )}
            </div>
          ))}
          {categories.length === 0 && (
            <p className="text-center py-12 text-gray-400">No categories yet</p>
          )}
        </div>

        {/* Desktop: table */}
        <div className="hidden md:block admin-table-wrap">
          <table className="admin-table w-full min-w-[640px]">
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
                  <td className="text-gray-600 max-w-[200px] truncate">{cat.seoTitle || "—"}</td>
                  <td>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        cat.indexable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {cat.indexable ? "Index" : "Noindex"}
                    </span>
                  </td>
                  <td className="text-gray-600">{cat._count.posts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="admin-card p-4 sm:p-5">
        <h2 className="font-semibold mb-2">Future Expansion</h2>
        <p className="text-gray-500 text-sm mb-3">
          These categories use the same system when you expand beyond hair:
        </p>
        <div className="flex flex-wrap gap-2">
          {futureCategories.map((name) => (
            <span
              key={name}
              className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
