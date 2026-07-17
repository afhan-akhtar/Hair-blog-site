"use client";

import { useState } from "react";
import {
  ContentBlock,
  BlockType,
  BLOCK_LABELS,
  BLOCK_ICONS,
  createBlock,
} from "@/lib/types";
import { GripVertical, Plus, Trash2, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlockEditorProps {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}

const BLOCK_TYPES: BlockType[] = [
  "paragraph",
  "heading2",
  "heading3",
  "heading4",
  "bulletList",
  "numberedList",
  "quote",
  "button",
  "divider",
  "table",
  "image",
  "gallery",
  "video",
  "embed",
  "html",
];

export function BlockEditor({ blocks, onChange }: BlockEditorProps) {
  const [showInserter, setShowInserter] = useState(false);
  const [insertIndex, setInsertIndex] = useState<number | null>(null);

  const updateBlock = (id: string, data: Record<string, unknown>) => {
    onChange(
      blocks.map((b) => (b.id === id ? { ...b, data: { ...b.data, ...data } } : b))
    );
  };

  const removeBlock = (id: string) => {
    onChange(blocks.filter((b) => b.id !== id));
  };

  const insertBlock = (type: BlockType, index: number) => {
    const newBlocks = [...blocks];
    newBlocks.splice(index, 0, createBlock(type));
    onChange(newBlocks);
    setShowInserter(false);
    setInsertIndex(null);
  };

  const moveBlock = (from: number, to: number) => {
    if (to < 0 || to >= blocks.length) return;
    const newBlocks = [...blocks];
    const [moved] = newBlocks.splice(from, 1);
    newBlocks.splice(to, 0, moved);
    onChange(newBlocks);
  };

  return (
    <div className="block-editor space-y-2">
      <InserterButton
        onClick={() => {
          setInsertIndex(0);
          setShowInserter(true);
        }}
      />

      {blocks.map((block, index) => (
        <div key={block.id}>
          <BlockItem
            block={block}
            onUpdate={(data) => updateBlock(block.id, data)}
            onRemove={() => removeBlock(block.id)}
            onMoveUp={() => moveBlock(index, index - 1)}
            onMoveDown={() => moveBlock(index, index + 1)}
            isFirst={index === 0}
            isLast={index === blocks.length - 1}
          />
          <InserterButton
            onClick={() => {
              setInsertIndex(index + 1);
              setShowInserter(true);
            }}
          />

          {showInserter && insertIndex === index + 1 && (
            <BlockInserter
              onSelect={(type) => insertBlock(type, index + 1)}
              onClose={() => {
                setShowInserter(false);
                setInsertIndex(null);
              }}
            />
          )}
        </div>
      ))}

      {showInserter && insertIndex === 0 && (
        <BlockInserter
          onSelect={(type) => insertBlock(type, 0)}
          onClose={() => {
            setShowInserter(false);
            setInsertIndex(null);
          }}
        />
      )}

      {blocks.length === 0 && !showInserter && (
        <div className="text-center py-16 text-white/40">
          <p className="mb-4">Start writing by adding a block</p>
          <button
            onClick={() => {
              setInsertIndex(0);
              setShowInserter(true);
            }}
            className="px-4 py-2 bg-plum text-white rounded-lg text-sm"
          >
            Add Block
          </button>
        </div>
      )}
    </div>
  );
}

function InserterButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full py-1 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity group"
    >
      <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-plum/80 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
        <Plus className="w-3 h-3" /> Add block
      </span>
    </button>
  );
}

