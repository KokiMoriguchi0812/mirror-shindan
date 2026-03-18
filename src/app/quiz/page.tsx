"use client";

import { useState, useEffect } from "react";
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

export default function QuizPage() {
  const router = useRouter();
  const { session } = useAuth();

  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(QUESTIONS.length).fill(null)
  );
  const [axisIndex, setAxisIndex] = useState(0); // 0=行動様式 ... 3=価値基準
  const [resultToken, setResultToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentAxis = AXES[axisIndex];
  const axisQuestions = QUESTIONS.filter((q) => q.axis === currentAxis);
  const axisAnswers = axisQuestions.map((q) => answers[q.id - 1]);
  const allAxisAnswered = axisAnswers.every((a) => a !== null);
  const isLastAxis = axisIndex === AXES.length - 1;

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

  const handleNext = () => {
    if (axisIndex < AXES.length - 1) {
      setAxisIndex((i) => i + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async () => {
    if (!resultToken || isSubmitting) return;
    if (answers.some((a) => a === null)) return;

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
            <span className="text-xs text-mirror-400">
              {AXES.map((a, i) => (
                <span
                  key={a}
                  className={`inline-block mx-0.5 ${
                    i < axisIndex
                      ? "text-mirror-600"
                      : i === axisIndex
                      ? "text-mirror-800 font-bold"
                      : "text-mirror-200"
                  }`}
                >
                  {a}
                </span>
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

        {/* 次へ / 送信ボタン */}
        <div className="pb-8">
          {isLastAxis ? (
            <button
              onClick={handleSubmit}
              disabled={!allAxisAnswered || isSubmitting}
              className="w-full bg-mirror-600 hover:bg-mirror-700 disabled:opacity-40 text-white font-semibold py-4 rounded-2xl transition-colors"
            >
              {isSubmitting ? "送信中..." : "診断結果を見る →"}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!allAxisAnswered}
              className="w-full bg-mirror-600 hover:bg-mirror-700 disabled:opacity-40 text-white font-semibold py-4 rounded-2xl transition-colors"
            >
              次へ（{AXES[axisIndex + 1]}へ）→
            </button>
          )}
        </div>

      </div>
    </main>
  );
}
