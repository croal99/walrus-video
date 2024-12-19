import {useConfig} from './config';
import {getFullnodeUrl, SuiClient} from '@mysten/sui/client';
import {Transaction} from '@mysten/sui/transactions';
import {Ed25519Keypair} from '@mysten/sui/keypairs/ed25519';

const {MOVIE_PACKAGE_ID, ADMIN_SECRET_KEY, SUI_NETWORK } = useConfig();

// 创建store
export const initStore = async () => {
    const tb = new Transaction();
    const keyPair = Ed25519Keypair.deriveKeypair(ADMIN_SECRET_KEY);
    const suiClient = new SuiClient({url: getFullnodeUrl(SUI_NETWORK)});

    tb.moveCall({
        target: `${MOVIE_PACKAGE_ID}::store::create_store`,
        arguments: [],
    });

    const result = await suiClient.signAndExecuteTransaction({
        signer: keyPair,
        transaction: tb,
        requestType: 'WaitForLocalExecution',
        options: {
            showEffects: true,
        },
    });

    // console.log(result.effects.created);
    return result.effects.created[0].reference.objectId;
}


