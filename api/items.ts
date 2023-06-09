export interface Item {
    id: string;
    name: string;
    cost: Gold;
    level: number;
    type: string;
    traits: { rarity: string; value: string[] };
}

export interface Gold {
    spend: boolean;
    platinum?: number;
    gold?: number;
    silver?: number;
    copper?: number;
}

export function sumGold(...inputs: Gold[]): Gold {
    var total: Gold = { spend: false, platinum: 0, gold: 0, silver: 0, copper: 0 };

    inputs.forEach((i) => {
        total.platinum! += i.platinum || 0;
        total.gold! += i.gold || 0;
        total.silver! += i.silver || 0;
        total.copper! += i.copper || 0;
    });

    return total;
}

export function money2string(i: number): string {
    var abs = Math.abs(i);
    var gold = Math.floor(abs);
    var silver = Math.floor(Math.floor(abs * 10) % 10);
    var copper = Math.floor(Math.floor(abs * 100) % 10);
    var negative = i < 0 ? "-" : "";

    return `${negative}${gold} gp ${silver} sp ${copper} cp`;
}

export function simplifyGold(input: Gold): number {
    var value = 0;

    if (!input) {
        return value;
    }

    if (input.platinum) {
        value += input.platinum * 10;
    }
    if (input.gold) {
        value += input.gold;
    }
    if (input.silver) {
        value += input.silver / 10;
    }
    if (input.copper) {
        value += input.copper / 100;
    }

    return value;
}

export {};
