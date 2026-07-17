import { ContentBlock } from "@/lib/types";
import Image from "next/image";

export function BlockRenderer({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="article-prose">
      {blocks.map((block) => (
        <Block key={block.id} block={block} />
      ))}
    </div>
  );
}

function Block({ block }: { block: ContentBlock }) {
  const { type, data } = block;

  switch (type) {
    case "paragraph":
      return <p>{data.text as string}</p>;

    case "heading2":
      return <h2>{data.text as string}</h2>;

    case "heading3":
      return <h3>{data.text as string}</h3>;

    case "heading4":
      return <h4>{data.text as string}</h4>;

    case "bulletList":
      return (
        <ul>
          {(data.items as string[]).map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );

    case "numberedList":
      return (
        <ol>
          {(data.items as string[]).map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      );

    case "quote":
      return (
        <blockquote>
          <p>{data.text as string}</p>
          {data.citation && (
            <cite className="block mt-2 text-sm not-italic text-gray-500">
              — {data.citation as string}
            </cite>
          )}
        </blockquote>
      );

    case "button":
      return (
        <a
          href={data.url as string}
          className={`inline-block px-6 py-3 rounded-lg font-medium transition-colors ${
            data.style === "primary"
              ? "bg-terracotta text-white hover:bg-plum"
              : "border border-plum text-plum hover:bg-plum hover:text-white"
          }`}
        >
          {data.text as string}
        </a>
      );

    case "divider":
      return <hr />;

    case "table":
      return (
        <table>
          <thead>
            <tr>
              {(data.headers as string[]).map((h, i) => (
                <th key={i}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(data.rows as string[][]).map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );

    case "image":
      return (
        <figure>
          {data.src && (
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden">
              <Image
                src={data.src as string}
                alt={(data.alt as string) || ""}
                fill
                className="object-cover"
              />
            </div>
          )}
          {data.caption && (
            <figcaption className="text-sm text-gray-500 mt-2 text-center">
              {data.caption as string}
            </figcaption>
          )}
        </figure>
      );

    case "gallery":
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {(data.images as { src: string; alt: string }[]).map((img, i) => (
            <div key={i} className="relative aspect-square rounded-xl overflow-hidden">
              {img.src && (
                <Image src={img.src} alt={img.alt || ""} fill className="object-cover" />
              )}
            </div>
          ))}
        </div>
      );

    case "video":
      return (
        <figure>
          {data.url && (
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black">
              <iframe
                src={data.url as string}
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          )}
          {data.caption && (
            <figcaption className="text-sm text-gray-500 mt-2 text-center">
              {data.caption as string}
            </figcaption>
          )}
        </figure>
      );

    case "embed":
      return (
        <div
          className="rounded-2xl overflow-hidden"
          dangerouslySetInnerHTML={{ __html: data.url as string }}
        />
      );

    case "html":
      return (
        <div dangerouslySetInnerHTML={{ __html: data.code as string }} />
      );

    default:
      return null;
  }
}
