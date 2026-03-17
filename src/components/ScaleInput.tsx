"use client";

interface ScaleInputProps {
  value: number | null;
  onChange: (value: number) => void;
}

const DOTS = [1, 2, 3, 4, 5];

// 中心からの距離に応じてサイズと色の濃さを決定
const DOT_STYLES: Record<number, { size: string; opacity: string }> = {
  1: { size: "w-6 h-6", opacity: "opacity-100" },
  2: { size: "w-5 h-5", opacity: "opacity-70" },
  3: { size: "w-3 h-3", opacity: "opacity-30" },
  4: { size: "w-5 h-5", opacity: "opacity-70" },
  5: { size: "w-6 h-6", opacity: "opacity-100" },
};

export default function ScaleInput({ value, onChange }: ScaleInputProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-4">
        {DOTS.map((dot) => {
          const { size, opacity } = DOT_STYLES[dot];
          const isSelected = value === dot;

          return (
            <button
              key={dot}
              type="button"
              onClick={() => onChange(dot)}
              className={[
                "rounded-full transition-all duration-150",
                size,
                opacity,
                isSelected
                  ? "bg-mirror-600 ring-2 ring-mirror-400 ring-offset-2 scale-110"
                  : "bg-mirror-400 hover:bg-mirror-500 hover:scale-105",
              ].join(" ")}
              aria-label={`${dot}`}
            />
          );
        })}
      </div>
      <div className="flex w-full justify-between text-xs text-mirror-400 font-medium px-1">
        <span>いいえ</span>
        <span>はい</span>
      </div>
    </div>
  );
}
