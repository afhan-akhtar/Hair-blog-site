function PlaceholderPage({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-2">{title}</h1>
      <p className="text-white/50 text-sm mb-8">{description}</p>
      <div className="bg-white/5 rounded-xl border border-white/10 p-12 text-center">
        <p className="text-white/40">This section is ready for future implementation.</p>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <PlaceholderPage
      title="Media Library"
      description="Upload and manage images, videos, and other media files."
    />
  );
}
