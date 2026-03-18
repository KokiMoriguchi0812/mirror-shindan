import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServiceClient } from "@/lib/supabase";
import { calcResult, calcFriendResult, calcGaps } from "@/lib/scoring";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

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
    hasUserId: !!session.user_id,
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

  // ログイン済みの場合はuser_idも保存
  let userId: string | null = null;
  const authHeader = req.headers.get("Authorization");
  const accessToken = authHeader?.replace("Bearer ", "");
  if (accessToken) {
    const anonClient = createClient(supabaseUrl, supabaseAnon);
    const { data: { user } } = await anonClient.auth.getUser(accessToken);
    userId = user?.id ?? null;
  }

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("sessions")
    .update({
      self_answers: answers,
      updated_at: new Date().toISOString(),
      ...(userId ? { user_id: userId } : {}),
    })
    .eq("result_token", token);

  if (error) {
    return NextResponse.json({ error: "保存に失敗しました" }, { status: 500 });
  }

  const selfResult = calcResult(answers);
  return NextResponse.json({ success: true, self_type: selfResult.typeCode });
}
