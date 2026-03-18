"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("パスワードが一致しません");
      return;
    }
    if (password.length < 6) {
      setError("パスワードは6文字以上にしてください");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError("登録に失敗しました。別のメールアドレスをお試しください。");
      setLoading(false);
      return;
    }

    setDone(true);
  };

  if (done) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center flex flex-col gap-4 max-w-sm">
          <p className="text-4xl">📬</p>
          <h2 className="text-xl font-bold text-mirror-900">確認メールを送信しました</h2>
          <p className="text-mirror-600 text-sm leading-relaxed">
            {email} に確認メールを送りました。<br />
            メール内のリンクをクリックして登録を完了してください。
          </p>
          <Link
            href="/login"
            className="mt-2 bg-mirror-600 hover:bg-mirror-700 text-white font-semibold py-3 rounded-2xl transition-colors text-center"
          >
            ログインページへ
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-mirror-900">アカウント登録</h1>
          <p className="text-mirror-500 text-sm mt-1">診断結果を保存・管理できます</p>
        </div>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-mirror-700">メールアドレス</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border border-mirror-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-mirror-400"
              placeholder="example@mail.com"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-mirror-700">パスワード（6文字以上）</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border border-mirror-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-mirror-400"
              placeholder="••••••••"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-mirror-700">パスワード（確認）</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className="border border-mirror-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-mirror-400"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-mirror-600 hover:bg-mirror-700 disabled:opacity-50 text-white font-semibold py-3 rounded-2xl transition-colors"
          >
            {loading ? "登録中..." : "登録する"}
          </button>
        </form>

        <div className="text-center text-sm text-mirror-500">
          すでにアカウントをお持ちの方は{" "}
          <Link href="/login" className="text-mirror-600 hover:underline font-medium">
            ログイン
          </Link>
        </div>
      </div>
    </main>
  );
}
