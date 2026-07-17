import { prisma } from "@/lib/db";
import { MediaLibrary } from "@/components/admin/MediaLibrary";

export default async function MediaPage() {
  const media = await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  const serialized = media.map((item) => ({
    ...item,
    createdAt: item.createdAt.toISOString(),
  }));

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
        <p className="text-gray-500 text-sm mt-1">
          Upload and manage images — stored on your server, ready for posts
        </p>
      </div>

      <MediaLibrary initialMedia={serialized} />
    </div>
  );
}
