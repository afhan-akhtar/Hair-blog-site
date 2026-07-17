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
          {(data.citation as string) && (
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
          {(data.src as string) && (
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden">
              <Image
                src={data.src as string}
                alt={(data.alt as string) || ""}
                fill
                className="object-cover"
              />
            </div>
          )}
          {(data.caption as string) && (
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
          {(data.url as string) && (
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black">
              <iframe
                src={data.url as string}
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          )}
          {(data.caption as string) && (
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

    case "quickAnswer":
      return (
        <div className="quick-answer">
          <p className="font-semibold text-admin-blue mb-2">{(data.question as string)}</p>
          <p>{(data.answer as string)}</p>
        </div>
      );

    case "stylistTip":
      return (
        <div className="stylist-tip">
          <p className="italic">{data.tip as string}</p>
          {(data.stylistName as string) && <p className="text-sm text-gray-500 mt-2">— {data.stylistName as string}</p>}
        </div>
      );

    case "faq":
      return (
        <div className="space-y-4 my-6">
          {((data.items as { question: string; answer: string }[]) || []).map((item, i) => (
            <details key={i} className="border border-gray-200 rounded-lg p-4">
              <summary className="font-semibold cursor-pointer">{item.question}</summary>
              <p className="mt-2 text-gray-600">{item.answer}</p>
            </details>
          ))}
        </div>
      );

    case "prosCons":
      return (
        <div className="my-6">
          {(data.title as string) && <h3 className="font-serif text-xl font-bold mb-4">{data.title as string}</h3>}
          <div className="pros-cons">
            <div className="pros">
              <h4 className="font-semibold text-green-700 mb-2">Pros</h4>
              <ul>{((data.pros as string[]) || []).map((p, i) => <li key={i}>{p}</li>)}</ul>
            </div>
            <div className="cons">
              <h4 className="font-semibold text-red-700 mb-2">Cons</h4>
              <ul>{((data.cons as string[]) || []).map((c, i) => <li key={i}>{c}</li>)}</ul>
            </div>
          </div>
        </div>
      );

    case "productRecommendation":
      return (
        <div className="flex gap-4 border border-gray-200 rounded-xl p-4 my-6">
          {(data.image as string) && (
            <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
              <Image src={data.image as string} alt={data.name as string} fill className="object-cover" />
            </div>
          )}
          <div>
            <h4 className="font-semibold">{data.name as string}</h4>
            <p className="text-sm text-gray-600 mt-1">{data.description as string}</p>
            {(data.price as string) && <p className="text-sm font-medium mt-2">{data.price as string}</p>}
            {(data.url as string) && <a href={data.url as string} className="text-sm text-admin-blue hover:underline mt-1 inline-block">View Product</a>}
          </div>
        </div>
      );

    case "hairstyleCard":
      return (
        <div className="border border-gray-200 rounded-xl overflow-hidden my-6">
          {(data.image as string) && (
            <div className="relative aspect-[16/10]">
              <Image src={data.image as string} alt={data.title as string} fill className="object-cover" />
            </div>
          )}
          <div className="p-4">
            <h4 className="font-serif text-lg font-bold">{data.title as string}</h4>
            <p className="text-sm text-gray-600 mt-1">{data.description as string}</p>
            <div className="flex gap-3 mt-2 text-xs text-gray-500">
              <span>{data.difficulty as string}</span>
              <span>·</span>
              <span>{data.time as string}</span>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}
