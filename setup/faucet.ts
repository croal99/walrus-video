import {getFullnodeUrl, SuiClient} from '@mysten/sui/client';
import {getFaucetHost, requestSuiFromFaucetV1} from '@mysten/sui/faucet';
import dotenv from 'dotenv';
import {Ed25519Keypair} from '@mysten/sui/keypairs/ed25519';
import {MIST_PER_SUI} from '@mysten/sui/utils';

dotenv.config({path: '.env.local'});

const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || "";
const SUI_NETWORK = process.env.SUI_NETWORK || "testnet";
const keyPair = Ed25519Keypair.deriveKeypair(ADMIN_SECRET_KEY);
const ADMIN_ADDRESS = keyPair.getPublicKey().toSuiAddress()
const suiClient = new SuiClient({url: getFullnodeUrl(SUI_NETWORK)});

console.log("network:", SUI_NETWORK);
console.log("address:", ADMIN_ADDRESS);


const balance = (balance) => {
    return Number.parseInt(balance.totalBalance) / Number(MIST_PER_SUI);
};

const suiBefore = await suiClient.getBalance({
    owner: ADMIN_ADDRESS,
});

await requestSuiFromFaucetV1({
    // use getFaucetHost to make sure you're using correct faucet address
    // you can also just use the address (see Sui TypeScript SDK Quick Start for values)
    host: getFaucetHost(SUI_NETWORK),
    recipient: ADMIN_ADDRESS,
});

const suiAfter = await suiClient.getBalance({
    owner: ADMIN_ADDRESS,
});

console.log(
    `Balance before faucet: ${balance(suiBefore)} SUI. Balance after: ${balance(
        suiAfter,
    )} SUI. Hello, SUI!`,
);