export interface CraftLevel {
    level: number;
    formulaCost: number;
    dc: number;
    failed: number;
    trained: number;
    expert: number;
    master: number;
    legendary: number;
}

const data: CraftLevel[] = [
    { level: 0, formulaCost: 0.5, dc: 14, failed: 0.01, trained: 0.05, expert: 0.05, master: 0.05, legendary: 0.05 },
    { level: 1, formulaCost: 1, dc: 15, failed: 0.02, trained: 0.2, expert: 0.2, master: 0.2, legendary: 0.2 },
    { level: 2, formulaCost: 2, dc: 16, failed: 0.04, trained: 0.3, expert: 0.3, master: 0.3, legendary: 0.3 },
    { level: 3, formulaCost: 3, dc: 18, failed: 0.08, trained: 0.5, expert: 0.5, master: 0.5, legendary: 0.5 },
    { level: 4, formulaCost: 5, dc: 19, failed: 0.1, trained: 0.7, expert: 0.8, master: 0.8, legendary: 0.8 },
    { level: 5, formulaCost: 8, dc: 20, failed: 0.2, trained: 0.9, expert: 1, master: 1, legendary: 1 },
    { level: 6, formulaCost: 13, dc: 22, failed: 0.3, trained: 1.5, expert: 2, master: 2, legendary: 2 },
    { level: 7, formulaCost: 18, dc: 23, failed: 0.4, trained: 2, expert: 2.5, master: 2.5, legendary: 2.5 },
    { level: 8, formulaCost: 25, dc: 24, failed: 0.5, trained: 2.5, expert: 3, master: 3, legendary: 3 },
    { level: 9, formulaCost: 35, dc: 26, failed: 0.6, trained: 3, expert: 4, master: 4, legendary: 4 },
    { level: 10, formulaCost: 50, dc: 27, failed: 0.7, trained: 4, expert: 5, master: 6, legendary: 6 },
    { level: 11, formulaCost: 70, dc: 28, failed: 0.8, trained: 5, expert: 6, master: 8, legendary: 8 },
    { level: 12, formulaCost: 100, dc: 30, failed: 0.9, trained: 6, expert: 8, master: 10, legendary: 10 },
    { level: 13, formulaCost: 150, dc: 31, failed: 1, trained: 7, expert: 10, master: 15, legendary: 15 },
    { level: 14, formulaCost: 225, dc: 32, failed: 1.5, trained: 8, expert: 15, master: 20, legendary: 20 },
    { level: 15, formulaCost: 325, dc: 34, failed: 2, trained: 10, expert: 20, master: 28, legendary: 28 },
    { level: 16, formulaCost: 500, dc: 35, failed: 2.5, trained: 13, expert: 25, master: 36, legendary: 40 },
    { level: 17, formulaCost: 750, dc: 36, failed: 3, trained: 15, expert: 30, master: 45, legendary: 55 },
    { level: 18, formulaCost: 1200, dc: 38, failed: 4, trained: 20, expert: 45, master: 70, legendary: 90 },
    { level: 19, formulaCost: 2000, dc: 39, failed: 6, trained: 30, expert: 60, master: 100, legendary: 130 },
    { level: 20, formulaCost: 3500, dc: 40, failed: 8, trained: 40, expert: 75, master: 150, legendary: 200 },
    { level: 21, formulaCost: 3500, dc: 50, failed: 0, trained: 50, expert: 90, master: 175, legendary: 300 },
];

function cleanLevel(level: number): number {
    if (level < 0) return 0;
    if (level > 21) return 21;
    return level;
}

export function getLevel(level: number): CraftLevel {
    var l = cleanLevel(level);
    return data[l];
}

export function formulaCost(level: number) {
    var l = cleanLevel(level);

    return data[l].formulaCost;
}

export function craftDC(level: number) {
    var l = cleanLevel(level);

    return data[l].dc;
}

export {};
