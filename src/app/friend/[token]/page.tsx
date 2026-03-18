"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ScaleInput from "@/components/ScaleInput";
import ResultCard from "@/components/ResultCard";
import { QUESTIONS, AXES } from "@/lib/questions";
import { calcResult } from "@/lib/scoring";
import { TYPE_DETAILS } from "@/lib/type-details";
import type { DiagnosisResult } from "@/lib/types";

const AXIS_LABELS: Record<string, { icon: string; desc: string }> = {
  行動様式: { icon: "⚡", desc: "行動のスピード・決断スタイル" },
  対人距離: { icon: "🌿", desc: "人との関わり方・社交性" },
  感情表現: { icon: "🔥", desc: "感情の出し方・表現スタイル" },
  価値基準: { icon: "⚖️", desc: "判断・価値観の基準" },
};

type Phase = "intro" | "quiz" | "done" | "notfound";

export default function FriendPage() {
  const { token } = useParams<{ token: string }>();
  const [phase, setPhase] = useState<Phase>("intro");
  const [answers, setAnswers] = useState<(number | null)[]>(Array(QUESTIONS.length).fill(null));
  const [axisIndex, setAxisIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 回答後の結果
  const [friendResult, setFriendResult] = useState<DiagnosisResult | null>(null);
  const [selfResult, setSelfResult] = useState<DiagnosisResult | null>(null);

  useEffect(() => {
    fetch(`/api/friend/${token}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.session_exists) {
          setPhase("notfound");
        } else {
          setSelfResult(data.self_result ?? null);
        }
      })
      .catch(() => setPhase("notfound"));
  }, [token]);

  const currentAxis = AXES[axisIndex];
  const axisQuestions = QUESTIONS.filter((q) => q.axis === currentAxis);
  const axisAnswers = axisQuestions.map((q) => answers[q.id - 1]);
  const allAxisAnswered = axisAnswers.every((a) => a !== null);
  const isLastAxis = axisIndex === AXES.length - 1;

  const handleAnswer = (questionId: number, value: number) => {
    const next = [...answers];
    next[questionId - 1] = value;
    setAnswers(next);
  };

  const handleNext = () => {
    setAxisIndex((i) => i + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    if (answers.some((a) => a === null)) return;
    setIsSubmitting(true);

    await fetch(`/api/friend/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
    });

    // クライアント側でタイプ計算
    const computed = calcResult(answers as number[]);
    setFriendResult(computed);
    setPhase("done");
  };

  // ── 画面分岐 ──

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

  if (phase === "done" && friendResult) {
    return (
      <main className="min-h-screen px-4 py-8">
        <div className="max-w-md mx-auto flex flex-col gap-5">
          <div className="text-center">
            <p className="text-4xl">✨</p>
            <h2 className="text-xl font-bold text-mirror-900 mt-2">回答ありがとうございました！</h2>
            <p className="text-mirror-500 text-sm mt-1">あなたの視点による診断結果です</p>
          </div>

          {/* あなたから見た友人 */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold text-mirror-400 tracking-widest uppercase">
              あなたから見た友人
            </p>
            <ResultCard result={friendResult} />
            <div className="bg-mirror-50 rounded-2xl p-4 border border-mirror-100">
              <p className="text-mirror-700 text-sm leading-relaxed">
                {TYPE_DETAILS[friendResult.typeCode]}
              </p>
            </div>
          </div>

          {/* 友人から見た友人（本人の自己診断） */}
          {selfResult && (
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold text-mirror-400 tracking-widest uppercase">
                友人から見た友人（本人の自己診断）
              </p>
              <ResultCard result={selfResult} />
              <div className="bg-mirror-50 rounded-2xl p-4 border border-mirror-100">
                <p className="text-mirror-700 text-sm leading-relaxed">
                  {TYPE_DETAILS[selfResult.typeCode]}
                </p>
              </div>
            </div>
          )}

          <div className="bg-mirror-50 rounded-2xl p-5 border border-mirror-100 text-center">
            <p className="text-mirror-700 text-sm font-medium">あなたも診断してみませんか？</p>
            <Link
              href="/"
              className="mt-3 block bg-mirror-600 hover:bg-mirror-700 text-white font-semibold py-3 rounded-2xl transition-colors text-center"
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
            <h2 className="text-2xl font-bold text-mirror-900 mt-2">ミラー診断</h2>
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

  // quiz フェーズ
  return (
    <main className="min-h-screen px-4 py-8">
      <div className="max-w-md mx-auto flex flex-col gap-6">

        {/* プログレス */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-mirror-400">STEP {axisIndex + 1} / {AXES.length}</span>
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
          <p className="text-mirror-500 text-sm mt-1">{AXIS_LABELS[currentAxis].desc}</p>
        </div>

        {/* 8問リスト */}
        <div className="flex flex-col gap-5">
          {axisQuestions.map((q, i) => (
            <div
              key={q.id}
              className="bg-white rounded-2xl p-5 border border-mirror-100 shadow-sm flex flex-col gap-4"
            >
              <p className="text-xs text-mirror-400 font-medium">Q{i + 1}</p>
              <p className="text-mirror-800 text-sm leading-relaxed font-medium">{q.text}</p>
              <ScaleInput
                value={answers[q.id - 1]}
                onChange={(v) => handleAnswer(q.id, v)}
              />
            </div>
          ))}
        </div>

        {/* 次へ / 送信 */}
        <div className="pb-8">
          {isLastAxis ? (
            <button
              onClick={handleSubmit}
              disabled={!allAxisAnswered || isSubmitting}
              className="w-full bg-mirror-600 hover:bg-mirror-700 disabled:opacity-40 text-white font-semibold py-4 rounded-2xl transition-colors"
            >
              {isSubmitting ? "送信中..." : "送信する →"}
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
