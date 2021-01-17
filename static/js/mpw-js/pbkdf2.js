/*! by Tom Thorogood <me@tomthorogood.co.uk> */
/*! This work is licensed under the Creative Commons Attribution 4.0
International License. To view a copy of this license, visit
http://creativecommons.org/licenses/by/4.0/ or see LICENSE. */

// https://bugzilla.mozilla.org/show_bug.cgi?id=554827
function pbkdf2(password, salt, iter, keyLen, hash) {
	// https://github.com/golang/crypto/blob/master/pbkdf2/pbkdf2.go
	function pbkdf2_js(password, salt, iter, keyLen, hash) {
		switch ((hash.name || hash).toUpperCase()) {
			case "SHA1":
				var hashLen = 160 / 8;
				break;
			case "SHA224":
			case "SHA-224":
				var hashLen = 224 / 8;
				break;
			case "SHA256":
			case "SHA-256":
				var hashLen = 256 / 8;
				break;
			case "SHA384":
			case "SHA-384":
				var hashLen = 384 / 8;
				break;
			case "SHA512":
			case "SHA-512":
				var hashLen = 512 / 8;
				break;
			default:
				let err = new Error("A parameter or an operation is not supported by the underlying object");
				err.name = "InvalidAccessError";
				return Promise.reject(err);
		}
		
		let numBlocks = ((keyLen + hashLen - 1) / hashLen) | 0;
		
		let data     = new Uint8Array(salt.length + 4/*sizeof(uint32)*/);
		let dataView = new DataView(data.buffer, data.byteOffset, data.byteLength);
		
		data.set(salt);
		
		return crypto.subtle.importKey("raw", password, {
				name: "HMAC",
				hash: hash
			}, false/*not extractable*/, [ "sign" ]).then(function (key) {
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
	
	let self = this;
	let args = arguments;

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
			// PBKDF2-HMAC is not supported by the Web Crytpto API if either a
			// NotSupportedError or a OperationError are emmited
			(err.name === "OperationError" || err.name === "NotSupportedError")
				? (pbkdf2 = pbkdf2_js).apply(self, args)
				// Limited support for PBKDF2-HMAC-SHA exists if InvalidAccessError
				// is emmited for PBKDF2-HMAC-SHA{256,384,512}
				: (err.name === "InvalidAccessError")
					? pbkdf2_js.apply(self, args)
					: Promise.reject(err));
}