import { describe, it, expect } from "vitest";
import { calcResult, calcFriendResult, calcGaps } from "@/lib/scoring";

// 全問5 → 5+3分布で全軸が左極（FYKT）になる
const allFive  = Array(32).fill(5);
// 全問1 → 5+3分布で全軸が右極（GRHS）になる
const allOne   = Array(32).fill(1);
// 全問3 → 中央値（スコア=24）→ 右極になる（< 25）
const allThree = Array(32).fill(3);

/**
 * 各軸の左右分布（5+3に統一後）
 * 行動様式 F: Q1,Q3,Q5,Q6,Q7(true=5)  G: Q2,Q4,Q8(false=3)
 * 対人距離 Y: Q9,Q10,Q13,Q14,Q15(true) R: Q11,Q12,Q16(false)
 * 感情表現 K: Q17,Q18,Q19,Q21,Q23(true) H: Q20,Q22,Q24(false)
 * 価値基準 T: Q25,Q26,Q27,Q29,Q31(true) S: Q28,Q30,Q32(false)
 *
 * FRKS 回答: 行動F(左), 対人R(右), 感情K(左), 価値S(右)
 */
function buildFrksAnswers(): number[] {
  const a = Array(32).fill(3);
  // 行動様式 → F（左極）: 左極質問=5, 右極質問=1
  [1, 3, 5, 6, 7].forEach((id) => { a[id - 1] = 5; }); // F-leaning
  [2, 4, 8].forEach((id)       => { a[id - 1] = 1; }); // G-leaning
  // 対人距離 → R（右極）: 左極質問=1, 右極質問=5
  [9, 10, 13, 14, 15].forEach((id) => { a[id - 1] = 1; }); // Y-leaning
  [11, 12, 16].forEach((id)        => { a[id - 1] = 5; }); // R-leaning
  // 感情表現 → K（左極）: 左極質問=5, 右極質問=1
  [17, 18, 19, 21, 23].forEach((id) => { a[id - 1] = 5; }); // K-leaning
  [20, 22, 24].forEach((id)          => { a[id - 1] = 1; }); // H-leaning
  // 価値基準 → S（右極）: 左極質問=1, 右極質問=5
  [25, 26, 27, 29, 31].forEach((id) => { a[id - 1] = 1; }); // T-leaning
  [28, 30, 32].forEach((id)          => { a[id - 1] = 5; }); // S-leaning
  return a;
}

describe("calcResult", () => {
  it("全問5のとき全軸が左極（FYKT）になる", () => {
    const result = calcResult(allFive);
    expect(result.typeCode).toBe("FYKT");
  });

  it("全問1のとき全軸が右極（GRHS）になる", () => {
    const result = calcResult(allOne);
    expect(result.typeCode).toBe("GRHS");
  });

  it("タイプ名が取得できる", () => {
    const result = calcResult(allFive);
    expect(result.typeName).toBe("革命家");
    expect(result.kanjiCode).toBe("風野火月");
  });

  it("スコアは8〜40の範囲内に収まる", () => {
    const result = calcResult(allFive);
    for (const score of Object.values(result.scores)) {
      expect(score.raw).toBeGreaterThanOrEqual(8);
      expect(score.raw).toBeLessThanOrEqual(40);
    }
  });

  it("正規化スコアは0〜100の範囲内に収まる", () => {
    const result = calcResult(allFive);
    for (const score of Object.values(result.scores)) {
      expect(score.normalized).toBeGreaterThanOrEqual(0);
      expect(score.normalized).toBeLessThanOrEqual(100);
    }
  });

  it("FRKS（風林火山）タイプが正しく生成される", () => {
    const answers = buildFrksAnswers();
    const result  = calcResult(answers);
    expect(result.typeCode).toBe("FRKS");
    expect(result.typeName).toBe("覇者");
  });
});

describe("calcFriendResult", () => {
  it("空配列のときnullを返す", () => {
    expect(calcFriendResult([])).toBeNull();
  });

  it("1人分の回答を正しく処理する", () => {
    const result = calcFriendResult([allFive]);
    expect(result?.typeCode).toBe("FYKT");
  });

  it("複数人の平均を正しく計算する（全5と全1の平均→全3→右極GRHS）", () => {
    const result = calcFriendResult([allFive, allOne]);
    expect(result?.typeCode).toBe("GRHS");
  });
});

describe("calcGaps", () => {
  it("自己と他者が同じタイプのときギャップなし", () => {
    const self   = calcResult(allFive);
    const friend = calcFriendResult([allFive]);
    const gaps   = calcGaps(self, friend!);
    expect(gaps.every((g) => !g.hasGap)).toBe(true);
  });

  it("自己と他者が異なるとき全軸にギャップとメッセージが入る", () => {
    const self   = calcResult(allFive);   // FYKT
    const friend = calcFriendResult([allOne]); // GRHS
    const gaps   = calcGaps(self, friend!);
    expect(gaps.every((g) => g.hasGap)).toBe(true);
    expect(gaps.every((g) => g.message !== null)).toBe(true);
  });

  it("friendがnullのとき空配列を返す", () => {
    const self = calcResult(allFive);
    expect(calcGaps(self, null)).toEqual([]);
  });
});
