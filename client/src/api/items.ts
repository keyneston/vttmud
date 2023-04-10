import axios from "axios";

export interface Item {
    id: string;
    name: string;
    cost: Gold;
    level: number;
    type: string;
    traits: { rarity: string; value: string[] };
}

export interface Gold {
    pp?: number;
    gp?: number;
    sp?: number;
    cp?: number;
}

export function sumGold(...inputs: Gold[]): Gold {
    var total: Gold = { pp: 0, gp: 0, sp: 0, cp: 0 };

    inputs.forEach((i) => {
        total.pp! += i.pp || 0;
        total.gp! += i.gp || 0;
        total.sp! += i.sp || 0;
        total.cp! += i.cp || 0;
    });

    return total;
}

export function formatGold(g: Gold): string {
    if (g === undefined) {
        return "";
    }
    return `${10 * (g.pp || 0) + (g.gp || 0)} gp ${g.sp || 0} sp ${g.cp || 0} cp`;
}

export function simplifyGold(input: Gold): number {
    var value = 0;

    if (!input) {
        return value;
    }

    if (input.pp) {
        value += input.pp * 10;
    }
    if (input.gp) {
        value += input.gp;
    }
    if (input.sp) {
        value += input.sp / 10;
    }
    if (input.cp) {
        value += input.cp / 100;
    }

    return value;
}

export {};
