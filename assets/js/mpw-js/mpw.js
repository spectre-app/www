/*! by Tom Thorogood <me@tomthorogood.co.uk> */
/*! This work is licensed under the Creative Commons Attribution 4.0
International License. To view a copy of this license, visit
http://creativecommons.org/licenses/by/4.0/ or see LICENSE. */

import { scrypt } from 'js/mpw-js/scrypt';
//importScripts("js/mpw-js/scrypt");

class MPWError extends Error {
    constructor(cause, ...params) {
        super(...params)
        this.name = "MPWError"
        this.cause = cause
    }
}

class MPW {
    constructor(userName, userSecret, algorithmVersion = MPW.versions.current) {
        this.userName = userName;
        this.algorithmVersion = algorithmVersion;
        this.key = MPW.userKey(userName, userSecret, algorithmVersion);

    }

    result(siteName, resultType, keyCounter, keyScope, keyContext = null) {
        return MPW.siteResult(this.key, siteName, resultType, keyCounter, keyScope, keyContext);
    }

    authenticate(siteName, resultType = "long", keyCounter = 1, keyContext = null) {
        return this.result(this.key, siteName, resultType, keyCounter, MPW.scopes.authentication, keyContext);
    }

    login(siteName, resultType = "name", keyCounter = 1, keyContext = null) {
        return this.result(this.key, siteName, resultType, keyCounter, MPW.scopes.identification, keyContext);
    }

    answer(siteName, resultType = "phrase", keyCounter = 1, keyContext = null) {
        return this.result(this.key, siteName, resultType, keyCounter, MPW.scopes.recovery, keyContext);
    }

    invalidate() {
        this.key = Promise.reject(new MPWError("invalidate", "User key unavailable."));
    }

    static userKey(userName, userSecret, algorithmVersion = MPW.versions) {
        if (!crypto.subtle) {
            return Promise.reject(new MPWError(
                "internal", `Cryptography unavailable.`));
        } else if (algorithmVersion < MPW.versions.first || algorithmVersion > MPW.versions.last) {
            return Promise.reject(new MPWError(
                "algorithmVersion", `Unsupported algorithm version: ${algorithmVersion}.`));
        } else if (!userName || !userName.length) {
            return Promise.reject(new MPWError(
                "userName", `Missing user name.`));
        } else if (!userSecret || !userSecret.length) {
            return Promise.reject(new MPWError(
                "userSecret", `Missing user secret.`));
        }

        try {
            let userSecretBytes = MPW.encoder.encode(userSecret);
            let userNameBytes = MPW.encoder.encode(userName);
            let keyScope = MPW.encoder.encode(MPW.scopes.authentication);

            // Populate salt: scope | #userName | userName
            let keySalt = new Uint8Array(keyScope.length + 4/*sizeof(uint32)*/ + userNameBytes.length);
            let keySaltView = new DataView(keySalt.buffer, keySalt.byteOffset, keySalt.byteLength);

            let kS = 0;
            keySalt.set(keyScope, kS);
            kS += keyScope.length;

            if (algorithmVersion < 3) {
                // V0, V1, V2 incorrectly used the character length instead of the byte length.
                keySaltView.setUint32(kS, userName.length, false/*big-endian*/);
                kS += 4/*sizeof(uint32)*/;
            } else {
                keySaltView.setUint32(kS, userNameBytes.length, false/*big-endian*/);
                kS += 4/*sizeof(uint32)*/;
            }

            keySalt.set(userNameBytes, kS);
            kS += userNameBytes.length;

            // Derive user key from user secret and user salt.
            return scrypt(userSecretBytes, keySalt, 32768, 8, 2, 64).then(keyData =>
                // Make key available to WebCrypto for later use.
                crypto.subtle.importKey("raw", keyData, {
                    name: "HMAC",
                    hash: {
                        name: "SHA-256"
                    }
                }, false/*not extractable*/, ["sign"]).then(cryptoKey =>
                    ({keyCrypto: cryptoKey, keyAlgorithm: algorithmVersion})
                )
            );
        } catch (e) {
            return Promise.reject(e);
        }
    }

