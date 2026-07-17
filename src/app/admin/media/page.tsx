import { prisma } from "@/lib/db";
import Image from "next/image";
import { Upload, Grid, List } from "lucide-react";

export default async function MediaPage() {
  const media = await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
    take: 24,
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="admin-section-title">Media Library</h1>
          <p className="text-gray-500 text-sm mt-1">Upload and manage images for posts</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-admin-blue text-white rounded-lg text-sm font-medium">
          <Upload className="w-4 h-4" /> Upload
        </button>
      </div>

      <div className="admin-card p-4 mb-4 flex gap-3 items-center">
        <input type="text" placeholder="Search media..." className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
        <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"><Grid className="w-4 h-4" /></button>
        <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"><List className="w-4 h-4" /></button>
      </div>

      {media.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {media.map((item) => (
            <div key={item.id} className="admin-card overflow-hidden group cursor-pointer">
              <div className="relative aspect-square">
                <Image src={item.url} alt={item.alt || ""} fill className="object-cover" />
              </div>
              <div className="p-2">
                <p className="text-xs truncate text-gray-600">{item.filename}</p>
                {!item.alt && <p className="text-xs text-amber-600">Missing alt text</p>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="admin-card p-16 text-center">
          <Upload className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No media uploaded yet. Upload your first image.</p>
        </div>
      )}
    </div>
  );
}
