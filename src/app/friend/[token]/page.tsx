"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import QuizQuestion from "@/components/QuizQuestion";
import { QUESTIONS } from "@/lib/questions";
import Link from "next/link";

type Phase = "intro" | "quiz" | "done" | "notfound";

export default function FriendPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("intro");
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(QUESTIONS.length).fill(null)
  );
  const [current, setCurrent] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // トークンの有効確認
    fetch(`/api/friend/${token}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) setPhase("notfound");
      });
  }, [token]);

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[current] = value;
    setAnswers(newAnswers);
    setTimeout(() => {
      if (current < QUESTIONS.length - 1) setCurrent(current + 1);
    }, 300);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    await fetch(`/api/friend/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
    });

    setPhase("done");
  };

  if (phase === "notfound") {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-mirror-600">診断リンクが見つかりませんでした。</p>
          <Link href="/" className="text-mirror-400 text-sm mt-2 underline block">
            トップへ戻る
          </Link>
        </div>
      </main>
    );
  }

  if (phase === "done") {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full flex flex-col items-center gap-6 text-center">
          <p className="text-4xl">✨</p>
          <h2 className="text-xl font-bold text-mirror-900">
            ありがとうございました！
          </h2>
          <p className="text-mirror-600 text-sm">
            回答が反映されました。
          </p>
          <div className="w-full bg-mirror-50 rounded-2xl p-5 border border-mirror-100">
            <p className="text-mirror-700 text-sm font-medium">
              あなたも診断してみませんか？
            </p>
            <Link
              href="/"
              className="mt-3 block w-full bg-mirror-600 hover:bg-mirror-700 text-white font-semibold py-3 rounded-2xl transition-colors text-center"
            >
              自分も診断する
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (phase === "intro") {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full flex flex-col items-center gap-6 text-center">
          <div>
            <p className="text-mirror-400 text-sm">友人からの依頼</p>
            <h2 className="text-2xl font-bold text-mirror-900 mt-2">
              ミラー診断
            </h2>
          </div>
          <p className="text-mirror-600 leading-relaxed">
            あなたから見た<br />
            <span className="text-mirror-800 font-semibold">依頼者</span>について<br />
            答えてください（32問・約5分）
          </p>
          <button
            onClick={() => setPhase("quiz")}
            className="w-full bg-mirror-600 hover:bg-mirror-700 text-white font-semibold py-4 rounded-2xl transition-colors"
          >
            診断を始める
          </button>
        </div>
      </main>
    );
  }

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

        <div className="flex gap-3">
          <button
            onClick={() => current > 0 && setCurrent(current - 1)}
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
              {isSubmitting ? "送信中..." : "送信する →"}
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
