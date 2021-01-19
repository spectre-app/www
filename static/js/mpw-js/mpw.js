/*! by Tom Thorogood <me@tomthorogood.co.uk> */
/*! This work is licensed under the Creative Commons Attribution 4.0
International License. To view a copy of this license, visit
http://creativecommons.org/licenses/by/4.0/ or see LICENSE. */

importScripts("scrypt.js");

class MPWError extends Error {
    constructor(cause, ...params) {
        super(...params)
        this.name = "MPWError"
        this.cause = cause
    }
}

class MPW {
    constructor(fullName, masterPassword, algorithmVersion = MPW.versions.current) {
        this.fullName = fullName;
        this.algorithmVersion = algorithmVersion;
        this.key = MPW.masterKey(fullName, masterPassword, algorithmVersion);

    }

    result(serviceName, resultType, keyCounter, keyScope, keyContext = null) {
        return MPW.serviceResult(this.key, serviceName, resultType, keyCounter, keyScope, keyContext);
    }

    authenticate(serviceName, resultType = "long", keyCounter = 1, keyContext = null) {
        return this.result(this.key, serviceName, resultType, keyCounter, MPW.scopes.authentication, keyContext);
    }

    login(serviceName, resultType = "name", keyCounter = 1, keyContext = null) {
        return this.result(this.key, serviceName, resultType, keyCounter, MPW.scopes.identification, keyContext);
    }

    answer(serviceName, resultType = "phrase", keyCounter = 1, keyContext = null) {
        return this.result(this.key, serviceName, resultType, keyCounter, MPW.scopes.recovery, keyContext);
    }

    invalidate() {
        this.key = Promise.reject(new MPWError("invalidate", "Master key unavailable."));
    }

