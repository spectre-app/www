/*! This work is licensed under the Creative Commons Attribution 4.0
International License. To view a copy of this license, visit
http://creativecommons.org/licenses/by/4.0/ or see LICENSE. */

// Native WebCrypto PBKDF2 is blocked by:
// - https://bugzilla.mozilla.org/show_bug.cgi?id=1469482

function pbkdf2(password, salt, iter, keyLen, hash) {
    // https://github.com/golang/crypto/blob/master/pbkdf2/pbkdf2.go
    function pbkdf2_js(password, salt, iter, keyLen, hash) {
        let hashLen = 160 / 8;
        switch ((hash.name || hash).toUpperCase()) {
            case "SHA1":
                break;
            case "SHA224":
            case "SHA-224":
                hashLen = 224 / 8;
                break;
            case "SHA256":
            case "SHA-256":
                hashLen = 256 / 8;
                break;
            case "SHA384":
            case "SHA-384":
                hashLen = 384 / 8;
                break;
            case "SHA512":
            case "SHA-512":
                hashLen = 512 / 8;
                break;
            default:
                let err = new Error(`Unsupported hash: ${hash}`);
                err.name = "InvalidAccessError";
                return Promise.reject(err);
        }

        let data     = new Uint8Array(salt.length + 4/*sizeof(uint32)*/);
        let dataView = new DataView(data.buffer, data.byteOffset, data.byteLength);

        data.set(salt);

        return crypto.subtle.importKey("raw", password, {
                name: "HMAC",
                hash: hash
            }, false/*not extractable*/, [ "sign" ]).then(function (key) {
                let numBlocks = ((keyLen + hashLen - 1) / hashLen) | 0;
                let dk = new Uint8Array(numBlocks * hashLen);
                let x = Promise.resolve();

                for (let block = 1, dki = 0; block <= numBlocks; block++, dki += hashLen) {
                    x = x.then(() => dataView.setUint32(salt.length, block, false/*big-endian*/))
                        .then(() => crypto.subtle.sign({
                            name: "HMAC",
                            hash: hash
                        }, key, data))
                        .then(pdk => (dk.set(new Uint8Array(pdk), dki), pdk));

                    for (let n = 2; n <= iter; n++) {
                        x = x.then(U => crypto.subtle.sign({
                                name: "HMAC",
                                hash: hash
                            }, key, U)).then(function (U) {
                                let Ux = new Uint8Array(U);

                                for (let i = 0; i < Ux.length; i++) {
                                    dk[dki + i] ^= Ux[i];
                                }

                                return U;
                            });
                    }
                }

                return x.then(() => dk.subarray(0, keyLen));
            });
    }

    return crypto.subtle.importKey("raw", password, {
            name: "PBKDF2",
            hash: hash
        }, false/*not extractable*/, [ "deriveBits" ])
        .then(key => crypto.subtle.deriveBits({
            name: "PBKDF2",
            salt: salt,
            iterations: iter,
            hash: hash
        }, key, keyLen * 8))
        .then(key => new Uint8Array(key))
        .catch(err =>
            // If WebCrypto cannot handle the request, stub a JS implementation of PBKDF2
            (err.name === "OperationError" || err.name === "NotSupportedError" || err.name === "InvalidAccessError")
                ? pbkdf2_js(password, salt, iter, keyLen, hash)
                : Promise.reject(err));
}