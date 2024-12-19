import {IFileOnStore} from "@/types/IFileOnStore.ts";
import toast from "react-hot-toast";
import axios from "axios";

export interface IFileInfoOnWalrusStore {
    id: string;
    name: string;
    object_id: string;
    blob_id: string;
    media_type: string;
    icon: string;
    size: number;
    parent_id: string;
    password: string;
    salt: string;
    share: number;
    fee: number;
    code: string;
    create_at: number;
}

export interface INewlyCreatedOnWalrusStore {
    blobObject: {
        id: string;
        registeredEpoch: number,
        blobId: string,
        size: number,
    };
    cost: number;
}

export interface IAlreadyCertifiedOnWalrusStore {
    blobId: string;
    endEpoch: number;
}

const readfile = (file: Blob) => {
    return new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = () => {
            resolve(fr.result)
        };
        fr.readAsArrayBuffer(file);
    });
}

export const EncryptBlobFile = async (file: Blob, fileInfo: IFileInfoOnWalrusStore) => {
    const blob = await readfile(file).catch(function (err) {
        toast.error(err);
        return false;
    });

    const plaintextbytes = new Uint8Array(blob);
    const pbkdf2iterations = 10000;
    const passphrasebytes = new TextEncoder().encode(fileInfo.password);
    const pbkdf2salt = new TextEncoder().encode(fileInfo.salt);

    const passphrasekey = await window.crypto.subtle.importKey(
        'raw',
        passphrasebytes,
        {name: 'PBKDF2'},
        false,
        ['deriveBits']
    ).catch(function (err) {
        toast.error(err);
        return false;
    });

    let pbkdf2bytes = await window.crypto.subtle.deriveBits(
        {
            "name": 'PBKDF2',
            "salt": pbkdf2salt,
            "iterations": pbkdf2iterations,
            "hash": 'SHA-256'
        },
        passphrasekey as CryptoKey,
        384
    ).catch(function (err) {
        toast.error(err);
        return false;
    });

    pbkdf2bytes = new Uint8Array(pbkdf2bytes);

    let keybytes = pbkdf2bytes.slice(0, 32);
    let ivbytes = pbkdf2bytes.slice(32);

    const key = await window.crypto.subtle.importKey(
        'raw',
        keybytes,
        {
            name: 'AES-CBC',
            length: 256
        },
        false,
        ['encrypt']
    ).catch(function (err) {
        toast.error(err);
        return false;
    });

    let cipherbytes = await window.crypto.subtle.encrypt(
        {
            name: "AES-CBC",
            iv: ivbytes
        },
        key as CryptoKey,
        plaintextbytes
    ).catch(function (err) {
        toast.error(err);
        return false;
    });

    cipherbytes = new Uint8Array(cipherbytes);
    const resultbytes = new Uint8Array(cipherbytes.length + 18);
    resultbytes.set(new TextEncoder().encode('BlueShare_'));
    resultbytes.set(pbkdf2salt, 10);
    resultbytes.set(cipherbytes, 18);

    return resultbytes;
}

export const DecryptBlob = async (data: Blob, fileInfo: IFileInfoOnWalrusStore) => {
    let cipherbytes = new Uint8Array(data);

    let pbkdf2iterations = 10000;
    let passphrasebytes = new TextEncoder().encode(fileInfo.password);
    let pbkdf2salt = cipherbytes.slice(10, 18);

    let passphrasekey = await window.crypto.subtle.importKey(
        'raw',
        passphrasebytes,
        {
            name: 'PBKDF2'
        },
        false,
        ['deriveBits']
    ).catch(function (err) {
        console.error(err);
    });

    let pbkdf2bytes = await window.crypto.subtle.deriveBits(
        {
            "name": 'PBKDF2',
            "salt": pbkdf2salt,
            "iterations": pbkdf2iterations,
            "hash": 'SHA-256'
        },
        passphrasekey,
        384
    ).catch(function (err) {
        console.error(err);
    });

    pbkdf2bytes = new Uint8Array(pbkdf2bytes);
    let keybytes = pbkdf2bytes.slice(0, 32);
    let ivbytes = pbkdf2bytes.slice(32);
    cipherbytes = cipherbytes.slice(18);

    let key = await window.crypto.subtle.importKey('raw', keybytes, {
        name: 'AES-CBC',
        length: 256
    }, false, ['decrypt'])
        .catch(function (err) {
            console.error(err);
        });

    let plaintextbytes = await window.crypto.subtle.decrypt({
        name: "AES-CBC",
        iv: ivbytes
    }, key, cipherbytes)
        .catch(function (err) {
            console.error(err);
        });

    plaintextbytes = new Uint8Array(plaintextbytes);

    return new Blob([plaintextbytes], {type: fileInfo.media_type});
}

export const useWalrus = () => {
    const getFileFromWalrus = async (blob_id: string) => {
        const env = import.meta.env;
        const aggregator = env.VITE_WALRUS_AGGREGATOR;

        // console.log('aggregator', aggregator);

        const walrusUrl = `${aggregator}/v1/${blob_id}`;
        const res = await axios.get(walrusUrl, { responseType: 'arraybuffer' }).catch(function (err) {
            // toast.error(err);
            console.log('error', err)
            return false;
        });

        console.log('getFileFromWalrus', res);

        return new Blob([new Uint8Array(res.data)], {type: "video/mp4"});
    }

    const getBufferFromWalrus = async (blob_id: string, keyHex: string) => {
        const env = import.meta.env;
        const aggregator = env.VITE_WALRUS_AGGREGATOR;

        // console.log('aggregator', aggregator);

        const walrusUrl = `${aggregator}/v1/${blob_id}`;
        const res = await axios.get(walrusUrl, { responseType: 'arraybuffer' }).catch(function (err) {
            // toast.error(err);
            console.log('error', err)
            return false;
        });

        // console.log('getFileFromWalrus', res);
        if (!res) {
            return false;
        } else {
            const data = await decryptBuffer(res.data, keyHex);

            return data;
        }
    }

    const decryptBuffer = async (binaryData: ArrayBuffer, keyHex: string) => {
        // 将密钥从 Hex 解码为 Uint8Array
        const decodeHex = (hex) => Uint8Array.from(hex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
        const keyBuffer = decodeHex(keyHex);
        // const keyBuffer = new TextEncoder().encode(keyHex);

        // 分离 IV 和密文
        const iv = binaryData.slice(0, 16); // 前 16 字节是 IV
        const encrypted = binaryData.slice(16); // 剩余部分是密文

        // 导入密钥
        const cryptoKey = await crypto.subtle.importKey(
            'raw', // 原始密钥
            keyBuffer, // 密钥数据
            { name: 'AES-CBC' }, // 算法
            false, // 是否可导出
            ['decrypt'] // 密钥用途
        );

        // 解密
        const decryptedBuffer = await crypto.subtle.decrypt(
            { name: 'AES-CBC', iv }, // 算法与 IV
            cryptoKey, // 密钥
            encrypted // 加密数据
        );

        return decryptedBuffer;
    }

    return {
        getFileFromWalrus,
        getBufferFromWalrus,
    }
}