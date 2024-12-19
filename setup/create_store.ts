import {Ed25519Keypair} from '@mysten/sui/keypairs/ed25519';
import {useConfig} from './utils/config';
import {initStore} from "./utils/init_store"


const {MOVIE_PACKAGE_ID, ADMIN_SECRET_KEY, SUI_NETWORK} = useConfig();


const keyPair = Ed25519Keypair.deriveKeypair(ADMIN_SECRET_KEY);

console.log("network:", SUI_NETWORK);
console.log("address:", keyPair.getPublicKey().toSuiAddress());
console.log("package id:", MOVIE_PACKAGE_ID);

const storeObjectId = await initStore();
console.log("store object Id:", storeObjectId);
