import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase";
import { calcResult, calcFriendResult, calcGaps } from "@/lib/scoring";
import type { SessionResult } from "@/lib/types";
import ResultPageClient from "./ResultPageClient";

interface Props {
  params: Promise<{ token: string }>;
}

async function getResult(token: string): Promise<(SessionResult & { hasUserId: boolean }) | null> {
  const supabase = createServiceClient();

  const { data: session, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("result_token", token)
    .single();

  if (error || !session) return null;
  if (!session.self_answers || session.self_answers.length !== 32) return null;

  const { data: friendRows } = await supabase
    .from("friend_answers")
    .select("answers")
    .eq("session_id", session.id);

  const friendAnswers = (friendRows ?? []).map((r: { answers: number[] }) => r.answers);

  const selfResult   = calcResult(session.self_answers);
  const friendResult = calcFriendResult(friendAnswers);
  const gaps         = calcGaps(selfResult, friendResult);

  return {
    selfResult,
    friendResult,
    friendCount: friendAnswers.length,
    gaps,
    friendToken: session.friend_token,
    hasUserId: !!session.user_id,
  };
}

export default async function ResultPage({ params }: Props) {
  const { token } = await params;
  const data = await getResult(token);

  if (!data) notFound();

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://mirror-shindan.vercel.app";
  const resultUrl = `${baseUrl}/result/${token}`;
  const friendUrl = `${baseUrl}/friend/${data.friendToken}`;

  return (
    <ResultPageClient
      data={data}
      token={token}
      resultUrl={resultUrl}
      friendUrl={friendUrl}
    />
  );
}
