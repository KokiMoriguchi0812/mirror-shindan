import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { calcResult } from "@/lib/scoring";

// GET /api/friend/[token] - 友人診断ページ用情報取得
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const supabase = createServiceClient();

  const { data: session, error } = await supabase
    .from("sessions")
    .select("id, self_answers")
    .eq("friend_token", token)
    .single();

  if (error || !session) {
    return NextResponse.json({ session_exists: false }, { status: 404 });
  }

  const { count } = await supabase
    .from("friend_answers")
    .select("*", { count: "exact", head: true })
    .eq("session_id", session.id);

  const selfResult =
    session.self_answers && session.self_answers.length === 32
      ? calcResult(session.self_answers)
      : null;

  return NextResponse.json({
    session_exists: true,
    friend_count: count ?? 0,
    self_result: selfResult,
  });
}

// POST /api/friend/[token] - 友人回答を送信
export async function POST(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const { answers } = await req.json();

  if (!Array.isArray(answers) || answers.length !== 32) {
    return NextResponse.json({ error: "INVALID_ANSWERS" }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { data: session, error: sessionError } = await supabase
    .from("sessions")
    .select("id")
    .eq("friend_token", token)
    .single();

  if (sessionError || !session) {
    return NextResponse.json({ error: "TOKEN_NOT_FOUND" }, { status: 404 });
  }

  const { error } = await supabase.from("friend_answers").insert({
    session_id: session.id,
    answers,
  });

  if (error) {
    return NextResponse.json({ error: "保存に失敗しました" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
