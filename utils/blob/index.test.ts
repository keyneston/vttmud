import { scoreToBonus, calculateScore } from "./index";

describe("Testing scoreToBonus", () => {
    it("handles negatives", () => {
        expect(scoreToBonus(8)).toBe(-1);
    });

    it("maps 18 to 4", () => {
        expect(scoreToBonus(18)).toBe(4);
    });

    it("handles half bonuses", () => {
        expect(scoreToBonus(19)).toBe(4);
    });
});

describe("Testing calculateScore", () => {
    it("translates negative boosts", () => {
        expect(calculateScore(-1)).toBe(8);
    });

    it("handles sub-4 boosts", () => {
        expect(calculateScore(3)).toBe(16);
    });

    it("handles super-4 boosts", () => {
        expect(calculateScore(5)).toBe(19);
    });
});
