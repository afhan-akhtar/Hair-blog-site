import Image from "next/image";

interface HeroMediaProps {
  src: string;
  alt: string;
  priority?: boolean;
  sizes: string;
  position?: "center" | "top";
}

export function HeroMedia({
  src,
  alt,
  priority = false,
  sizes,
  position = "center",
}: HeroMediaProps) {
  return (
    <div className="absolute inset-0 bg-beige">
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          unoptimized={src.startsWith("/uploads")}
          className={`object-cover zoom-target ${
            position === "top" ? "object-top" : "object-center"
          }`}
        />
      ) : null}
    </div>
  );
}
