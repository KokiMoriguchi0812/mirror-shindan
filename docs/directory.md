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
│       ├── FYKS(指揮者).png  ... （計16枚）
│
└── src/
    ├── app/                         # Next.js App Router
    │   ├── globals.css              # グローバルスタイル
    │   ├── layout.tsx               # 共通レイアウト（AuthProvider・Header含む）
    │   ├── page.tsx                 # トップページ（使い方・16タイプスライダー）
    │   ├── login/
    │   │   └── page.tsx             # ログインページ（メール・パスワード）
    │   ├── register/
    │   │   └── page.tsx             # アカウント登録ページ
    │   ├── mypage/
    │   │   └── page.tsx             # マイページ（過去の診断履歴一覧）
    │   ├── quiz/
    │   │   └── page.tsx             # 診断ページ（8問×4軸セット表示）
    │   ├── result/
    │   │   └── [token]/
    │   │       ├── page.tsx         # 結果ページ（サーバーコンポーネント・Supabase直接クエリ）
    │   │       └── ResultPageClient.tsx # 結果ページUI（タブ・保存・再診断・履歴）
    │   ├── friend/
    │   │   └── [token]/
    │   │       └── page.tsx         # 友人診断ページ（回答後に2タイプ結果表示）
    │   └── api/
    │       ├── sessions/
    │       │   ├── route.ts         # POST: セッション作成
    │       │   └── [token]/
    │       │       ├── route.ts     # GET: 結果取得 / PUT: 回答保存（user_id関連付け）
    │       │       └── save/
    │       │           └── route.ts # POST: ログイン後に結果をアカウントに保存
    │       └── friend/
    │           └── [token]/
    │               └── route.ts     # GET: 友人情報・本人自己診断結果取得 / POST: 友人回答送信
    │
    ├── components/
    │   ├── Header.tsx               # ヘッダー（ログイン・登録・マイページ・ログアウト）
    │   ├── TypeSlider.tsx           # 16タイプスライダー（左右矢印・インジケーター）
    │   ├── ScaleInput.tsx           # 5段階スケール入力UI
    │   ├── QuizQuestion.tsx         # 質問1問コンポーネント（旧式・友人ページ以外未使用）
    │   ├── ResultCard.tsx           # タイプ結果カード（ゲージ改善・特徴テキスト表示）
    │   ├── GapChart.tsx             # 自己像vs他者像ギャップ表示
    │   └── ShareButtons.tsx         # X/LINE/URLコピーシェアボタン
    │
    ├── lib/
    │   ├── auth-context.tsx         # 認証コンテキスト（useAuth hook）
    │   ├── supabase.ts              # Supabaseクライアント（anon・service）
    │   ├── questions.ts             # 32問データ定義（4軸×8問）
    │   ├── scoring.ts               # スコア計算・タイプ判定・ギャップ生成
    │   ├── type-details.ts          # 16タイプの詳細説明文
    │   └── types.ts                 # TypeScript型定義
    │
    └── test/
        ├── scoring.test.ts          # スコアリングロジックのユニットテスト
        └── setup.ts                 # テストセットアップ
```
