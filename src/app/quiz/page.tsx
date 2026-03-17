"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import QuizQuestion from "@/components/QuizQuestion";
import { QUESTIONS } from "@/lib/questions";

export default function QuizPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(QUESTIONS.length).fill(null)
  );
  const [current, setCurrent] = useState(0);
  const [resultToken, setResultToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // セッション作成
  useEffect(() => {
    const init = async () => {
      const res = await fetch("/api/sessions", { method: "POST" });
      const data = await res.json();
      setResultToken(data.result_token);
      // 友人トークンをlocalStorageに保存（結果ページで使用）
      localStorage.setItem("friend_token", data.friend_token);
    };
    init();
  }, []);

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[current] = value;
    setAnswers(newAnswers);

    // 少し遅延して次の問題へ
    setTimeout(() => {
      if (current < QUESTIONS.length - 1) {
        setCurrent(current + 1);
      }
    }, 300);
  };

  const handlePrev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const handleSubmit = async () => {
    if (!resultToken || isSubmitting) return;
    if (answers.some((a) => a === null)) return;

    setIsSubmitting(true);
    await fetch(`/api/sessions/${resultToken}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
    });
    router.push(`/result/${resultToken}`);
  };

  const isLast = current === QUESTIONS.length - 1;
  const allAnswered = answers.every((a) => a !== null);
  const q = QUESTIONS[current];

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-md w-full flex flex-col gap-8">

        <QuizQuestion
          questionNumber={current + 1}
          total={QUESTIONS.length}
          text={q.text}
          value={answers[current]}
          onChange={handleAnswer}
        />

        {/* ナビゲーションボタン */}
        <div className="flex gap-3">
          <button
            onClick={handlePrev}
            disabled={current === 0}
            className="flex-1 bg-mirror-50 hover:bg-mirror-100 disabled:opacity-30 text-mirror-600 font-medium py-3 rounded-2xl transition-colors"
          >
            ← 前へ
          </button>

          {isLast ? (
            <button
              onClick={handleSubmit}
              disabled={!allAnswered || isSubmitting}
              className="flex-1 bg-mirror-600 hover:bg-mirror-700 disabled:opacity-40 text-white font-semibold py-3 rounded-2xl transition-colors"
            >
              {isSubmitting ? "送信中..." : "結果を見る →"}
            </button>
          ) : (
            <button
              onClick={() => setCurrent(current + 1)}
              disabled={answers[current] === null}
              className="flex-1 bg-mirror-600 hover:bg-mirror-700 disabled:opacity-40 text-white font-semibold py-3 rounded-2xl transition-colors"
            >
              次へ →
            </button>
          )}
        </div>

      </div>
    </main>
  );
}
