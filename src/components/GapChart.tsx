import type { GapInfo } from "@/lib/types";

interface GapChartProps {
  gaps: GapInfo[];
  title?: string;
  noGapMessage?: string;
}

const AXIS_EMOJI: Record<string, string> = {
  行動様式: "⚡",
  対人距離: "🌿",
  感情表現: "🔥",
  価値基準: "⚖️",
};

export default function GapChart({
  gaps,
  title = "自己像 vs 他者像のギャップ",
  noGapMessage = "自己像と他者像がほぼ一致しています ✨",
}: GapChartProps) {
  const hasAnyGap = gaps.some((g) => g.hasGap);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-mirror-100">
      <h3 className="text-mirror-700 font-semibold mb-4">
        {title}
      </h3>

      <div className="flex flex-col gap-4">
        {gaps.map((gap) => (
          <div key={gap.axis}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-mirror-600 flex items-center gap-1">
                {AXIS_EMOJI[gap.axis]} {gap.axis}
              </span>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-mirror-700 font-mono font-bold">{gap.selfCode}</span>
                <span className="text-mirror-300">→</span>
                <span className="text-mirror-500 font-mono font-bold">{gap.friendCode}</span>
                {gap.hasGap && (
                  <span className="text-amber-500 text-xs font-medium bg-amber-50 px-2 py-0.5 rounded-full">
                    ギャップあり
                  </span>
                )}
              </div>
            </div>

            {gap.hasGap && gap.message && (
              <p className="text-sm text-mirror-600 bg-mirror-50 rounded-xl p-3 leading-relaxed mt-1">
                {gap.message}
              </p>
            )}
          </div>
        ))}
      </div>

      {!hasAnyGap && (
        <p className="text-center text-mirror-400 text-sm mt-2">
          {noGapMessage}
        </p>
      )}
    </div>
  );
}
