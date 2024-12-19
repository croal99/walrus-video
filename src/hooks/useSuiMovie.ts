import {useSui} from "@/hooks/useSui.ts";
import {useCurrentAccount, useSignAndExecuteTransaction} from "@mysten/dapp-kit";
import {Transaction} from "@mysten/sui/transactions";
import {IManageOnChain, IManageStoreOnChain, IMovieOnChain} from "@/types/IMovieInfo.ts";
import {IPlayerOnChain} from "@/types/IPlayerOnChain.ts";

export const useSuiMovie = () => {
    const {suiClient} = useSui();
    const account = useCurrentAccount();
    // 配置信息
    const env = import.meta.env;
    const MOVIE_PACKAGE_ID = env.VITE_MOVIE_PACKAGE_ID;       // 合约
    const MAIN_STORE_ID = env.VITE_MAIN_STORE_ID;

    // 签名
    const {mutateAsync: signAndExecuteTransaction} = useSignAndExecuteTransaction();

    const handleCreatePlayer = () => {
        const tb = new Transaction();
        tb.setSender(account?.address);

        tb.moveCall({
            target: `${MOVIE_PACKAGE_ID}::player::create_player`,
            arguments: [],
        })

        // 将PTB签名上链
        signAndExecuteTransaction(
            {
                transaction: tb,
            },
            {
                onSuccess: (result) => {
                    console.log('executed create_playground transaction', result);
                    // setDigest(result.digest);
                },
                onError: (result) => {
                    console.log('trans error', result.message);
                    // setMessage(result.message);
                }
            },
        );
    }

    const handleCreateAndSubscribe = async (manageObject: IManageOnChain) => {
        const tb = new Transaction();
        tb.setSender(account?.address);
        const payment = tb.splitCoins(tb.gas, [manageObject.fee]);
        console.log('payment', payment);

        tb.moveCall({
            target: `${MOVIE_PACKAGE_ID}::player::create_subscribe`,
            arguments: [
                tb.object(manageObject.id.id),
                payment,
            ],
        })

        // 将PTB签名上链
        const {digest} = await signAndExecuteTransaction({
                transaction: tb,
            },
            {
                onSuccess: (result) => {
                    console.log('executed transaction', result);
                },
                onError: (result) => {
                    console.log('trans error', result.message);
                }
            },
        );

        const result = await suiClient.waitForTransaction({
            digest,
            timeout: 10_000,
            options: {
                showObjectChanges: true,
            },
        });

        console.log('waitForTransaction', result)
    }

    const handleSubscribe = async (playerId: string, manageObject: IManageOnChain) => {
        const tb = new Transaction();
        tb.setSender(account?.address);
        const payment = tb.splitCoins(tb.gas, [manageObject.fee]);
        console.log('payment', payment);

        tb.moveCall({
            target: `${MOVIE_PACKAGE_ID}::player::subscribe`,
            arguments: [
                tb.object(playerId),
                tb.object(manageObject.id.id),
                payment,
            ],
        })

        // 将PTB签名上链
        const {digest} = await signAndExecuteTransaction({
                transaction: tb,
            },
            {
                onSuccess: (result) => {
                    console.log('executed transaction', result);
                },
                onError: (result) => {
                    console.log('trans error', result.message);
                }
            },
        );

        const result = await suiClient.waitForTransaction({
            digest,
            timeout: 10_000,
            options: {
                showObjectChanges: true,
            },
        });

        console.log('waitForTransaction', result)
    }

    // 获取链上Manage数据对象
    const getManageObject = async (objectId: string) => {
        const res = await suiClient.getObject({
            id: objectId,
            options: {
                showContent: true,
            }
        })

        let info = res.data.content.fields as IManageOnChain;

        return info;
    }

    // 获取链上Movie数据对象
    const getMovieObject = async (objectId: string) => {
        const res = await suiClient.getObject({
            id: objectId,
            options: {
                showContent: true,
            }
        })

        let info = res.data.content.fields as IMovieOnChain;
        info.coin = info.fee / 1_000_000_000;

        return info;
    }

    // 获取链上Player数据对象
    const getPlayerObject = async (objectId: string) => {
        // console.log("Player Object ID", objectId);
        const res = await suiClient.getObject({
            id: objectId,
            options: {
                showContent: true,
            }
        })

        const playerObject = res.data.content.fields as IPlayerOnChain;
        // console.log("Player Object", playerObject);

        return playerObject;
    }

    const getOwnPlayerObject = async () => {
        // console.log("getOwnPlayerObject");
        const res = await suiClient.getOwnedObjects({
            owner: account?.address,
            filter: {
                StructType: `${MOVIE_PACKAGE_ID}::player::Player`,
            },
        })

        if (res.data.length > 0) {
            // @ts-ignore
            const objectId = res.data[0].data.objectId;
            const playerObject = await getPlayerObject(objectId);
            return playerObject;
        } else {
            // handleCreatePlayer();

            return false;
        }
    }

    // 检查是否订阅该影片对象
    const isSubscribeMovie = async (movieId: string) => {
        const playerObject = await getOwnPlayerObject();

        if (!playerObject) {
            return false;
        }

        const subscribeObject = playerObject.subscribe_table.fields;
        const subscribeTable = await suiClient.getDynamicFields({parentId: subscribeObject.id.id});
        for (let i = 0; i < subscribeTable.data.length; i++) {
            const poolId = subscribeTable.data[i].objectId;
            const subscribeMovieObject = await suiClient.getObject({
                id: poolId,
                options: {showContent: true}
            });
            const subscribeMovieAddress = subscribeMovieObject.data.content.fields;
            if (subscribeMovieAddress.name == movieId) {
                return true;
            }

        }

        // console.log("not subscribe movie");
        return false;
    }

    const getStoreMovies = async (objectId: string) => {
        // console.log("getStoreMovies", objectId);
        const res = await suiClient.getObject({
            id: objectId,
            options: {
                showContent: true,
            }
        })

        const storeObject = res.data.content.fields as IManageStoreOnChain;
        const movie_list:IMovieOnChain[] = [];

        for (const managerId of storeObject.managers) {
            const managerObject = await getManageObject(managerId);
            const movieObject = await getMovieObject(managerObject.info);
            movieObject.manger_id = managerId;
            movie_list.push(movieObject);
        }
        // console.log("movie list", movie_list);

        return movie_list;
    }


    return {
        MAIN_STORE_ID,
        handleCreatePlayer,
        handleCreateAndSubscribe,
        handleSubscribe,
        getStoreMovies,
        getManageObject,
        getMovieObject,
        getPlayerObject,
        getOwnPlayerObject,
        isSubscribeMovie,
    }
}