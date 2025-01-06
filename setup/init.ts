import {Ed25519Keypair} from '@mysten/sui/keypairs/ed25519';
import {IManageInfo, useConfig} from './utils/config';
import {useManage} from "./utils/useManage"
import {useUploadMovies} from "./utils/upload"


const {getConfig, setConfig, MOVIE_PACKAGE_ID, MAIN_STORE_ID, ADMIN_SECRET_KEY, SUI_NETWORK, WALRUS_PUBLISHER} = useConfig();
const {initKeys, updateBlobIDs, uploadMovies} = useUploadMovies();
const {handleCreateManager} = useManage();


const keyPair = Ed25519Keypair.deriveKeypair(ADMIN_SECRET_KEY);

console.log("network:", SUI_NETWORK);
console.log("address:", keyPair.getPublicKey().toSuiAddress());
console.log("package id:", MOVIE_PACKAGE_ID);
console.log("walrus HTTP API:", WALRUS_PUBLISHER);

// script.ts
const args: string[] = process.argv.slice(2); // 去掉前两个参数
const moviePath = args[0];

console.log('movie path:', moviePath);
const config: IManageInfo = getConfig(moviePath);
if (config?.storeId !== MAIN_STORE_ID) {
    delete config.manageId;
    delete config.infoId;
}
config.storeId = MAIN_STORE_ID;

if (!config.manageId) {
    console.log("create manange");
    await handleCreateManager(config);
}

if (!config.key) {
    initKeys(config);
}

await uploadMovies(config, moviePath);

await updateBlobIDs(config);

setConfig(moviePath, config);
