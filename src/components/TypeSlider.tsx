"use client";

import { useState } from "react";
import Image from "next/image";
import { TYPE_NAMES } from "@/lib/scoring";

const TYPES = Object.entries(TYPE_NAMES).map(([code, info]) => ({
  code,
  name: info.name,
  kanji: info.kanji,
  description: info.description,
}));

export default function TypeSlider() {
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((i) => (i - 1 + TYPES.length) % TYPES.length);
  const next = () => setIndex((i) => (i + 1) % TYPES.length);

  const current = TYPES[index];
  const imagePath = `/types/${current.code}(${current.name}).png`;

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div className="flex items-center gap-2 w-full">
        {/* 左矢印 */}
        <button
          onClick={prev}
          className="w-9 h-9 shrink-0 rounded-full bg-mirror-100 hover:bg-mirror-200 text-mirror-600 flex items-center justify-center transition-colors text-lg font-bold"
          aria-label="前のタイプ"
        >
          ‹
        </button>

        {/* カード */}
        <div className="flex-1 bg-white rounded-2xl border border-mirror-100 shadow-sm p-5 flex flex-col items-center gap-3">
          <div className="w-20 h-20 rounded-full bg-mirror-50 border-2 border-mirror-200 overflow-hidden">
            <Image
              src={imagePath}
              alt={current.name}
              width={80}
              height={80}
              className="object-cover"
            />
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-mirror-700 tracking-widest">{current.code}</p>
            <p className="text-mirror-400 text-xs mt-0.5">{current.kanji}</p>
            <p className="text-mirror-900 font-semibold mt-1">{current.name}</p>
            <p className="text-mirror-500 text-sm mt-1">{current.description}</p>
          </div>
        </div>

        {/* 右矢印 */}
        <button
          onClick={next}
          className="w-9 h-9 shrink-0 rounded-full bg-mirror-100 hover:bg-mirror-200 text-mirror-600 flex items-center justify-center transition-colors text-lg font-bold"
          aria-label="次のタイプ"
        >
          ›
        </button>
      </div>

      {/* インジケーター */}
      <div className="flex gap-1">
        {TYPES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${
              i === index ? "bg-mirror-500" : "bg-mirror-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
