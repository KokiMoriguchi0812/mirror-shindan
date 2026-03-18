"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import ScaleInput from "@/components/ScaleInput";
import { QUESTIONS, AXES } from "@/lib/questions";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";

const AXIS_LABELS: Record<string, { icon: string; desc: string }> = {
  行動様式: { icon: "⚡", desc: "行動のスピード・決断スタイル" },
  対人距離: { icon: "🌿", desc: "人との関わり方・社交性" },
  感情表現: { icon: "🔥", desc: "感情の出し方・表現スタイル" },
  価値基準: { icon: "⚖️", desc: "判断・価値観の基準" },
};

function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export default function QuizPage() {
  const router = useRouter();
  const { session } = useAuth();

  // 各軸の問題をシャッフル（マウント時に一度だけ）
  const shuffledQuestions = useMemo(() => {
    const result: typeof QUESTIONS = [];
    for (const axis of AXES) {
      const axisQs = QUESTIONS.filter((q) => q.axis === axis);
      result.push(...shuffleArray(axisQs));
    }
    return result;
  }, []);

  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(QUESTIONS.length).fill(null)
  );
  const [axisIndex, setAxisIndex] = useState(0);
  const [resultToken, setResultToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentAxis = AXES[axisIndex];
  const axisQuestions = shuffledQuestions.filter((q) => q.axis === currentAxis);
  const isLastAxis = axisIndex === AXES.length - 1;
  const allAnswered = answers.every((a) => a !== null);

  // セッション作成（初回レンダリング後に実行）
  useEffect(() => {
    fetch("/api/sessions", { method: "POST" })
      .then((r) => r.json())
      .then((data) => {
        setResultToken(data.result_token);
        localStorage.setItem("friend_token", data.friend_token ?? "");
      });
  }, []);

  const handleAnswer = (questionId: number, value: number) => {
    const newAnswers = [...answers];
    newAnswers[questionId - 1] = value;
    setAnswers(newAnswers);
  };

  const scrollTop = () => setTimeout(() => window.scrollTo({ top: 0, behavior: "instant" }), 0);

  const handleAxisJump = (i: number) => {
    setAxisIndex(i);
    scrollTop();
  };

  const handlePrev = () => {
    if (axisIndex > 0) {
      setAxisIndex((i) => i - 1);
      scrollTop();
    }
  };

  const handleNext = () => {
    if (axisIndex < AXES.length - 1) {
      setAxisIndex((i) => i + 1);
      scrollTop();
    }
  };

  const handleSubmit = async () => {
    if (!resultToken || isSubmitting || !allAnswered) return;
    setIsSubmitting(true);

    const accessToken = session?.access_token;
    await fetch(`/api/sessions/${resultToken}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify({ answers }),
    });

    router.push(`/result/${resultToken}`);
  };

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="max-w-md mx-auto flex flex-col gap-6">

        {/* プログレス */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-mirror-400">
              STEP {axisIndex + 1} / {AXES.length}
            </span>
            <span className="flex gap-2 flex-wrap justify-end">
              {AXES.map((a, i) => (
                <button
                  key={a}
                  onClick={() => handleAxisJump(i)}
                  className={`text-xs transition-colors ${
                    i < axisIndex
                      ? "text-mirror-600 hover:text-mirror-800"
                      : i === axisIndex
                      ? "text-mirror-800 font-bold"
                      : "text-mirror-300 hover:text-mirror-500"
                  }`}
                >
                  {a}
                </button>
              ))}
            </span>
          </div>
          <div className="w-full bg-mirror-100 rounded-full h-1.5">
            <div
              className="bg-mirror-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${((axisIndex + 1) / AXES.length) * 100}%` }}
            />
          </div>
        </div>

        {/* 軸タイトル */}
        <div className="bg-mirror-50 rounded-2xl p-4 border border-mirror-100">
          <p className="text-2xl font-bold text-mirror-800 flex items-center gap-2">
            {AXIS_LABELS[currentAxis].icon} {currentAxis}
          </p>
          <p className="text-mirror-500 text-sm mt-1">
            {AXIS_LABELS[currentAxis].desc}
          </p>
        </div>

        {/* 8問リスト */}
        <div className="flex flex-col gap-5">
          {axisQuestions.map((q, i) => {
            const currentAnswer = answers[q.id - 1];
            return (
              <div
                key={q.id}
                className="bg-white rounded-2xl p-5 border border-mirror-100 shadow-sm flex flex-col gap-4"
              >
                <p className="text-xs text-mirror-400 font-medium">Q{i + 1}</p>
                <p className="text-mirror-800 text-sm leading-relaxed font-medium">
                  {q.text}
                </p>
                <ScaleInput
                  value={currentAnswer}
                  onChange={(v) => handleAnswer(q.id, v)}
                />
              </div>
            );
          })}
        </div>

        {/* 前へ / 次へ / 送信ボタン */}
        <div className="pb-8 flex gap-3">
          {axisIndex > 0 && (
            <button
              onClick={handlePrev}
              className="flex-1 bg-mirror-100 hover:bg-mirror-200 text-mirror-700 font-semibold py-4 rounded-2xl transition-colors"
            >
              ← 前へ
            </button>
          )}
          {isLastAxis ? (
            <button
              onClick={handleSubmit}
              disabled={!allAnswered || isSubmitting}
              className="flex-1 bg-mirror-600 hover:bg-mirror-700 disabled:opacity-40 text-white font-semibold py-4 rounded-2xl transition-colors"
            >
              {isSubmitting ? "送信中..." : "診断結果を見る →"}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex-1 bg-mirror-600 hover:bg-mirror-700 text-white font-semibold py-4 rounded-2xl transition-colors"
            >
              次へ（{AXES[axisIndex + 1]}へ）→
            </button>
          )}
        </div>

      </div>
    </main>
  );
}