    static siteKey(userKey, siteName, keyCounter = 1, keyScope = MPW.scopes.authentication, keyContext = null) {
        return userKey.then(userKey => {
                if (!crypto.subtle) {
                    return Promise.reject(new MPWError(
                        "internal", `Cryptography unavailable.`));
                } else if (!userKey) {
                    return Promise.reject(new MPWError(
                        "userKey", `Missing user secret.`));
                } else if (!siteName || !siteName.length) {
                    return Promise.reject(new MPWError(
                        "siteName", `Missing site name.`));
                } else if (keyCounter < 1 || keyCounter > 4294967295/*Math.pow(2, 32) - 1*/) {
                    return Promise.reject(new MPWError(
                        "keyCounter", `Invalid counter value: ${keyCounter}.`));
                }

                try {
                    let siteNameBytes = MPW.encoder.encode(siteName);
                    let keyScopeBytes = MPW.encoder.encode(keyScope);
                    let keyContextBytes = keyContext && MPW.encoder.encode(keyContext);

                    // Populate salt: keyScope | #siteName | siteName | keyCounter | #keyContext | keyContext
                    let keySalt = new Uint8Array(
                        keyScopeBytes.length
                        + 4/*sizeof(uint32)*/ + siteNameBytes.length
                        + 4/*sizeof(int32)*/
                        + (keyContextBytes ? 4/*sizeof(uint32)*/ + keyContextBytes.length : 0)
                    );
                    let keySaltView = new DataView(keySalt.buffer, keySalt.byteOffset, keySalt.byteLength);

                    let kS = 0;
                    keySalt.set(keyScopeBytes, kS);
                    kS += keyScopeBytes.length;

                    if (userKey.keyAlgorithm < 2) {
                        // V0, V1 incorrectly used the character length instead of the byte length.
                        keySaltView.setUint32(kS, siteName.length, false/*big-endian*/);
                        kS += 4/*sizeof(uint32)*/;
                    } else {
                        keySaltView.setUint32(kS, siteNameBytes.length, false/*big-endian*/);
                        kS += 4/*sizeof(uint32)*/;
                    }

                    keySalt.set(siteNameBytes, kS);
                    kS += siteNameBytes.length;

                    keySaltView.setInt32(kS, keyCounter, false/*big-endian*/);
                    kS += 4/*sizeof(int32)*/;

                    if (keyContextBytes) {
                        keySaltView.setUint32(kS, keyContextBytes.length, false/*big-endian*/);
                        kS += 4/*sizeof(uint32)*/;

                        keySalt.set(keyContextBytes, kS);
                        kS += keyContextBytes.length;
                    }

                    // Derive site key from user key and site salt.
                    return crypto.subtle.sign({
                        name: "HMAC",
                        hash: {
                            name: "SHA-256"
                        }
                    }, userKey.keyCrypto, keySalt).then(keyData =>
                        ({keyData: new Uint8Array(keyData), keyAlgorithm: userKey.keyAlgorithm})
                    );
                } catch (e) {
                    return Promise.reject(e);
                }
            }
        )
    }

    static siteResult(userKey, siteName, resultType = "long", keyCounter = 1, keyScope = MPW.scopes.authentication, keyContext = null) {
        return this.siteKey(userKey, siteName, keyCounter, keyScope, keyContext).then(siteKey => {
                if (!(resultType in MPW.templates)) {
                    return Promise.reject(new MPWError(
                        "resultType", `Unsupported result template: ${resultType}.`));
                }

                let siteKeyBytes = siteKey.keyData
                if (siteKey.keyAlgorithm < 1) {
                    // V0 incorrectly converts bytes into 16-bit big-endian numbers.
                    let siteKeyV0Bytes = new Uint16Array(siteKeyBytes.length);
                    for (let sK = 0; sK < siteKeyV0Bytes.length; sK++) {
                        siteKeyV0Bytes[sK] = (siteKeyBytes[sK] > 127 ? 0x00ff : 0x0000) | (siteKeyBytes[sK] << 8);
                    }
                    siteKeyBytes = siteKeyV0Bytes
                }

                // key byte 0 selects the template from the available result templates.
                let resultTemplates = MPW.templates[resultType];
                let resultTemplate = resultTemplates[siteKeyBytes[0] % resultTemplates.length];

                // key byte 1+ selects a character from the template's character class.
                return resultTemplate.split("").map(function (characterClass, rT) {
                    let characters = MPW.characters[characterClass];
                    return characters[siteKeyBytes[rT + 1] % characters.length];
                }).join("");
            }
        );
    }

