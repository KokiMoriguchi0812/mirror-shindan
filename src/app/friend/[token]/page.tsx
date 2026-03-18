"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ScaleInput from "@/components/ScaleInput";
import ResultCard from "@/components/ResultCard";
import GapChart from "@/components/GapChart";
import { QUESTIONS, AXES } from "@/lib/questions";
import { calcResult, calcFriendGaps } from "@/lib/scoring";
import { TYPE_DETAILS } from "@/lib/type-details";
import type { DiagnosisResult } from "@/lib/types";

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

function CollapseSection({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-2xl border border-mirror-100 shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex justify-between items-center px-5 py-4 text-left"
      >
        <span className="font-semibold text-mirror-800 text-sm">{title}</span>
        <span className="text-mirror-400 text-lg">{open ? "▲" : "▼"}</span>
      </button>
      {open && <div className="px-5 pb-5">{children}</div>}
    </div>
  );
}

type Phase = "intro" | "quiz" | "done" | "notfound";

export default function FriendPage() {
  const { token } = useParams<{ token: string }>();
  const [phase, setPhase] = useState<Phase>("intro");
  const [answers, setAnswers] = useState<(number | null)[]>(Array(QUESTIONS.length).fill(null));
  const [axisIndex, setAxisIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [friendResult, setFriendResult] = useState<DiagnosisResult | null>(null);
  const [selfResult, setSelfResult] = useState<DiagnosisResult | null>(null);

  // 各軸の問題をシャッフル（マウント時に一度だけ）
  const shuffledQuestions = useMemo(() => {
    const result: typeof QUESTIONS = [];
    for (const axis of AXES) {
      const axisQs = QUESTIONS.filter((q) => q.axis === axis);
      result.push(...shuffleArray(axisQs));
    }
    return result;
  }, []);

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
  const axisQuestions = shuffledQuestions.filter((q) => q.axis === currentAxis);
  const isLastAxis = axisIndex === AXES.length - 1;
  const allAnswered = answers.every((a) => a !== null);

  const handleAnswer = (questionId: number, value: number) => {
    const next = [...answers];
    next[questionId - 1] = value;
    setAnswers(next);
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
    setAxisIndex((i) => i + 1);
    scrollTop();
  };

  const handleSubmit = async () => {
    if (isSubmitting || !allAnswered) return;
    setIsSubmitting(true);

    await fetch(`/api/friend/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
    });

    const computed = calcResult(answers as number[]);
    setFriendResult(computed);
    setPhase("done");
    scrollTop();
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
    const friendGaps = calcFriendGaps(selfResult!, friendResult);

    return (
      <main className="min-h-screen px-4 py-8">
        <div className="max-w-md mx-auto flex flex-col gap-5">

          <div className="text-center">
            <p className="text-4xl">✨</p>
            <h2 className="text-xl font-bold text-mirror-900 mt-2">回答ありがとうございました！</h2>
            <p className="text-mirror-500 text-sm mt-1">あなたの視点による診断結果です</p>
          </div>

          {/* あなたから見た友人 */}
          <CollapseSection title="👤 あなたから見た友人">
            <ResultCard result={friendResult} />
            <div className="bg-mirror-50 rounded-2xl p-4 border border-mirror-100 mt-3">
              <p className="text-mirror-700 text-sm leading-relaxed">
                {TYPE_DETAILS[friendResult.typeCode]}
              </p>
            </div>
          </CollapseSection>

          {/* 友人から見た友人（本人の自己診断） */}
          {selfResult && (
            <CollapseSection title="🪞 友人から見た友人（本人の自己診断）">
              <ResultCard result={selfResult} />
              <div className="bg-mirror-50 rounded-2xl p-4 border border-mirror-100 mt-3">
                <p className="text-mirror-700 text-sm leading-relaxed">
                  {TYPE_DETAILS[selfResult.typeCode]}
                </p>
              </div>
            </CollapseSection>
          )}

          {/* あなたから見た友人 VS 友人から見た友人のギャップ */}
          {selfResult && (
            <CollapseSection title="🔍 あなたから見た友人 VS 友人から見た友人のギャップ">
              <GapChart
                gaps={friendGaps}
                title="あなたから見た友人 vs 友人から見た友人"
                noGapMessage="あなたの評価と友人の自己像がほぼ一致しています ✨"
              />
            </CollapseSection>
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

        {/* 前へ / 次へ / 送信 */}
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
              {isSubmitting ? "送信中..." : "送信する →"}
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
