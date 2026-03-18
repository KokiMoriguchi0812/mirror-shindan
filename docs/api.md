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
| PUT | `/api/sessions/[token]` | 自己回答を保存（user_id関連付け対応） |
| GET | `/api/sessions/[token]` | 結果・ギャップデータ取得 |
| POST | `/api/sessions/[token]/save` | ログイン後にセッションをアカウントへ保存 |
| GET | `/api/friend/[token]` | 友人診断ページ用情報・本人自己診断結果取得 |
| POST | `/api/friend/[token]` | 友人回答を送信 |

---

## 詳細

### POST `/api/sessions`
新しい診断セッションを作成し、トークンを発行する。

**Response：**
```json
{
  "result_token": "abc123xyz...",
  "friend_token": "def456uvw..."
}
```

---

### PUT `/api/sessions/[token]`
自己診断の回答を保存する。ログイン済みの場合はuser_idも関連付ける。

**Headers（任意）：**
```
Authorization: Bearer <supabase_access_token>
```

**Request Body：**
```json
{
  "answers": [3, 5, 2, 4, ...]
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
  "selfResult": { "typeCode": "FRKS", "typeName": "覇者", "kanjiCode": "風林火山", "scores": {...} },
  "friendResult": { ... } | null,
  "friendCount": 3,
  "gaps": [...],
  "friendToken": "def456uvw...",
  "hasUserId": true
}
```

---

### POST `/api/sessions/[token]/save`
ログイン後に、既存のセッションをアカウントに関連付ける。

**Headers（必須）：**
```
Authorization: Bearer <supabase_access_token>
```

**Response：**
```json
{ "success": true }
```

---

### GET `/api/friend/[token]`
友人診断ページの表示に必要な情報と、本人の自己診断結果を取得する。

**Response：**
```json
{
  "session_exists": true,
  "friend_count": 3,
  "self_result": {
    "typeCode": "FRKS",
    "typeName": "覇者",
    "kanjiCode": "風林火山",
    "scores": {...}
  }
}
```

---

### POST `/api/friend/[token]`
友人の回答を送信する。

**Request Body：**
```json
{
  "answers": [2, 4, 1, 5, ...]
}
```

**Response：**
```json
{ "success": true }
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
| `Unauthorized` | 認証トークンが無効または未提供 |
