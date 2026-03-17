import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { calcResult, calcFriendResult, calcGaps } from "@/lib/scoring";

// GET /api/sessions/[token] - 結果取得
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const supabase = createServiceClient();

  const { data: session, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("result_token", token)
    .single();

  if (error || !session) {
    return NextResponse.json({ error: "TOKEN_NOT_FOUND" }, { status: 404 });
  }

  if (!session.self_answers || session.self_answers.length !== 32) {
    return NextResponse.json({ error: "SESSION_NOT_COMPLETED" }, { status: 400 });
  }

  // 友人回答を取得
  const { data: friendRows } = await supabase
    .from("friend_answers")
    .select("answers")
    .eq("session_id", session.id);

  const friendAnswers = (friendRows ?? []).map((r) => r.answers as number[]);

  const selfResult   = calcResult(session.self_answers);
  const friendResult = calcFriendResult(friendAnswers);
  const gaps         = calcGaps(selfResult, friendResult);

  return NextResponse.json({
    selfResult,
    friendResult,
    friendCount: friendAnswers.length,
    gaps,
    friendToken: session.friend_token,
  });
}

// PUT /api/sessions/[token] - 自己回答を保存
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const { answers } = await req.json();

  if (!Array.isArray(answers) || answers.length !== 32) {
    return NextResponse.json({ error: "INVALID_ANSWERS" }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { error } = await supabase
    .from("sessions")
    .update({ self_answers: answers, updated_at: new Date().toISOString() })
    .eq("result_token", token);

  if (error) {
    return NextResponse.json({ error: "保存に失敗しました" }, { status: 500 });
  }

  const selfResult = calcResult(answers);

  return NextResponse.json({ success: true, self_type: selfResult.typeCode });
}
