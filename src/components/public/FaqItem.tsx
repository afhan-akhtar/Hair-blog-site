"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-black/5">
      <button
        className="flex items-center justify-between w-full py-5 text-left gap-4"
        onClick={() => setOpen(!open)}
      >
        <span className="font-medium text-charcoal">{q}</span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-gray-400 flex-shrink-0 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <p className="text-sm text-gray-500 leading-relaxed pb-5 -mt-1">{a}</p>
      )}
    </div>
  );
}
