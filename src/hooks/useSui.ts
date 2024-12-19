import {SuiClient} from "@mysten/sui/client";
import {getFullnodeUrl} from "@mysten/sui/client";
import {createNetworkConfig} from "@mysten/dapp-kit";

const env = import.meta.env;
export const SUI_NETWORK = env.VITE_SUI_NETWORK;

const {networkConfig, useNetworkVariable, useNetworkVariables} =
    createNetworkConfig({
        devnet: {
            url: getFullnodeUrl("devnet"),
        },
        testnet: {
            url: getFullnodeUrl("testnet"),
        },
        mainnet: {
            url: getFullnodeUrl("mainnet"),
        },
    });

export const useSui = () => {
    const FULL_NODE = {url: getFullnodeUrl(SUI_NETWORK)};
    const suiClient = new SuiClient(FULL_NODE);

    return {suiClient};
};

export {useNetworkVariable, useNetworkVariables, networkConfig};
