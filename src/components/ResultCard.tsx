"use client";

import Image from "next/image";
import type { DiagnosisResult } from "@/lib/types";

interface ResultCardProps {
  result: DiagnosisResult;
  label?: string;
}

const AXIS_LABELS: Record<string, { left: string; right: string; leftCode: string }> = {
  行動様式: { left: "風",  right: "岩", leftCode: "F" },
  対人距離: { left: "野",  right: "林", leftCode: "Y" },
  感情表現: { left: "火",  right: "氷", leftCode: "K" },
  価値基準: { left: "月",  right: "山", leftCode: "T" },
};

export default function ResultCard({ result, label }: ResultCardProps) {
  const imagePath = `/types/${result.typeCode}(${result.typeName}).png`;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-mirror-100">
      {label && (
        <p className="text-xs text-mirror-400 font-medium mb-4 uppercase tracking-widest">
          {label}
        </p>
      )}

      <div className="flex flex-col items-center gap-4">
        {/* タイプ画像 */}
        <div className="w-28 h-28 rounded-full bg-mirror-50 flex items-center justify-center overflow-hidden border-2 border-mirror-200">
          <Image
            src={imagePath}
            alt={result.typeName}
            width={112}
            height={112}
            className="object-cover"
            onError={() => {}} // 画像がない場合は無視
          />
        </div>

        {/* タイプコード・名前 */}
        <div className="text-center">
          <p className="text-3xl font-bold text-mirror-700 tracking-widest">
            {result.typeCode}
          </p>
          <p className="text-mirror-400 text-sm mt-1">{result.kanjiCode}</p>
          <p className="text-2xl font-semibold text-mirror-900 mt-2">
            {result.typeName}
          </p>
        </div>

        {/* 軸スコアバー */}
        <div className="w-full flex flex-col gap-3 mt-2">
          {Object.entries(result.scores).map(([axis, score]) => {
            const labels = AXIS_LABELS[axis];
            const isLeft = score.code === labels.leftCode;
            const barWidth = isLeft ? score.normalized : 100 - score.normalized;

            return (
              <div key={axis} className="flex flex-col gap-1">
                <div className="flex justify-between text-xs text-mirror-500">
                  <span>{labels.left}（{score.code === labels.leftCode ? score.code : ""}）</span>
                  <span className="text-mirror-300">{axis}</span>
                  <span>{labels.right}（{score.code !== labels.leftCode ? score.code : ""}）</span>
                </div>
                <div className="w-full bg-mirror-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full bg-mirror-500 transition-all duration-500 ${
                      isLeft ? "" : "ml-auto"
                    }`}
                    style={{ width: `${Math.max(barWidth, 10)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
