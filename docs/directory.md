# ディレクトリ構成

```
NEW_MBTI_local/
├── README.md                        # プロジェクト概要
├── .env.local                       # 環境変数（Git管理外）
├── .env.example                     # 環境変数サンプル
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── vitest.config.ts
├── package.json
│
├── docs/                            # 設計ドキュメント
│   ├── requirements.md              # 要件定義
│   ├── database.md                  # DB設計・ER図
│   ├── wireframes.md                # 画面設計
│   ├── api.md                       # API設計
│   ├── directory.md                 # 本ファイル
│   ├── supabase_setup.sql           # Supabaseテーブル作成SQL
│   └── 拡張.md                      # 拡張機能リスト
│
├── public/
│   └── types/                       # 16タイプ画像（PNG）
│       ├── FYKT(革命家).png
│       ├── FYKS(指揮者).png
│       ├── FYHT(外交家).png
│       ├── FYHS(先駆者).png
│       ├── FRKT(表現者).png
│       ├── FRKS(覇者).png
│       ├── FRHT(守護者).png
│       ├── FRHS(実行者).png
│       ├── GYKT(包容者).png
│       ├── GYKS(啓発者).png
│       ├── GYHT(調停者).png
│       ├── GYHS(参謀).png
│       ├── GRKT(詩人).png
│       ├── GRKS(探求者).png
│       ├── GRHT(哲学者).png
│       └── GRHS(思想家).png
│
└── src/
    ├── app/                         # Next.js App Router
    │   ├── globals.css              # グローバルスタイル
    │   ├── layout.tsx               # 共通レイアウト・メタデータ
    │   ├── page.tsx                 # トップページ
    │   ├── quiz/
    │   │   └── page.tsx             # 診断ページ（32問）
    │   ├── result/
    │   │   └── [token]/
    │   │       └── page.tsx         # 結果ページ（自己像・他者像比較）
    │   ├── friend/
    │   │   └── [token]/
    │   │       └── page.tsx         # 友人診断ページ
    │   └── api/
    │       ├── sessions/
    │       │   ├── route.ts         # POST: 自己診断セッション作成
    │       │   └── [token]/
    │       │       └── route.ts     # GET: 結果取得 / PUT: 回答保存
    │       └── friend/
    │           └── [token]/
    │               └── route.ts     # GET: 友人情報取得 / POST: 友人回答送信
    │
    ├── components/
    │   ├── ScaleInput.tsx           # 5段階スケール入力UI
    │   ├── QuizQuestion.tsx         # 質問1問コンポーネント
    │   ├── ResultCard.tsx           # タイプ結果カード（画像・スコアバー）
    │   ├── GapChart.tsx             # 自己像vs他者像ギャップ表示
    │   └── ShareButtons.tsx         # X/LINE/URLコピーシェアボタン
    │
    ├── lib/
    │   ├── supabase.ts              # Supabaseクライアント設定
    │   ├── questions.ts             # 32問データ定義（4軸×8問）
    │   ├── scoring.ts               # スコア計算・タイプ判定・ギャップ生成
    │   └── types.ts                 # TypeScript型定義
    │
    └── test/
        ├── scoring.test.ts          # スコアリングロジックのユニットテスト（12件）
        └── setup.ts                 # テストセットアップ
```
