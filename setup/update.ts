import {Ed25519Keypair} from '@mysten/sui/keypairs/ed25519';
import {IManageInfo, useConfig} from './utils/config';
import {useManage} from "./utils/useManage"

const {getConfig, MOVIE_PACKAGE_ID, ADMIN_SECRET_KEY, SUI_NETWORK} = useConfig();
const {handleUpdateManager} = useManage();


const keyPair = Ed25519Keypair.deriveKeypair(ADMIN_SECRET_KEY);

console.log("network:", SUI_NETWORK);
console.log("address:", keyPair.getPublicKey().toSuiAddress());
console.log("package id:", MOVIE_PACKAGE_ID);

// script.ts
const args: string[] = process.argv.slice(2); // 去掉前两个参数
const moviePath = args[0];

console.log('movie path:', moviePath);
const config: IManageInfo = getConfig(moviePath);
// console.log("config", config);

if (config.manageId) {
    // console.log("create manange");
    await handleUpdateManager(config);
}