    static masterKey(fullName, masterPassword, algorithmVersion = MPW.versions) {
        if (!crypto.subtle) {
            return Promise.reject(new MPWError(
                "internal", `Cryptography unavailable.`));
        } else if (algorithmVersion < MPW.versions.first || algorithmVersion > MPW.versions.last) {
            return Promise.reject(new MPWError(
                "algorithmVersion", `Unsupported algorithm version: ${algorithmVersion}.`));
        } else if (!fullName || !fullName.length) {
            return Promise.reject(new MPWError(
                "fullName", `Missing full name.`));
        } else if (!masterPassword || !masterPassword.length) {
            return Promise.reject(new MPWError(
                "masterPassword", `Missing master password.`));
        }

        try {
            let masterPasswordBytes = MPW.encoder.encode(masterPassword);
            let fullNameBytes = MPW.encoder.encode(fullName);
            let keyScope = MPW.encoder.encode(MPW.scopes.authentication);

            // Populate salt: scope | #fullName | fullName
            let keySalt = new Uint8Array(keyScope.length + 4/*sizeof(uint32)*/ + fullNameBytes.length);
            let keySaltView = new DataView(keySalt.buffer, keySalt.byteOffset, keySalt.byteLength);

            let kS = 0;
            keySalt.set(keyScope, kS);
            kS += keyScope.length;

            if (algorithmVersion < 3) {
                // V0, V1, V2 incorrectly used the character length instead of the byte length.
                keySaltView.setUint32(kS, fullName.length, false/*big-endian*/);
                kS += 4/*sizeof(uint32)*/;
            } else {
                keySaltView.setUint32(kS, fullNameBytes.length, false/*big-endian*/);
                kS += 4/*sizeof(uint32)*/;
            }

            keySalt.set(fullNameBytes, kS);
            kS += fullNameBytes.length;

            // Derive master key from master password and user salt.
            return scrypt(masterPasswordBytes, keySalt, 32768, 8, 2, 64).then(keyData =>
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

    static serviceKey(masterKey, serviceName, keyCounter = 1, keyScope = MPW.scopes.authentication, keyContext = null) {
        return masterKey.then(masterKey => {
                if (!crypto.subtle) {
                    return Promise.reject(new MPWError(
                        "internal", `Cryptography unavailable.`));
                } else if (!masterKey) {
                    return Promise.reject(new MPWError(
                        "masterKey", `Missing master password.`));
                } else if (!serviceName || !serviceName.length) {
                    return Promise.reject(new MPWError(
                        "serviceName", `Missing service name.`));
                } else if (keyCounter < 1 || keyCounter > 4294967295/*Math.pow(2, 32) - 1*/) {
                    return Promise.reject(new MPWError(
                        "keyCounter", `Invalid counter value: ${keyCounter}.`));
                }

                try {
                    let serviceNameBytes = MPW.encoder.encode(serviceName);
                    let keyScopeBytes = MPW.encoder.encode(keyScope);
                    let keyContextBytes = keyContext && MPW.encoder.encode(keyContext);

                    // Populate salt: keyScope | #serviceName | serviceName | keyCounter | #keyContext | keyContext
                    let keySalt = new Uint8Array(
                        keyScopeBytes.length
                        + 4/*sizeof(uint32)*/ + serviceNameBytes.length
                        + 4/*sizeof(int32)*/
                        + (keyContextBytes ? 4/*sizeof(uint32)*/ + keyContextBytes.length : 0)
                    );
                    let keySaltView = new DataView(keySalt.buffer, keySalt.byteOffset, keySalt.byteLength);

                    let kS = 0;
                    keySalt.set(keyScopeBytes, kS);
                    kS += keyScopeBytes.length;

                    if (masterKey.keyAlgorithm < 2) {
                        // V0, V1 incorrectly used the character length instead of the byte length.
                        keySaltView.setUint32(kS, serviceName.length, false/*big-endian*/);
                        kS += 4/*sizeof(uint32)*/;
                    } else {
                        keySaltView.setUint32(kS, serviceNameBytes.length, false/*big-endian*/);
                        kS += 4/*sizeof(uint32)*/;
                    }

                    keySalt.set(serviceNameBytes, kS);
                    kS += serviceNameBytes.length;

                    keySaltView.setInt32(kS, keyCounter, false/*big-endian*/);
                    kS += 4/*sizeof(int32)*/;

                    if (keyContextBytes) {
                        keySaltView.setUint32(kS, keyContextBytes.length, false/*big-endian*/);
                        kS += 4/*sizeof(uint32)*/;

                        keySalt.set(keyContextBytes, kS);
                        kS += keyContextBytes.length;
                    }

                    // Derive service key from master key and service salt.
                    return crypto.subtle.sign({
                        name: "HMAC",
                        hash: {
                            name: "SHA-256"
                        }
                    }, masterKey.keyCrypto, keySalt).then(keyData =>
                        ({keyData: new Uint8Array(keyData), keyAlgorithm: masterKey.keyAlgorithm})
                    );
                } catch (e) {
                    return Promise.reject(e);
                }
            }
        )
    }

    static serviceResult(masterKey, serviceName, resultType = "long", keyCounter = 1, keyScope = MPW.scopes.authentication, keyContext = null) {
        return this.serviceKey(masterKey, serviceName, keyCounter, keyScope, keyContext).then(serviceKey => {
                if (!(resultType in MPW.templates)) {
                    return Promise.reject(new MPWError(
                        "resultType", `Unsupported result template: ${resultType}.`));
                }

                let serviceKeyBytes = serviceKey.keyData
                if (serviceKey.keyAlgorithm < 1) {
                    // V0 incorrectly converts bytes into 16-bit big-endian numbers.
                    let serviceKeyV0Bytes = new Uint16Array(serviceKeyBytes.length);
                    for (let sK = 0; sK < serviceKeyV0Bytes.length; sK++) {
                        serviceKeyV0Bytes[sK] = (serviceKeyBytes[sK] > 127 ? 0x00ff : 0x0000) | (serviceKeyBytes[sK] << 8);
                    }
                    serviceKeyBytes = serviceKeyV0Bytes
                }

                // key byte 0 selects the template from the available result templates.
                let resultTemplates = MPW.templates[resultType];
                let resultTemplate = resultTemplates[serviceKeyBytes[0] % resultTemplates.length];

                // key byte 1+ selects a character from the template's character class.
                return resultTemplate.split("").map(function (characterClass, rT) {
                    let characters = MPW.characters[characterClass];
                    return characters[serviceKeyBytes[rT + 1] % characters.length];
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
    current: this.last,
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
    if (!mpw || msg.data.fullName) {
        mpw = new MPW(msg.data.fullName, msg.data.masterPassword, msg.data.algorithmVersion || MPW.versions.current);
    }

    mpw.result(msg.data.serviceName, msg.data.resultType || "long",
        msg.data.keyCounter || 1, msg.data.keyScope || MPW.scopes.authentication, msg.data.keyContext)
        .then(
            result =>
                postMessage({
                    "success": true,
                    "result": result
                }),
            error =>
                postMessage({
                    "success": false,
                    "error": error.message
                })
        );
};
