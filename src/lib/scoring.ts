import { QUESTIONS, AXES } from "./questions";
import type {
  AxisName,
  AxisScore,
  DiagnosisResult,
  TypeCode,
  ActionCode,
  SocialCode,
  EmotionCode,
  ValueCode,
} from "./types";

// タイプ名マスタ
export const TYPE_NAMES: Record<string, { name: string; kanji: string; description: string }> = {
  FYKT: { name: "革命家",  kanji: "風野火月", description: "情熱と共感で人を動かす" },
  FYKS: { name: "指揮者",  kanji: "風野火山", description: "カリスマで集団を導く" },
  FYHT: { name: "外交家",  kanji: "風野氷月", description: "笑顔の裏に深い洞察" },
  FYHS: { name: "先駆者",  kanji: "風野氷山", description: "冷静に道を切り開く" },
  FRKT: { name: "表現者",  kanji: "風林火月", description: "孤独の中で燃える創造性" },
  FRKS: { name: "覇者",    kanji: "風林火山", description: "孤高の天才戦略家" },
  FRHT: { name: "守護者",  kanji: "風林氷月", description: "静かに、確実に守り抜く" },
  FRHS: { name: "実行者",  kanji: "風林氷山", description: "無口な完遂者" },
  GYKT: { name: "包容者",  kanji: "岩野火月", description: "誰をも包み込む大きな愛" },
  GYKS: { name: "啓発者",  kanji: "岩野火山", description: "人を育てる知恵の持ち主" },
  GYHT: { name: "調停者",  kanji: "岩野氷月", description: "争いを静める平和の象徴" },
  GYHS: { name: "参謀",    kanji: "岩野氷山", description: "データで最善手を導く" },
  GRKT: { name: "詩人",    kanji: "岩林火月", description: "繊細な感性と深い共感" },
  GRKS: { name: "探求者",  kanji: "岩林火山", description: "真理を求めてやまない" },
  GRHT: { name: "哲学者",  kanji: "岩林氷月", description: "静寂の中に深い洞察" },
  GRHS: { name: "思想家",  kanji: "岩林氷山", description: "孤高の完璧主義者" },
};

// ギャップ解説文
const GAP_MESSAGES: Record<AxisName, { selfLeft: string; selfRight: string }> = {
  行動様式: {
    selfLeft:  "あなたは自分を行動的だと感じていますが、周囲には慎重に見えているようです。内側の情熱が外に伝わりにくいのかもしれません。",
    selfRight: "あなたは自分を慎重だと思っていますが、周囲にはテキパキ動く人に映っているようです。",
  },
  対人距離: {
    selfLeft:  "あなたは自分を社交的だと思っていますが、周囲にはどこか距離感がある印象を与えているかもしれません。",
    selfRight: "あなたは自分を内向きだと感じていますが、周囲にはオープンで親しみやすい人に見えているようです。",
  },
  感情表現: {
    selfLeft:  "あなたは感情を表に出していると思っていますが、周囲にはクールに見えているようです。気持ちをもう少し言葉にしてみると伝わりやすくなるかもしれません。",
    selfRight: "あなたは感情を抑えているつもりでも、周囲にはよく感情が出ている人に見えているようです。",
  },
  価値基準: {
    selfLeft:  "あなたは感情・共感を大切にしていると思っていますが、周囲には論理的・冷静な人に見えているようです。",
    selfRight: "あなたは論理や安定を重視していると思っていますが、周囲には感情豊かで共感力がある人に映っているようです。",
  },
};

/**
 * 1軸分のスコアを計算する
 * 各軸8問。positiveIsLeft=true の問は回答値をそのまま加算（5=左極寄り）
 * positiveIsLeft=false の問は反転（5=右極寄り → 左極スコアとして1扱い）
 * 合計 8〜40 → 25未満は右極、25以上は左極
 */
function calcAxisScore(
  answers: number[],
  axis: AxisName,
  leftCode: string,
  rightCode: string
): AxisScore {
  const axisQuestions = QUESTIONS.filter((q) => q.axis === axis);

  let total = 0;
  for (const q of axisQuestions) {
    const val = answers[q.id - 1]; // 0-indexed
    total += q.positiveIsLeft ? val : 6 - val;
  }

  const normalized = Math.round(((total - 8) / 32) * 100);
  const code = total >= 25 ? leftCode : rightCode;

  return { raw: total, normalized, code: code as AxisScore["code"] };
}

/**
 * 32問の回答配列からタイプを判定する
 */
