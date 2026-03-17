# ディレクトリ構成

```
mbti-original/
├── README.md                        # プロジェクト概要
├── .env.local                       # 環境変数（Git管理外）
├── .env.example                     # 環境変数サンプル
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
│
├── docs/                            # 設計ドキュメント
│   ├── requirements.md              # 要件定義
│   ├── database.md                  # DB設計・ER図
│   ├── wireframes.md                # 画面設計
│   ├── api.md                       # API設計
│   ├── directory.md                 # 本ファイル
│   └── 拡張.md                      # 拡張機能リスト
│
├── public/
│   ├── og-image.png                 # OGP画像
│   └── favicon.ico
│
└── src/
    ├── app/                         # Next.js App Router
    │   ├── layout.tsx               # 共通レイアウト
    │   ├── page.tsx                 # トップページ
    │   ├── quiz/
    │   │   └── page.tsx             # 診断ページ（自己診断）
    │   ├── result/
    │   │   └── [token]/
    │   │       └── page.tsx         # 結果ページ（自己像・他者像比較）
    │   ├── friend/
    │   │   └── [token]/
    │   │       └── page.tsx         # 友人診断ページ
    │   └── api/
    │       ├── sessions/
    │       │   └── route.ts         # POST: セッション作成
    │       ├── sessions/[token]/
    │       │   └── route.ts         # GET: 結果取得 / PUT: 回答保存
    │       └── friend/[token]/
    │           └── route.ts         # GET: 友人診断情報 / POST: 友人回答送信
    │
    ├── components/
    │   ├── ui/                      # shadcn/ui コンポーネント
    │   ├── ScaleInput.tsx           # 5段階スケール入力UI
    │   ├── QuizQuestion.tsx         # 質問1問コンポーネント
    │   ├── ProgressBar.tsx          # 診断進捗バー
    │   ├── ResultCard.tsx           # タイプ結果カード
    │   ├── GapChart.tsx             # 自己像vs他者像チャート
    │   ├── ShareButtons.tsx         # シェアボタン群
    │   └── FriendInvite.tsx         # 友人招待UIコンポーネント
    │
    └── lib/
        ├── supabase.ts              # Supabaseクライアント設定
        ├── questions.ts             # 32問データ定義
        ├── scoring.ts               # スコア計算・タイプ判定ロジック
        └── types.ts                 # TypeScript型定義
```
