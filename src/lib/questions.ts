import type { Question } from "./types";

export const QUESTIONS: Question[] = [
  // ── 行動様式（F風:即断即行 / G岩:熟考慎重）──
  {
    id: 1,
    axis: "行動様式",
    text: "新しいことに挑戦する時、計画より先に動き出すことが多い",
    positiveIsLeft: true, // はい=F寄り
  },
  {
    id: 2,
    axis: "行動様式",
    text: "大事な決断をする前に、できるだけ多くの情報を集める",
    positiveIsLeft: false, // はい=G寄り
  },
  {
    id: 3,
    axis: "行動様式",
    text: "友人に急に誘われても、その場でほぼ即決できる",
    positiveIsLeft: true,
  },
  {
    id: 4,
    axis: "行動様式",
    text: "何かを選ぶ時、すぐには決められず時間がかかる方だ",
    positiveIsLeft: false,
  },
  {
    id: 5,
    axis: "行動様式",
    text: "直感で決めたことを、あとから後悔することは少ない",
    positiveIsLeft: true,
  },
  {
    id: 6,
    axis: "行動様式",
    text: "ハプニングが起きても、すぐに気持ちを切り替えて行動できる",
    positiveIsLeft: true,
  },
  {
    id: 7,
    axis: "行動様式",
    text: "急なトラブルが起きた時、考えるより先に体が動く",
    positiveIsLeft: true,
  },
  {
    id: 8,
    axis: "行動様式",
    text: "自分のミスに気づいた時、すぐ動くより先に原因を整理したくなる",
    positiveIsLeft: false,
  },

  // ── 対人距離（Y野:積極開放 / R林:内向静）──
  {
    id: 9,
    axis: "対人距離",
    text: "初めて会う人に、自分から積極的に話しかけられる",
    positiveIsLeft: true,
  },
  {
    id: 10,
    axis: "対人距離",
    text: "一人でいる時間が続くと、誰かと会いたい気持ちが強くなる",
    positiveIsLeft: true,
  },
  {
    id: 11,
    axis: "対人距離",
    text: "広く浅くより、少数の人と深く関わる方が好きだ",
    positiveIsLeft: false,
  },
  {
    id: 12,
    axis: "対人距離",
    text: "大人数の場より、一対一や少人数の方が居心地がいい",
    positiveIsLeft: false,
  },
  {
    id: 13,
    axis: "対人距離",
    text: "仲のいい友人とはできるだけ頻繁に連絡を取りたい",
    positiveIsLeft: true,
  },
  {
    id: 14,
    axis: "対人距離",
    text: "知らない人が多い場所でも、比較的リラックスできる",
    positiveIsLeft: true,
  },
  {
    id: 15,
    axis: "対人距離",
    text: "人と関わる機会が減ると、モチベーションが落ちてくる",
    positiveIsLeft: true,
  },
  {
    id: 16,
    axis: "対人距離",
    text: "悩みがある時、誰かに話すより一人で整理することが多い",
    positiveIsLeft: false,
  },

  // ── 感情表現（K火:外に出す / H氷:内に秘める）──
  {
    id: 17,
    axis: "感情表現",
    text: "うれしい・楽しいという感情が、表情や言動に自然と出る",
    positiveIsLeft: true,
  },
  {
    id: 18,
    axis: "感情表現",
    text: "喜怒哀楽が、表情や言動に自然と出てしまうことが多い",
    positiveIsLeft: true,
  },
  {
    id: 19,
    axis: "感情表現",
    text: "自分の気持ちを言葉にして人に伝えることが得意だ",
    positiveIsLeft: true,
  },
  {
    id: 20,
    axis: "感情表現",
    text: "腹が立っても、その場ではなかなか言い出せない",
    positiveIsLeft: false,
  },
  {
    id: 21,
    axis: "感情表現",
    text: "感情的になっている相手につられて、自分も感情的になることがある",
    positiveIsLeft: true,
  },
  {
    id: 22,
    axis: "感情表現",
    text: "本当に辛い時ほど、元気なふりをしてしまう",
    positiveIsLeft: false,
  },
  {
    id: 23,
    axis: "感情表現",
    text: "限界を超えると、感情が一気に表に出ることがある",
    positiveIsLeft: true,
  },
  {
    id: 24,
    axis: "感情表現",
    text: "追い詰められると、むしろ感情をいっさい出さなくなる",
    positiveIsLeft: false,
  },

  // ── 価値基準（T月:感情共感 / S山:論理安定）──
  {
    id: 25,
    axis: "価値基準",
    text: "物事を決める時、データや根拠より直感や気持ちを重視する",
    positiveIsLeft: true,
  },
  {
    id: 26,
    axis: "価値基準",
    text: "判断に迷ったとき、論理より「気持ち」を優先することが多い",
    positiveIsLeft: true,
  },
  {
    id: 27,
    axis: "価値基準",
    text: "友人の悩みを聞く時、アドバイスより先に気持ちに寄り添いたい",
    positiveIsLeft: true,
  },
  {
    id: 28,
    axis: "価値基準",
    text: "感情に流されず、公平・公正に判断することを大切にしている",
    positiveIsLeft: false,
  },
  {
    id: 29,
    axis: "価値基準",
    text: "正しいことより、相手の気持ちや場の雰囲気を優先することが多い",
    positiveIsLeft: true,
  },
  {
    id: 30,
    axis: "価値基準",
    text: "状況によって判断が変わるより、一定のルールで動く方が安心だ",
    positiveIsLeft: false,
  },
  {
    id: 31,
    axis: "価値基準",
    text: "自分が正しいと思っていても、大切な人が傷つくなら意見を引っ込めることがある",
    positiveIsLeft: true,
  },
  {
    id: 32,
    axis: "価値基準",
    text: "不公平な出来事に直面した時、感情より「筋が通るかどうか」で判断したくなる",
    positiveIsLeft: false,
  },
];

// 友人診断用：質問文を3人称に変換
export function toFriendQuestion(text: string, name: string): string {
  return text
    .replace(/自分の/g, `${name}さんの`)
    .replace(/^([^、。]+)(?=[、。]|$)/, (match) => {
      // 文頭の主語省略を補完
      return match;
    });
}

export const AXES = ["行動様式", "対人距離", "感情表現", "価値基準"] as const;
