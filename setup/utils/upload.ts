import {IStoreInfo, IMovieInfo, useConfig} from './config';
import {getFullnodeUrl, SuiClient} from '@mysten/sui/client';
import {Transaction} from '@mysten/sui/transactions';
import {Ed25519Keypair} from '@mysten/sui/keypairs/ed25519';

const {MOVIE_PACKAGE_ID, ADMIN_SECRET_KEY, SUI_NETWORK, MOVIE_PATH } = useConfig();

import fs from 'fs';
import axios from 'axios';
import crypto from 'crypto';
import * as path from 'path';
import {IManageInfo} from "./config"


import {
    IFileInfoOnWalrusStore,
    EncryptBlobFile,
    useWalrus,
    INewlyCreatedOnWalrusStore,
    IAlreadyCertifiedOnWalrusStore
} from "../../src/hooks/useWalrusFile.ts";

import dotenv from 'dotenv';
import {IManageInfo, IStoreInfo} from "./config";

dotenv.config({path: '.env.local'});



// 定义文件路径和上传目标 URL
const movieRootPath = process.env.MOVIE_PATH || "./example";
const filePath = './example/test.txt'; // 本地文件路径
// const filePath = './example/01.mp4'; // 本地文件路径
const uploadUrl = `${process.env.WALRUS_PUBLISHER}/v1/store?epochs=50`; // 上传接口 URL
const algorithm = 'aes-256-cbc'; // 使用 AES-256-CBC 模式
// const key = crypto.randomBytes(32); // 32 字节密钥
// const iv = crypto.randomBytes(16); // 16 字节初始向量
// const key = new TextEncoder().encode('12345678901234567890123456789012'); // 32 字节密钥
// const iv = new TextEncoder().encode('1234567890123456'); // 16 字节初始向量

// console.log(uploadUrl);



const movies: IMovieBlobInfo[] = [];

// for (let i = 1; i < 11; i++) {
//     const filename = path.join(movieRootPath, i.toString() + ".mp4");
//     // console.log(filename);
//
//     const movieBlobInfo = await encodeMovie(filename);
//     movies.push(movieBlobInfo);
// }
// const jsonData = JSON.stringify(movies, null, 2);
//
// try {
//     // fs.writeFileSync(path.join(movieRootPath, 'data.json'), jsonData);
//     fs.writeFileSync('data.json', jsonData);
//     console.log('文件写入成功!');
// } catch (err) {
//     console.log('写入文件失败:', err);
// }

export const useUploadMovies = () => {
    const keyPair = Ed25519Keypair.deriveKeypair(ADMIN_SECRET_KEY);
    const suiClient = new SuiClient({url: getFullnodeUrl(SUI_NETWORK)});

    const decodeHex = (hex) => Uint8Array.from(hex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));

    // 上传
    async function uploadBuffer(arrayBuffer: ArrayBuffer) {
        // console.log(arrayBuffer.byteLength);
        try {
            // 使用 axios 发起 put 请求
            // console.log("url", uploadUrl);
            const response = await axios.put(uploadUrl, arrayBuffer,
                {
                    headers: {
                        'content-type': 'multipart/form-data',
                    },
                });

            // console.log('上传成功:', response.data);
            const blobId =
                (response.data?.newlyCreated as INewlyCreatedOnWalrusStore)?.blobObject.blobId ||
                (response.data?.alreadyCertified as IAlreadyCertifiedOnWalrusStore)?.blobId;

            console.log("blobId", blobId);
            return blobId;
        } catch (error) {
            console.error('上传失败:', error.message);
            return false;
        }
    }

    const updateBlobIDs = async (config: IManageInfo) => {
        const tb = new Transaction();

        tb.moveCall({
            target: `${MOVIE_PACKAGE_ID}::manage::update_blobs`,
            arguments: [
                tb.object(config.infoId),
                tb.pure('vector<string>', config.blob_ids),
                tb.pure.string(config.key),
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
    }

    const initKeys = (config: IManageInfo) => {
        const key = crypto.randomBytes(32);
        const iv = crypto.randomBytes(16);
        config.key = key.toString('hex');
        config.iv = iv.toString('hex');
        config.blob_ids = [];
    }

    const uploadMovie = async (config: IManageInfo, filename: string) => {
        console.log("upload movie", filename);

        const keyBuffer = decodeHex(config.key)
        const ivBuffer = decodeHex(config.iv)
        // console.log("uploadMovies", keyInfo, keyBuffer);

        const fileBuffer: Buffer = fs.readFileSync(filename);
        const cipher = crypto.createCipheriv(algorithm, keyBuffer, ivBuffer);
        const encrypted = Buffer.concat([cipher.update(fileBuffer), cipher.final()]);
        const encryptedBuffer = Buffer.concat([ivBuffer, encrypted]);

        // 上传
        const blobId = await uploadBuffer(encryptedBuffer);

        return blobId;
    }

    const uploadMovies = async (config: IManageInfo, moviePath: string) => {
        for (let i = 0; i < config.movie_info.total; i++) {
            const filename = path.join(moviePath, `${i+1}.mp4`);
            const blobId = await uploadMovie(config, filename);
            if (blobId) {
                config.blob_ids[i] = blobId;
            }
        }
    }

    return {
        initKeys,
        uploadMovie,
        uploadMovies,
        updateBlobIDs,
    }
}