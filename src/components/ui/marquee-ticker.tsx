"use client";

import { SparkleIcon } from "@phosphor-icons/react";

export function MarqueeTicker() {
  const items = [
    "WELCOME TO ARCANAVERSE",
    "DO TAROT ANYWHERE",
    "INTERACTIVE DIGITAL DECKS",
    "21ST CENTURY TAROT PRACTICE",
    "EXPAND YOUR INTUITION",
  ];

  return (
    <div className="relative overflow-hidden border-y-2 border-black bg-purple-200 py-2.5 text-black">
      <div className="flex w-max animate-[marquee_25s_linear_infinite] whitespace-nowrap">
        {Array.from({ length: 4 }).flatMap(() => items).map((text, idx) => (
          <div key={idx} className="flex items-center gap-6 px-4 font-editorial text-sm font-bold tracking-widest">
            <span>{text}</span>
            <SparkleIcon size={14} weight="bold" className="text-black" />
          </div>
        ))}
      </div>
    </div>
  );
}
