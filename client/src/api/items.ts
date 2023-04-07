import axios from 'axios';

export interface Item {
    id: string;
    name: string;
    cost: Gold;
    level: number;
}

export interface Gold {
    pp: number;
    gp: number;
    sp: number;
    cp: number;
}

// TODO: remove this
class Client {
    getItems = async (filter: string | undefined): Promise<Item[] | void> => {
        var filterString = (filter ? `?filter=${filter}` : "");
        var url = `http://localhost:3001/api/v1/items${filterString}`;

        return axios.get(url).then((response) => {
            return response.data
        })
    }
}

export { Client }
