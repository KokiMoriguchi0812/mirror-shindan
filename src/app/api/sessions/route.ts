import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { nanoid } from "nanoid";

export async function POST() {
  const supabase = createServiceClient();
  const result_token = nanoid(12);
  const friend_token = nanoid(12);

  const { error } = await supabase.from("sessions").insert({
    result_token,
    friend_token,
    self_answers: [],
  });

  if (error) {
    return NextResponse.json({ error: "セッションの作成に失敗しました" }, { status: 500 });
  }

  return NextResponse.json({ result_token, friend_token });
}
