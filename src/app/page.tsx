import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-md w-full flex flex-col items-center gap-10">

        {/* ロゴ・タイトル */}
        <div className="text-center flex flex-col gap-3">
          <p className="text-mirror-400 text-sm tracking-widest uppercase font-medium">
            Mirror Shindan
          </p>
          <h1 className="text-4xl font-bold text-mirror-900">
            ミラー診断
          </h1>
          <p className="text-mirror-600 text-lg leading-relaxed mt-2">
            「自分が思う自分」と<br />
            「他人が見る自分」の<br />
            ギャップを知ろう。
          </p>
        </div>

        {/* CTA */}
        <Link
          href="/quiz"
          className="w-full bg-mirror-600 hover:bg-mirror-700 text-white text-center font-semibold py-4 px-8 rounded-2xl transition-colors shadow-md shadow-mirror-200 text-lg"
        >
          診断を始める（無料）
        </Link>

        {/* 特徴 */}
        <div className="w-full bg-white rounded-2xl p-6 border border-mirror-100 shadow-sm flex flex-col gap-3">
          <p className="text-mirror-500 text-xs font-semibold tracking-widest uppercase">
            特徴
          </p>
          {[
            ["📝", "32問・約5分で完了"],
            ["👥", "友人に送って自分を診断してもらえる"],
            ["🔍", "16タイプ×自己像と他者像のギャップを表示"],
            ["💬", "恋愛・職場・友人関係に活かせる"],
          ].map(([icon, text]) => (
            <div key={text} className="flex items-center gap-3 text-mirror-700">
              <span className="text-lg">{icon}</span>
              <span className="text-sm">{text}</span>
            </div>
          ))}
        </div>

        {/* 使い方 */}
        <div className="w-full flex flex-col gap-3">
          <p className="text-mirror-500 text-xs font-semibold tracking-widest uppercase">
            使い方
          </p>
          {[
            ["①", "自分で32問に答える"],
            ["②", "友人に専用URLを送る"],
            ["③", "自己像と他者像のギャップを確認する"],
          ].map(([step, text]) => (
            <div key={step} className="flex items-center gap-4">
              <span className="w-8 h-8 rounded-full bg-mirror-100 text-mirror-600 font-bold text-sm flex items-center justify-center shrink-0">
                {step}
              </span>
              <span className="text-mirror-700 text-sm">{text}</span>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
