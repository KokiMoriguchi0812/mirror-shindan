"use client";

import { useState } from "react";

interface ShareButtonsProps {
  resultUrl: string;
  friendUrl: string;
  typeName: string;
  typeCode: string;
}

export default function ShareButtons({
  resultUrl,
  friendUrl,
  typeName,
  typeCode,
}: ShareButtonsProps) {
  const [copiedResult, setCopiedResult] = useState(false);
  const [copiedFriend, setCopiedFriend] = useState(false);

  const copyToClipboard = async (url: string, type: "result" | "friend") => {
    await navigator.clipboard.writeText(url);
    if (type === "result") {
      setCopiedResult(true);
      setTimeout(() => setCopiedResult(false), 2000);
    } else {
      setCopiedFriend(true);
      setTimeout(() => setCopiedFriend(false), 2000);
    }
  };

  const shareToX = () => {
    const text = `ミラー診断で「${typeName}（${typeCode}）」タイプと診断されました！\nあなたも試してみて👇\n${resultUrl}`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  const shareToLine = (url: string) => {
    window.open(
      `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`,
      "_blank"
    );
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 友人診断シェア */}
      <div className="bg-mirror-50 rounded-2xl p-4 border border-mirror-100">
        <p className="text-sm font-semibold text-mirror-700 mb-3">
          友人にも診断してもらう
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => shareToLine(friendUrl)}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-2 px-3 rounded-xl transition-colors"
          >
            LINEで送る
          </button>
          <button
            onClick={() => copyToClipboard(friendUrl, "friend")}
            className="flex-1 bg-mirror-100 hover:bg-mirror-200 text-mirror-700 text-sm font-medium py-2 px-3 rounded-xl transition-colors"
          >
            {copiedFriend ? "コピーしました！" : "URLをコピー"}
          </button>
        </div>
      </div>

      {/* 結果シェア */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-mirror-700">結果をシェア</p>
        <div className="flex gap-2">
          <button
            onClick={shareToX}
            className="flex-1 bg-black hover:bg-gray-800 text-white text-sm font-medium py-2 px-3 rounded-xl transition-colors"
          >
            X でシェア
          </button>
          <button
            onClick={() => shareToLine(resultUrl)}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-2 px-3 rounded-xl transition-colors"
          >
            LINE
          </button>
          <button
            onClick={() => copyToClipboard(resultUrl, "result")}
            className="flex-1 bg-mirror-100 hover:bg-mirror-200 text-mirror-700 text-sm font-medium py-2 px-3 rounded-xl transition-colors"
          >
            {copiedResult ? "コピー済み" : "URLコピー"}
          </button>
        </div>
      </div>
    </div>
  );
}
