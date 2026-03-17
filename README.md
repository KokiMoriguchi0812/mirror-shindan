# 鏡診断（仮）

> 「自分が思う自分」と「他人が見る自分」のギャップを可視化する、日本初の対人関係特化型性格診断

## 概要

MBTIにヒントを得た日本人向けオリジナル性格診断。
自己診断と他者診断（友人・パートナーからの評価）を比較し、自己像と他者像のギャップを可視化する。

## 特徴

- **ジョハリの窓**を応用：自分が知らない自分を発見できる
- **友人URLシェア**：診断後に専用URLを友人に送るだけで他者診断が完了
- **複数人平均**：複数の友人の回答を平均して比較
- **16タイプ × 4文字コード**：日本語漢字ベースの覚えやすいコード
- **隠し仕掛け**：FRKS = 風林火山タイプ

## 診断の4軸

| 軸 | 一方（コード） | もう一方（コード） |
|----|--------------|-----------------|
| 行動様式 | 風 F（即断即行） | 岩 G（熟考慎重） |
| 対人距離 | 野 Y（積極・開放） | 林 R（内向・静） |
| 感情表現 | 火 K（外に出す） | 氷 H（内に秘める） |
| 価値基準 | 月 T（感情・共感） | 山 S（論理・安定） |

## 技術スタック

| 項目 | 採用技術 |
|------|---------|
| フロントエンド | Next.js 14 (App Router) + TypeScript |
| スタイリング | Tailwind CSS + shadcn/ui |
| データベース | Supabase (PostgreSQL) |
| ホスティング | Vercel |

## 環境構築手順

```bash
# リポジトリをクローン
git clone https://github.com/your-username/mbti-original.git
cd mbti-original

# 依存関係インストール
npm install

# 環境変数設定
cp .env.example .env.local
# .env.local に Supabase の URL と ANON_KEY を設定

# 開発サーバー起動
npm run dev
```

## 環境変数

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## ディレクトリ構成

`docs/directory.md` を参照。

## 設計ドキュメント

| ドキュメント | 内容 |
|-------------|------|
| `docs/requirements.md` | 要件定義 |
| `docs/database.md` | DB設計・ER図 |
| `docs/wireframes.md` | 画面設計 |
| `docs/api.md` | API設計 |
| `docs/directory.md` | ディレクトリ構成 |
| `docs/拡張.md` | 今後の拡張機能リスト |
