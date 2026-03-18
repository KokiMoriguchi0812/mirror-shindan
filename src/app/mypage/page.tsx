"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { calcResult } from "@/lib/scoring";

interface PastSession {
  result_token: string;
  self_answers: number[];
  created_at: string;
}

export default function MyPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [sessions, setSessions] = useState<PastSession[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;

    supabase
      .from("sessions")
      .select("result_token, self_answers, created_at")
      .eq("user_id", user.id)
      .not("self_answers", "eq", "[]")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setSessions((data ?? []) as PastSession[]);
        setFetching(false);
      });
  }, [user]);

  if (loading || !user) return null;

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="max-w-md mx-auto flex flex-col gap-6">
        <div className="text-center">
          <p className="text-mirror-400 text-sm tracking-widest uppercase">MY PAGE</p>
          <h1 className="text-2xl font-bold text-mirror-900 mt-1">マイページ</h1>
          <p className="text-mirror-500 text-xs mt-1">{user.email}</p>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-mirror-500 text-xs font-semibold tracking-widest uppercase">
            診断履歴
          </p>

          {fetching ? (
            <p className="text-center text-mirror-400 text-sm py-8">読み込み中...</p>
          ) : sessions.length === 0 ? (
            <div className="bg-mirror-50 rounded-2xl p-6 text-center border border-mirror-100">
              <p className="text-mirror-500 text-sm">診断履歴がありません</p>
              <Link
                href="/quiz"
                className="mt-3 block bg-mirror-600 hover:bg-mirror-700 text-white font-semibold py-3 rounded-2xl transition-colors text-center text-sm"
              >
                診断を始める
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {sessions.map((s) => {
                const result = calcResult(s.self_answers);
                const imagePath = `/types/${result.typeCode}(${result.typeName}).png`;
                const date = new Date(s.created_at).toLocaleDateString("ja-JP", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                });

                return (
                  <Link
                    key={s.result_token}
                    href={`/result/${s.result_token}`}
                    className="bg-white rounded-2xl p-4 border border-mirror-100 shadow-sm flex items-center gap-4 hover:border-mirror-300 transition-colors"
                  >
                    <div className="w-14 h-14 rounded-full bg-mirror-50 border border-mirror-200 overflow-hidden shrink-0">
                      <Image
                        src={imagePath}
                        alt={result.typeName}
                        width={56}
                        height={56}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <p className="text-lg font-bold text-mirror-700 tracking-widest">
                        {result.typeCode}
                      </p>
                      <p className="text-mirror-900 font-semibold text-sm">{result.typeName}</p>
                      <p className="text-mirror-400 text-xs">{date}</p>
                    </div>
                    <span className="ml-auto text-mirror-300 text-lg">›</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <Link
          href="/quiz"
          className="bg-mirror-600 hover:bg-mirror-700 text-white font-semibold py-4 rounded-2xl transition-colors text-center"
        >
          新しく診断する
        </Link>
      </div>
    </main>
  );
}