    static test() {
        return new MPW("Robert Lee Mitchell", "banana colored duckling")
            .authenticate("masterpasswordapp.com").then(password =>
                password === "Jejr5[RepuSosp" ? Promise.resolve() :
                    Promise.reject("Internal consistency test failed.")
            );
    }
}

MPW.encoder = new TextEncoder();
MPW.versions = {
    first: 0,
    last: 3,
    current: 3,
};
MPW.scopes = {
    authentication: "com.lyndir.masterpassword",
    identification: "com.lyndir.masterpassword.login",
    recovery: "com.lyndir.masterpassword.answer",
};
MPW.templates = {
    maximum: [
        "anoxxxxxxxxxxxxxxxxx",
        "axxxxxxxxxxxxxxxxxno"
    ],
    long: [
        "CvcvnoCvcvCvcv",
        "CvcvCvcvnoCvcv",
        "CvcvCvcvCvcvno",
        "CvccnoCvcvCvcv",
        "CvccCvcvnoCvcv",
        "CvccCvcvCvcvno",
        "CvcvnoCvccCvcv",
        "CvcvCvccnoCvcv",
        "CvcvCvccCvcvno",
        "CvcvnoCvcvCvcc",
        "CvcvCvcvnoCvcc",
        "CvcvCvcvCvccno",
        "CvccnoCvccCvcv",
        "CvccCvccnoCvcv",
        "CvccCvccCvcvno",
        "CvcvnoCvccCvcc",
        "CvcvCvccnoCvcc",
        "CvcvCvccCvccno",
        "CvccnoCvcvCvcc",
        "CvccCvcvnoCvcc",
        "CvccCvcvCvccno"
    ],
    medium: [
        "CvcnoCvc",
        "CvcCvcno"
    ],
    basic: [
        "aaanaaan",
        "aannaaan",
        "aaannaaa"
    ],
    short: [
        "Cvcn"
    ],
    pin: [
        "nnnn"
    ],
    name: [
        "cvccvcvcv"
    ],
    phrase: [
        "cvcc cvc cvccvcv cvc",
        "cvc cvccvcvcv cvcv",
        "cv cvccv cvc cvcvccv"
    ],
};
MPW.characters = {
    V: "AEIOU",
    C: "BCDFGHJKLMNPQRSTVWXYZ",
    v: "aeiou",
    c: "bcdfghjklmnpqrstvwxyz",
    A: "AEIOUBCDFGHJKLMNPQRSTVWXYZ",
    a: "AEIOUaeiouBCDFGHJKLMNPQRSTVWXYZbcdfghjklmnpqrstvwxyz",
    n: "0123456789",
    o: "@&%?,=[]_:-+*$#!'^~;()/.",
    x: "AEIOUaeiouBCDFGHJKLMNPQRSTVWXYZbcdfghjklmnpqrstvwxyz0123456789!@#$%^&*()",
    ' ': " "
};

mpw = null;
onmessage = function (msg) {
    if (!mpw || msg.data.userName) {
        mpw = new MPW(msg.data.userName, msg.data.userSecret, msg.data.algorithmVersion || MPW.versions.current);
    }

    mpw.result(msg.data.siteName, msg.data.resultType || "long",
        msg.data.keyCounter || 1, msg.data.keyScope || MPW.scopes.authentication, msg.data.keyContext)
        .then(
            result =>
                postMessage({
                    "success": true,
                    "result": result,
                }),
            error => {
                console.error(error);
                postMessage({
                    "success": false,
                    "error": error.message,
                    "cause": error.cause,
                })
            }
        );
};
