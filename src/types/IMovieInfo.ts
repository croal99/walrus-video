export interface IManageStoreOnChain {
    id: {
        id: string;
    };
    owner: string;
    managers: string[];
}

export interface IManageOnChain {
    id: {
        id: string;
    };
    owner: string;
    subscribe_total: number;
    info: string;
    fee: number;
    name: string;
}

export interface IMovieOnChain {
    id: {
        id: string;
    };
    owner: string;
    url: string;
    name: string;
    title: string;
    tag: string;
    actors: string;
    year: string;
    description: string;
    total_count: number;
    free_count: number;
    fee: number;
    blob_ids: string[];
    coin: number;
    salt: string;
    manger_id: string;
}
