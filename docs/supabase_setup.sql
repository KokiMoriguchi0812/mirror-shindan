-- ミラー診断 Supabase テーブル作成SQL
-- Supabase Dashboard > SQL Editor で実行してください

-- 自己診断セッション
create table sessions (
  token        text primary key,
  self_answers jsonb        not null,
  created_at   timestamptz  default now()
);

-- 友人回答
create table friend_answers (
  id            uuid        primary key default gen_random_uuid(),
  session_token text        not null references sessions(token) on delete cascade,
  answers       jsonb       not null,
  created_at    timestamptz default now()
);

-- インデックス（友人回答の検索を高速化）
create index friend_answers_session_token_idx on friend_answers(session_token);

-- RLS（Row Level Security）を有効化
alter table sessions      enable row level security;
alter table friend_answers enable row level security;

-- API経由のアクセスを許可するポリシー
create policy "service role full access on sessions"
  on sessions for all
  using (true)
  with check (true);

create policy "service role full access on friend_answers"
  on friend_answers for all
  using (true)
  with check (true);
