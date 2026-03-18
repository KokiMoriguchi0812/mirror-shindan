"use client";

import Image from "next/image";
import type { DiagnosisResult, AxisName } from "@/lib/types";

interface ResultCardProps {
  result: DiagnosisResult;
  label?: string;
}

const AXIS_LABELS: Record<AxisName, {
  left: string; right: string; leftCode: string; rightCode: string;
  leftFeature: string; rightFeature: string;
}> = {
  行動様式: { left: "風", right: "岩", leftCode: "F", rightCode: "G", leftFeature: "即断即行", rightFeature: "熟考慎重" },
  対人距離: { left: "野", right: "林", leftCode: "Y", rightCode: "R", leftFeature: "社交開放", rightFeature: "内向静穏" },
  感情表現: { left: "火", right: "氷", leftCode: "K", rightCode: "H", leftFeature: "感情発露", rightFeature: "冷静沈着" },
  価値基準: { left: "月", right: "山", leftCode: "T", rightCode: "S", leftFeature: "共感重視", rightFeature: "論理重視" },
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

      <div className="flex flex-col items-center gap-5">
        {/* タイプ画像 */}
        <div className="w-28 h-28 rounded-full bg-mirror-50 flex items-center justify-center overflow-hidden border-2 border-mirror-200">
          <Image
            src={imagePath}
            alt={result.typeName}
            width={112}
            height={112}
            className="object-cover"
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
        <div className="w-full flex flex-col gap-4 mt-1">
          {(Object.entries(result.scores) as [AxisName, typeof result.scores[AxisName]][]).map(([axis, score]) => {
            const labels = AXIS_LABELS[axis];
            const isLeft = score.code === labels.leftCode;
            const barWidth = isLeft ? score.normalized : 100 - score.normalized;

            return (
              <div key={axis} className="flex flex-col gap-1.5">
                {/* 特徴テキスト（上部） */}
                <div className="flex justify-between text-xs text-mirror-400">
                  <span>{labels.leftFeature}</span>
                  <span className="text-mirror-300">{axis}</span>
                  <span>{labels.rightFeature}</span>
                </div>
                {/* ゲージ（漢字+コードを真横に表示） */}
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold w-12 shrink-0 ${isLeft ? "text-mirror-700" : "text-mirror-300"}`}>
                    {labels.left}({labels.leftCode})
                  </span>
                  <div className="flex-1 bg-mirror-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full bg-mirror-500 transition-all duration-500 ${isLeft ? "" : "ml-auto"}`}
                      style={{ width: `${Math.max(barWidth, 10)}%` }}
                    />
                  </div>
                  <span className={`text-xs font-bold w-12 shrink-0 text-right ${!isLeft ? "text-mirror-700" : "text-mirror-300"}`}>
                    {labels.right}({labels.rightCode})
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