export function calcResult(answers: number[]): DiagnosisResult {
  const actionScore  = calcAxisScore(answers, "行動様式", "F", "G");
  const socialScore  = calcAxisScore(answers, "対人距離", "Y", "R");
  const emotionScore = calcAxisScore(answers, "感情表現", "K", "H");
  const valueScore   = calcAxisScore(answers, "価値基準", "T", "S");

  const typeCode = `${actionScore.code}${socialScore.code}${emotionScore.code}${valueScore.code}` as TypeCode;
  const typeInfo = TYPE_NAMES[typeCode];

  return {
    typeCode,
    typeName:  typeInfo.name,
    kanjiCode: typeInfo.kanji,
    scores: {
      行動様式: actionScore,
      対人距離: socialScore,
      感情表現: emotionScore,
      価値基準: valueScore,
    },
  };
}

/**
 * 複数の友人回答を平均してタイプを判定する
 */
export function calcFriendResult(allAnswers: number[][]): DiagnosisResult | null {
  if (allAnswers.length === 0) return null;

  // 32問それぞれの平均を計算（小数点以下は四捨五入）
  const averaged = Array.from({ length: 32 }, (_, i) => {
    const sum = allAnswers.reduce((acc, a) => acc + a[i], 0);
    return Math.round(sum / allAnswers.length);
  });

  return calcResult(averaged);
}

/**
 * 自己像と他者像のギャップを生成する
 */
export function calcGaps(
  self: DiagnosisResult,
  friend: DiagnosisResult | null
) {
  if (!friend) return [];

  return AXES.map((axis) => {
    const selfCode   = self.scores[axis].code;
    const friendCode = friend.scores[axis].code;
    const hasGap     = selfCode !== friendCode;

    let message: string | null = null;
    if (hasGap) {
      const msgs = GAP_MESSAGES[axis];
      const isLeftPoles = ["F", "Y", "K", "T"];
      message = isLeftPoles.includes(selfCode) ? msgs.selfLeft : msgs.selfRight;
    }

    return { axis, selfCode, friendCode, hasGap, message };
  });
}

// 友人視点のギャップ解説文（「あなた」→「友人」、「周囲」→「あなた」に置換）
const FRIEND_GAP_MESSAGES: Record<AxisName, { selfLeft: string; selfRight: string }> = {
  行動様式: {
    selfLeft:  "友人は自分を行動的だと感じているようですが、あなたの目には慎重に見えているようです。内側の情熱が外に伝わりにくいのかもしれません。",
    selfRight: "友人は自分を慎重だと思っているようですが、あなたの目にはテキパキ動く人に映っているようです。",
  },
  対人距離: {
    selfLeft:  "友人は自分を社交的だと思っているようですが、あなたの目にはどこか距離感がある印象を受けるかもしれません。",
    selfRight: "友人は自分を内向きだと感じているようですが、あなたの目にはオープンで親しみやすい人に見えているようです。",
  },
  感情表現: {
    selfLeft:  "友人は感情を表に出していると思っているようですが、あなたの目にはクールに見えているようです。気持ちを言葉にするともっと伝わるかもしれません。",
    selfRight: "友人は感情を抑えているつもりのようですが、あなたの目にはよく感情が出ている人に見えているようです。",
  },
  価値基準: {
    selfLeft:  "友人は感情・共感を大切にしていると思っているようですが、あなたの目には論理的・冷静な人に見えているようです。",
    selfRight: "友人は論理や安定を重視していると思っているようですが、あなたの目には感情豊かで共感力がある人に映っているようです。",
  },
};

/**
 * 友人視点のギャップを生成する（友人の結果ページ用）
 * self = 被診断者の自己診断 / friend = 回答した友人が見た結果
 */
export function calcFriendGaps(
  self: DiagnosisResult,
  friend: DiagnosisResult | null
) {
  if (!friend) return [];

  return AXES.map((axis) => {
    const selfCode   = self.scores[axis].code;
    const friendCode = friend.scores[axis].code;
    const hasGap     = selfCode !== friendCode;

    let message: string | null = null;
    if (hasGap) {
      const msgs = FRIEND_GAP_MESSAGES[axis];
      const isLeftPoles = ["F", "Y", "K", "T"];
      message = isLeftPoles.includes(selfCode) ? msgs.selfLeft : msgs.selfRight;
    }

    return { axis, selfCode, friendCode, hasGap, message };
  });
}

/**
 * スコアを0〜100のパーセンテージに変換（表示用）
 * 50=中央、100=完全に左極、0=完全に右極
 */
export function scoreToPercent(raw: number): number {
  return Math.round(((raw - 8) / 32) * 100);
}
