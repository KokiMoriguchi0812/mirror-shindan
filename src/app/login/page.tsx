"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("メールアドレスまたはパスワードが正しくありません");
      setLoading(false);
      return;
    }

    router.push(redirectTo);
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-mirror-900">ログイン</h1>
          <p className="text-mirror-500 text-sm mt-1">アカウントにサインインする</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
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
            <label className="text-sm font-medium text-mirror-700">パスワード</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            {loading ? "ログイン中..." : "ログイン"}
          </button>
        </form>

        <div className="text-center text-sm text-mirror-500">
          アカウントをお持ちでない方は{" "}
          <Link href="/register" className="text-mirror-600 hover:underline font-medium">
            登録
          </Link>
        </div>
      </div>
    </main>
  );
}
