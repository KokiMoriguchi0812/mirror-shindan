// 各軸のコード
export type ActionCode = "F" | "G"; // 風(即断) / 岩(熟考)
export type SocialCode = "Y" | "R"; // 野(開放) / 林(内向)
export type EmotionCode = "K" | "H"; // 火(表出) / 氷(内秘)
export type ValueCode = "T" | "S";  // 月(共感) / 山(論理)

export type TypeCode = `${ActionCode}${SocialCode}${EmotionCode}${ValueCode}`;

// 軸名
export type AxisName = "行動様式" | "対人距離" | "感情表現" | "価値基準";

// 質問の向き
export type QuestionPolarity = "positive" | "negative"; // positive=左極, negative=右極

export interface Question {
  id: number;
  axis: AxisName;
  text: string;
  // trueなら「はい=5」が左極（F/Y/K/T）寄り
  positiveIsLeft: boolean;
}

export interface AxisScore {
  raw: number;       // 8〜40
  normalized: number; // 0〜100
  code: ActionCode | SocialCode | EmotionCode | ValueCode;
}

export interface DiagnosisResult {
  typeCode: TypeCode;
  typeName: string;
  kanjiCode: string;
  scores: Record<AxisName, AxisScore>;
}

export interface GapInfo {
  axis: AxisName;
  selfCode: string;
  friendCode: string;
  hasGap: boolean;
  message: string | null;
}

export interface SessionResult {
  selfResult: DiagnosisResult;
  friendResult: DiagnosisResult | null;
  friendCount: number;
  gaps: GapInfo[];
  friendToken: string;
}

// Supabase行の型
export interface SessionRow {
  id: string;
  result_token: string;
  friend_token: string;
  self_answers: number[];
  email: string | null;
  created_at: string;
  updated_at: string;
}

export interface FriendAnswerRow {
  id: string;
  session_id: string;
  answers: number[];
  created_at: string;
}
