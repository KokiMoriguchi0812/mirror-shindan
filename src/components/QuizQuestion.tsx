"use client";

import ScaleInput from "./ScaleInput";

interface QuizQuestionProps {
  questionNumber: number;
  total: number;
  text: string;
  value: number | null;
  onChange: (value: number) => void;
}

export default function QuizQuestion({
  questionNumber,
  total,
  text,
  value,
  onChange,
}: QuizQuestionProps) {
  return (
    <div className="flex flex-col gap-8">
      {/* 進捗 */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-sm text-mirror-400">
          <span>Q{questionNumber} / {total}</span>
          <span>{Math.round((questionNumber / total) * 100)}%</span>
        </div>
        <div className="w-full bg-mirror-100 rounded-full h-1.5">
          <div
            className="bg-mirror-500 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${(questionNumber / total) * 100}%` }}
          />
        </div>
      </div>

      {/* 質問文 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-mirror-100 min-h-[100px] flex items-center">
        <p className="text-mirror-900 text-lg leading-relaxed text-center w-full">
          {text}
        </p>
      </div>

      {/* スケール */}
      <ScaleInput value={value} onChange={onChange} />
    </div>
  );
}
