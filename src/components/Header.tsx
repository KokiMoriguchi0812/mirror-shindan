"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function Header() {
  const { user, loading, signOut } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-mirror-100">
      <div className="max-w-md mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-mirror-700 font-bold text-sm">
          ミラー診断
        </Link>
        {!loading && (
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link
                  href="/mypage"
                  className="text-sm text-mirror-600 hover:text-mirror-800 font-medium"
                >
                  マイページ
                </Link>
                <button
                  onClick={signOut}
                  className="text-sm text-mirror-400 hover:text-mirror-600"
                >
                  ログアウト
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm text-mirror-600 hover:text-mirror-800 font-medium"
                >
                  ログイン
                </Link>
                <Link
                  href="/register"
                  className="text-sm bg-mirror-600 hover:bg-mirror-700 text-white font-medium px-3 py-1.5 rounded-lg transition-colors"
                >
                  登録
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
