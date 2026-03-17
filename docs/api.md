# API設計

## ベースURL
```
/api
```

---

## エンドポイント一覧

| メソッド | パス | 説明 |
|---------|------|------|
| POST | `/api/sessions` | 自己診断セッション作成 |
| PUT | `/api/sessions/[token]` | 自己回答を保存 |
| GET | `/api/sessions/[token]` | 結果・ギャップデータ取得 |
| GET | `/api/friend/[token]` | 友人診断ページ用情報取得 |
| POST | `/api/friend/[token]` | 友人回答を送信 |

---

## 詳細

### POST `/api/sessions`
新しい診断セッションを作成し、トークンを発行する。

**Request：** なし

**Response：**
```json
{
  "result_token": "abc123xyz...",
  "friend_token": "def456uvw..."
}
```

---

### PUT `/api/sessions/[token]`
自己診断の回答を保存する。

**Request Body：**
```json
{
  "answers": [3, 5, 2, 4, 1, 5, 3, 4, 2, 5, 1, 3, 4, 2, 5, 3, 4, 1, 5, 2, 3, 4, 5, 1, 2, 4, 3, 5, 1, 4, 2, 3]
}
```

**Response：**
```json
{
  "success": true,
  "self_type": "FRKS"
}
```

---

### GET `/api/sessions/[token]`
結果ページ用のデータを取得する。

**Response：**
```json
{
  "self_type": "FRKS",
  "self_scores": {
    "行動様式": { "score": 32, "type": "F" },
    "対人距離": { "score": 28, "type": "Y" },
    "感情表現": { "score": 20, "type": "K" },
    "価値基準": { "score": 15, "type": "S" }
  },
  "friend_type": "GRKS",
  "friend_scores": {
    "行動様式": { "score": 18, "type": "G" },
    "対人距離": { "score": 29, "type": "Y" },
    "感情表現": { "score": 19, "type": "H" },
    "価値基準": { "score": 14, "type": "S" }
  },
  "friend_count": 3,
  "friend_token": "def456uvw...",
  "gaps": [
    {
      "axis": "行動様式",
      "self": "F",
      "friend": "G",
      "gap_score": 14,
      "message": "あなたは自分を行動的だと思っていますが、周囲には慎重に見えているようです。"
    },
    {
      "axis": "感情表現",
      "self": "K",
      "friend": "H",
      "gap_score": 1,
      "message": null
    }
  ]
}
```

---

### GET `/api/friend/[token]`
友人診断ページの表示に必要な情報を取得する。

**Response：**
```json
{
  "session_exists": true,
  "friend_count": 3
}
```

※ セキュリティのため対象者の名前・結果は返さない

---

### POST `/api/friend/[token]`
友人の回答を送信する。

**Request Body：**
```json
{
  "answers": [2, 4, 1, 5, 2, 4, 1, 5, 3, 3, 4, 5, 2, 3, 4, 1, 3, 5, 2, 4, 1, 3, 5, 2, 4, 3, 5, 1, 3, 4, 2, 5]
}
```

**Response：**
```json
{
  "success": true
}
```

---

## エラーレスポンス

```json
{
  "error": "エラーメッセージ",
  "code": "TOKEN_NOT_FOUND"
}
```

| コード | 説明 |
|--------|------|
| `TOKEN_NOT_FOUND` | 指定トークンが存在しない |
| `INVALID_ANSWERS` | 回答データの形式が不正 |
| `SESSION_NOT_COMPLETED` | 自己診断未完了のセッションへのアクセス |
