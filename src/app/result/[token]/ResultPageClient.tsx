"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ResultCard from "@/components/ResultCard";
import GapChart from "@/components/GapChart";
import ShareButtons from "@/components/ShareButtons";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { calcResult } from "@/lib/scoring";
import { TYPE_DETAILS } from "@/lib/type-details";
import type { SessionResult } from "@/lib/types";

interface PastSession {
  result_token: string;
  self_answers: number[];
  created_at: string;
}

interface Props {
  data: SessionResult & { hasUserId: boolean };
  token: string;
  resultUrl: string;
  friendUrl: string;
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

export default function ResultPageClient({ data, token, resultUrl, friendUrl }: Props) {
  const { user, session: authSession } = useAuth();
  const router = useRouter();
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [pastSessions, setPastSessions] = useState<PastSession[]>([]);

  const isFrks = data.selfResult.typeCode === "FRKS";
  const typeDetail = TYPE_DETAILS[data.selfResult.typeCode];

  // ログイン済みユーザーの過去履歴取得
  useEffect(() => {
    if (!user) return;
    supabase
      .from("sessions")
      .select("result_token, self_answers, created_at")
      .eq("user_id", user.id)
      .not("self_answers", "eq", "[]")
      .order("created_at", { ascending: false })
      .then(({ data: rows }) => {
        setPastSessions((rows ?? []) as PastSession[]);
      });
  }, [user]);

  const handleSave = async () => {
    if (!authSession?.access_token) {
      router.push(`/login?redirect=/result/${token}`);
      return;
    }
    setSaveStatus("saving");
    await fetch(`/api/sessions/${token}/save`, {
      method: "POST",
      headers: { Authorization: `Bearer ${authSession.access_token}` },
    });
    setSaveStatus("saved");
  };

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="max-w-md mx-auto flex flex-col gap-5">

        {/* ヘッダー */}
        <div className="text-center">
          <p className="text-mirror-400 text-sm tracking-widest uppercase">診断結果</p>
          <h1 className="text-2xl font-bold text-mirror-900 mt-1">ミラー診断</h1>
        </div>

        {/* 風林火山 特別演出 */}
        {isFrks && (
          <div className="bg-gradient-to-r from-mirror-700 to-mirror-900 text-white rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold">⚔️ 風林火山</p>
            <p className="text-mirror-200 text-sm mt-1">最も希少なタイプの一つです</p>
          </div>
        )}

        {/* 自己像 */}
        <CollapseSection title="🪞 自己像（自分から見た自分）">
          <ResultCard result={data.selfResult} />
        </CollapseSection>

        {/* 自己像の特徴 */}
        <CollapseSection title={`✨ ${data.selfResult.typeCode}（${data.selfResult.typeName}）の特徴`}>
          <p className="text-mirror-700 text-sm leading-relaxed">{typeDetail}</p>
        </CollapseSection>

        {/* 他者像 */}
        <CollapseSection title={`👥 他者像（他人から見る自分）${data.friendCount > 0 ? `（${data.friendCount}人の平均）` : ""}`}>
          {data.friendResult ? (
            <ResultCard result={data.friendResult} />
          ) : (
            <div className="text-center py-4">
              <p className="text-mirror-500 text-sm">
                友人に診断してもらうと、他者像が表示されます
              </p>
              <p className="text-mirror-400 text-xs mt-1">現在の回答数：0件</p>
            </div>
          )}
        </CollapseSection>

        {/* 自己像VS他者像のギャップ */}
        {data.friendResult && (
          <CollapseSection title="🔍 自己像 VS 他者像のギャップ">
            <GapChart gaps={data.gaps} />
          </CollapseSection>
        )}

        {/* シェア */}
        <ShareButtons
          resultUrl={resultUrl}
          friendUrl={friendUrl}
          typeName={data.selfResult.typeName}
          typeCode={data.selfResult.typeCode}
        />

        {/* ブックマーク案内 */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <p className="text-amber-700 text-sm font-medium">📌 このページをブックマーク</p>
          <p className="text-amber-600 text-xs mt-1">
            このURLを保存しておくと、いつでも結果に戻れます。
          </p>
        </div>

        {/* ログインして保存（未ログイン時のみ） */}
        {!user && (
          <button
            onClick={handleSave}
            disabled={saveStatus === "saving"}
            className="w-full border-2 border-mirror-400 hover:bg-mirror-50 text-mirror-600 font-semibold py-3 rounded-2xl transition-colors text-sm"
          >
            {saveStatus === "saving" ? "処理中..." : "ログインして結果を保存する"}
          </button>
        )}

        {/* 保存済みメッセージ */}
        {saveStatus === "saved" && (
          <p className="text-center text-mirror-500 text-sm">✅ 保存しました</p>
        )}

        {/* 再診断ボタン */}
        <Link
          href="/quiz"
          className="w-full bg-mirror-100 hover:bg-mirror-200 text-mirror-700 font-semibold py-3 rounded-2xl transition-colors text-center text-sm"
        >
          再診断する
        </Link>

        {/* 過去の診断履歴（ログイン済みのみ） */}
        {user && pastSessions.length > 0 && (
          <div className="flex flex-col gap-3">
            <p className="text-mirror-500 text-xs font-semibold tracking-widest uppercase">
              過去の診断履歴
            </p>
            <div className="flex flex-col gap-2">
              {pastSessions.map((s) => {
                const r = calcResult(s.self_answers);
                const imgPath = `/types/${r.typeCode}(${r.typeName}).png`;
                const date = new Date(s.created_at).toLocaleDateString("ja-JP", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                });
                return (
                  <Link
                    key={s.result_token}
                    href={`/result/${s.result_token}`}
                    className={`bg-white rounded-xl p-3 border flex items-center gap-3 hover:border-mirror-300 transition-colors ${
                      s.result_token === token ? "border-mirror-400" : "border-mirror-100"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-mirror-50 border border-mirror-200 overflow-hidden shrink-0">
                      <Image src={imgPath} alt={r.typeName} width={40} height={40} className="object-cover" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <p className="text-sm font-bold text-mirror-700">{r.typeCode}</p>
                      <p className="text-xs text-mirror-600">{r.typeName}</p>
                      <p className="text-xs text-mirror-400">{date}</p>
                    </div>
                    {s.result_token === token && (
                      <span className="ml-auto text-xs text-mirror-400 shrink-0">現在</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
