import { notFound } from "next/navigation";
import ResultCard from "@/components/ResultCard";
import GapChart from "@/components/GapChart";
import ShareButtons from "@/components/ShareButtons";
import type { SessionResult } from "@/lib/types";

interface Props {
  params: Promise<{ token: string }>;
}

async function getResult(token: string): Promise<SessionResult | null> {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  const res = await fetch(`${baseUrl}/api/sessions/${token}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function ResultPage({ params }: Props) {
  const { token } = await params;
  const data = await getResult(token);

  if (!data) notFound();

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  const resultUrl = `${baseUrl}/result/${token}`;
  const friendUrl = `${baseUrl}/friend/${data.friendToken}`;

  const isFrks = data.selfResult.typeCode === "FRKS";

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="max-w-md mx-auto flex flex-col gap-6">

        <div className="text-center">
          <p className="text-mirror-400 text-sm tracking-widest uppercase">
            診断結果
          </p>
          <h1 className="text-2xl font-bold text-mirror-900 mt-1">
            ミラー診断
          </h1>
        </div>

        {/* 風林火山 特別演出 */}
        {isFrks && (
          <div className="bg-gradient-to-r from-mirror-700 to-mirror-900 text-white rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold">⚔️ 風林火山</p>
            <p className="text-mirror-200 text-sm mt-1">
              最も希少なタイプの一つです
            </p>
          </div>
        )}

        {/* 自己像 */}
        <ResultCard result={data.selfResult} label="自己像" />

        {/* 他者像 */}
        {data.friendResult ? (
          <>
            <ResultCard result={data.friendResult} label={`他者像（${data.friendCount}人の平均）`} />
            <GapChart gaps={data.gaps} />
          </>
        ) : (
          <div className="bg-mirror-50 rounded-2xl p-5 border border-mirror-100 text-center">
            <p className="text-mirror-600 text-sm">
              友人に診断してもらうと、自己像との<br />
              ギャップが表示されます
            </p>
            <p className="text-mirror-400 text-xs mt-2">
              現在の回答数：0件
            </p>
          </div>
        )}

        {/* シェア */}
        <ShareButtons
          resultUrl={resultUrl}
          friendUrl={friendUrl}
          typeName={data.selfResult.typeName}
          typeCode={data.selfResult.typeCode}
        />

        {/* URLブックマーク案内 */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <p className="text-amber-700 text-sm font-medium">📌 このページをブックマーク</p>
          <p className="text-amber-600 text-xs mt-1">
            このURLを保存しておくと、いつでも結果に戻れます。
            友人が診断するたびにギャップが更新されます。
          </p>
        </div>

      </div>
    </main>
  );
}
