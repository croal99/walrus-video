import dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config({path: '.env.local'});

export interface IStoreInfo {
    objectId: string;
    managers: IManageInfo[];
}

export interface IManageInfo {
    storeId: string;
    manageId: string;
    infoId: string;
    blob_ids: string[];
    movie_info: IMovieInfo;
    key: string;
    iv: string;
}

export interface IMovieInfo {
    name: string;
    url: string;
    title: string;
    tag: string;
    actors: string;
    year: string;
    description: string;
    total: number;
    free: number;
    fee: number;
}

export interface IBlobKeyInfo {
    key: string;
    iv: string;
}

export const useConfig = () => {
    const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || "";
    const SUI_NETWORK = process.env.SUI_NETWORK || "testnet";
    const MOVIE_PACKAGE_ID = process.env.VITE_MOVIE_PACKAGE_ID || "";
    const MAIN_STORE_ID = process.env.VITE_MAIN_STORE_ID || "";
    const WALRUS_PUBLISHER = process.env.WALRUS_PUBLISHER || "https://aggregator.walrus-testnet.walrus.space";

   const getConfig = (filePath: string) => {
        const filename: string = path.join(filePath, "config.json");
        console.log(`read config from ${filename}`);
        try {
            const jsonData: string = fs.readFileSync(filename, 'utf-8');

            const data: IManageInfo = JSON.parse(jsonData);

            return data;
        } catch (error) {
            // console.error(error);
            throw error;
        }
    }

    const setConfig = (filePath: string, config: IManageInfo) => {
        const filename: string = path.join(filePath, "config.json");
        const jsonData = JSON.stringify(config, null, 2);

        try {
            fs.writeFileSync(filename, jsonData);
            console.log('文件写入成功!');
        } catch (err) {
            console.log('写入文件失败:', err);
        }
    }

    return {
        ADMIN_SECRET_KEY,
        SUI_NETWORK,
        MOVIE_PACKAGE_ID,
        MAIN_STORE_ID,
        WALRUS_PUBLISHER,
        getConfig,
        setConfig,
    }
}