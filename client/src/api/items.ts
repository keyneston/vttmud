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

// TODO: remove this
class Client {
    getItems = async (filter: string | undefined): Promise<Item[] | void> => {
        var filterString = filter ? `?filter=${filter}` : "";
        var url = `/api/v1/items${filterString}`;

        return axios.get(url).then((response) => {
            return response.data;
        });
    };
}

export { Client };