function BlockInserter({
  onSelect,
  onClose,
}: {
  onSelect: (type: BlockType) => void;
  onClose: () => void;
}) {
  return (
    <div className="bg-white/10 rounded-xl border border-white/20 p-4 my-2">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-white/70">Add a block</span>
        <button onClick={onClose} className="text-white/40 hover:text-white text-sm">
          Cancel
        </button>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
        {BLOCK_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => onSelect(type)}
            className="flex flex-col items-center gap-1.5 p-3 rounded-lg hover:bg-white/10 transition-colors text-center"
          >
            <span className="text-lg">{BLOCK_ICONS[type]}</span>
            <span className="text-xs text-white/70">{BLOCK_LABELS[type]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function BlockItem({
  block,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: {
  block: ContentBlock;
  onUpdate: (data: Record<string, unknown>) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div
      className={cn(
        "group relative rounded-lg border transition-colors",
        focused ? "border-plum/50 bg-white/5" : "border-transparent hover:border-white/10"
      )}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-0.5 cursor-grab text-white/30">
          <GripVertical className="w-4 h-4" />
        </button>
      </div>

      <div className="absolute right-2 top-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {!isFirst && (
          <button onClick={onMoveUp} className="p-1 rounded hover:bg-white/10 text-xs text-white/50">
            ↑
          </button>
        )}
        {!isLast && (
          <button onClick={onMoveDown} className="p-1 rounded hover:bg-white/10 text-xs text-white/50">
            ↓
          </button>
        )}
        <button onClick={onRemove} className="p-1 rounded hover:bg-red-500/20 text-red-400">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="px-10 py-4">
        <span className="text-xs text-white/30 uppercase tracking-wider mb-2 block">
          {BLOCK_LABELS[block.type]}
        </span>
        <BlockFields block={block} onUpdate={onUpdate} />
      </div>
    </div>
  );
}

function BlockFields({
  block,
  onUpdate,
}: {
  block: ContentBlock;
  onUpdate: (data: Record<string, unknown>) => void;
}) {
  const { type, data } = block;

  switch (type) {
    case "paragraph":
      return (
        <textarea
          value={(data.text as string) || ""}
          onChange={(e) => onUpdate({ text: e.target.value })}
          placeholder="Start writing..."
          className="text-white text-base leading-relaxed min-h-[60px]"
          rows={3}
        />
      );

    case "heading2":
    case "heading3":
    case "heading4":
      return (
        <input
          type="text"
          value={(data.text as string) || ""}
          onChange={(e) => onUpdate({ text: e.target.value })}
          placeholder="Heading text"
          className={cn(
            "text-white font-bold",
            type === "heading2" && "text-2xl",
            type === "heading3" && "text-xl",
            type === "heading4" && "text-lg"
          )}
        />
      );

    case "bulletList":
    case "numberedList":
      return (
        <ListEditor
          items={(data.items as string[]) || [""]}
          onChange={(items) => onUpdate({ items })}
          ordered={type === "numberedList"}
        />
      );

    case "quote":
      return (
        <div className="space-y-2">
          <textarea
            value={(data.text as string) || ""}
            onChange={(e) => onUpdate({ text: e.target.value })}
            placeholder="Quote text..."
            className="text-white italic text-lg border-l-4 border-plum pl-4"
            rows={2}
          />
          <input
            type="text"
            value={(data.citation as string) || ""}
            onChange={(e) => onUpdate({ citation: e.target.value })}
            placeholder="Citation (optional)"
            className="text-white/50 text-sm"
          />
        </div>
      );

    case "button":
      return (
        <div className="flex gap-3 items-center">
          <input
            type="text"
            value={(data.text as string) || ""}
            onChange={(e) => onUpdate({ text: e.target.value })}
            placeholder="Button text"
            className="text-white flex-1"
          />
          <input
            type="text"
            value={(data.url as string) || ""}
            onChange={(e) => onUpdate({ url: e.target.value })}
            placeholder="URL"
            className="text-white/70 flex-1 text-sm"
          />
        </div>
      );

    case "divider":
      return <hr className="border-white/20" />;

    case "table":
      return (
        <TableEditor
          headers={(data.headers as string[]) || ["Column 1", "Column 2"]}
          rows={(data.rows as string[][]) || [["", ""]]}
          onChange={(headers, rows) => onUpdate({ headers, rows })}
        />
      );

    case "image":
      return (
        <div className="space-y-2">
          <input
            type="text"
            value={(data.src as string) || ""}
            onChange={(e) => onUpdate({ src: e.target.value })}
            placeholder="Image URL"
            className="text-white/70 text-sm w-full"
          />
          <input
            type="text"
            value={(data.alt as string) || ""}
            onChange={(e) => onUpdate({ alt: e.target.value })}
            placeholder="Alt text"
            className="text-white/70 text-sm w-full"
          />
          <input
            type="text"
            value={(data.caption as string) || ""}
            onChange={(e) => onUpdate({ caption: e.target.value })}
            placeholder="Caption (optional)"
            className="text-white/50 text-sm w-full"
          />
          {data.src && (
            <img
              src={data.src as string}
              alt={(data.alt as string) || ""}
              className="rounded-lg max-h-48 object-cover"
            />
          )}
        </div>
      );

    case "gallery":
      return (
        <div className="space-y-2">
          {((data.images as { src: string; alt: string }[]) || []).map((img, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={img.src}
                onChange={(e) => {
                  const images = [...(data.images as { src: string; alt: string }[])];
                  images[i] = { ...images[i], src: e.target.value };
                  onUpdate({ images });
                }}
                placeholder="Image URL"
                className="text-white/70 text-sm flex-1"
              />
            </div>
          ))}
          <button
            onClick={() =>
              onUpdate({
                images: [
                  ...((data.images as { src: string; alt: string }[]) || []),
                  { src: "", alt: "" },
                ],
              })
            }
            className="text-sm text-plum hover:text-white transition-colors"
          >
            + Add image
          </button>
        </div>
      );

    case "video":
      return (
        <div className="space-y-2">
          <input
            type="text"
            value={(data.url as string) || ""}
            onChange={(e) => onUpdate({ url: e.target.value })}
            placeholder="Video embed URL"
            className="text-white/70 text-sm w-full"
          />
          <input
            type="text"
            value={(data.caption as string) || ""}
            onChange={(e) => onUpdate({ caption: e.target.value })}
            placeholder="Caption (optional)"
            className="text-white/50 text-sm w-full"
          />
        </div>
      );

    case "embed":
      return (
        <textarea
          value={(data.url as string) || ""}
          onChange={(e) => onUpdate({ url: e.target.value })}
          placeholder="Paste embed code or URL..."
          className="text-white/70 text-sm w-full font-mono"
          rows={3}
        />
      );

    case "html":
      return (
        <textarea
          value={(data.code as string) || ""}
          onChange={(e) => onUpdate({ code: e.target.value })}
          placeholder="Custom HTML code..."
          className="text-white/70 text-sm w-full font-mono"
          rows={5}
        />
      );

    default:
      return null;
  }
}

function ListEditor({
  items,
  onChange,
  ordered,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  ordered: boolean;
}) {
  return (
    <div className="space-y-1">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="text-white/30 w-4 text-sm">{ordered ? `${i + 1}.` : "•"}</span>
          <input
            type="text"
            value={item}
            onChange={(e) => {
              const newItems = [...items];
              newItems[i] = e.target.value;
              onChange(newItems);
            }}
            placeholder="List item"
            className="text-white flex-1"
          />
          <button
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            className="text-white/30 hover:text-red-400"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      ))}
      <button
        onClick={() => onChange([...items, ""])}
        className="text-sm text-plum hover:text-white transition-colors ml-6"
      >
        + Add item
      </button>
    </div>
  );
}

function TableEditor({
  headers,
  rows,
  onChange,
}: {
  headers: string[];
  rows: string[][];
  onChange: (headers: string[], rows: string[][]) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="p-1">
                <input
                  type="text"
                  value={h}
                  onChange={(e) => {
                    const newHeaders = [...headers];
                    newHeaders[i] = e.target.value;
                    onChange(newHeaders, rows);
                  }}
                  className="text-white font-semibold bg-white/5 rounded px-2 py-1 w-full"
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci} className="p-1">
                  <input
                    type="text"
                    value={cell}
                    onChange={(e) => {
                      const newRows = rows.map((r) => [...r]);
                      newRows[ri][ci] = e.target.value;
                      onChange(headers, newRows);
                    }}
                    className="text-white/70 bg-white/5 rounded px-2 py-1 w-full"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={() => onChange(headers, [...rows, headers.map(() => "")])}
        className="text-sm text-plum hover:text-white mt-2 transition-colors"
      >
        + Add row
      </button>
    </div>
  );
}
