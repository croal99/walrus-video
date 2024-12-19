import {IStoreInfo, IMovieInfo, useConfig, IManageInfo} from './config';
import {getFullnodeUrl, SuiClient} from '@mysten/sui/client';
import {Transaction} from '@mysten/sui/transactions';
import {Ed25519Keypair} from '@mysten/sui/keypairs/ed25519';

const {MOVIE_PACKAGE_ID, ADMIN_SECRET_KEY, SUI_NETWORK, MAIN_STORE_ID } = useConfig();

export const useManage = () => {
    const keyPair = Ed25519Keypair.deriveKeypair(ADMIN_SECRET_KEY);
    const suiClient = new SuiClient({url: getFullnodeUrl(SUI_NETWORK)});

    const create_manager = async (movie: IMovieInfo) => {
        const tb = new Transaction();
        console.log('movie', movie.name);
        tb.moveCall({
            target: `${MOVIE_PACKAGE_ID}::manage::create_manager`,
            arguments: [
                tb.pure.string(movie.name),
                tb.pure.string(movie.url),
                tb.pure.string(movie.title),
                tb.pure.string(movie.tag),
                tb.pure.string(movie.actors),
                tb.pure.string(movie.year),
                tb.pure.string(movie.description),
                tb.pure.u64(movie.total),
                tb.pure.u64(movie.free),
            ],
        });

        const result = await suiClient.signAndExecuteTransaction({
            signer: keyPair,
            transaction: tb,
            requestType: 'WaitForLocalExecution',
            options: {
                showEffects: true,
            },
        });

        // console.log(result);
        // console.log(result.effects.created);
        let manageId: string;
        let infoId: string;
        for (const objectInfo of result.effects.created) {
            if (objectInfo.owner.Shared) {
                // console.log('manage id', objectInfo.reference.objectId);
                manageId = objectInfo.reference.objectId;
            } else {
                infoId = objectInfo.reference.objectId;
            }
        }

        // @ts-ignore
        return {manageId, infoId};
    }

    const update_manager = async (config: IManageInfo) => {
        const tb = new Transaction();

        tb.moveCall({
            target: `${MOVIE_PACKAGE_ID}::manage::update_name`,
            arguments: [
                tb.object(config.infoId),
                tb.object(config.manageId),
                tb.pure.string(config.movie_info.name),
            ],
        });

        tb.moveCall({
            target: `${MOVIE_PACKAGE_ID}::manage::update_url`,
            arguments: [
                tb.object(config.infoId),
                tb.pure.string(config.movie_info.url),
            ],
        });

        tb.moveCall({
            target: `${MOVIE_PACKAGE_ID}::manage::update_description`,
            arguments: [
                tb.object(config.infoId),
                tb.pure.string(config.movie_info.description),
            ],
        });

        const result = await suiClient.signAndExecuteTransaction({
            signer: keyPair,
            transaction: tb,
            requestType: 'WaitForLocalExecution',
            options: {
                showEffects: true,
            },
        });
    }

    const add_manage = async (storeId: string, manageId: string) => {
        const tb = new Transaction();
        tb.moveCall({
            target: `${MOVIE_PACKAGE_ID}::store::add_manage`,
            arguments: [
                tb.object(storeId),
                tb.object(manageId),
            ],
        });

        const result = await suiClient.signAndExecuteTransaction({
            signer: keyPair,
            transaction: tb,
            requestType: 'WaitForLocalExecution',
            options: {
                showEffects: true,
            },
        });

        // console.log(result.effects);
    }

    const handleCreateManager = async (config: IManageInfo) => {
        const {manageId, infoId} = await create_manager(config.movie_info);
        console.log("manageId", manageId);
        console.log("infoId", infoId);

        config.manageId = manageId;
        config.infoId = infoId;

        await add_manage(MAIN_STORE_ID, manageId);
    }

    const handleUpdateManager = async (config: IManageInfo) => {
        await update_manager(config);
    }

    return {
        handleCreateManager,
        handleUpdateManager,
    }
}

