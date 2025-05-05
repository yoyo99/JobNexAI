// cryptoUtils.ts : Fonctions utilitaires pour chiffrer/déchiffrer des données côté client (AES-GCM, WebCrypto)
// Utilisation :
//   const { encrypted, iv } = await encryptAES('secret', 'message à chiffrer')
//   const decrypted = await decryptAES('secret', encrypted, iv)
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function encryptAES(password, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const enc = new TextEncoder();
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const keyMaterial = yield window.crypto.subtle.importKey('raw', enc.encode(password), { name: 'PBKDF2' }, false, ['deriveKey']);
        const key = yield window.crypto.subtle.deriveKey({
            name: 'PBKDF2',
            salt,
            iterations: 100000,
            hash: 'SHA-256',
        }, keyMaterial, { name: 'AES-GCM', length: 256 }, false, ['encrypt']);
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const encrypted = yield window.crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(data));
        return {
            encrypted: btoa(String.fromCharCode(...new Uint8Array(encrypted))) + '.' + btoa(String.fromCharCode(...salt)),
            iv: btoa(String.fromCharCode(...iv)),
        };
    });
}
export function decryptAES(password, encrypted, iv) {
    return __awaiter(this, void 0, void 0, function* () {
        const enc = new TextEncoder();
        const dec = new TextDecoder();
        const [cipherB64, saltB64] = encrypted.split('.');
        const cipher = Uint8Array.from(atob(cipherB64), c => c.charCodeAt(0));
        const salt = Uint8Array.from(atob(saltB64), c => c.charCodeAt(0));
        const ivArr = Uint8Array.from(atob(iv), c => c.charCodeAt(0));
        const keyMaterial = yield window.crypto.subtle.importKey('raw', enc.encode(password), { name: 'PBKDF2' }, false, ['deriveKey']);
        const key = yield window.crypto.subtle.deriveKey({
            name: 'PBKDF2',
            salt,
            iterations: 100000,
            hash: 'SHA-256',
        }, keyMaterial, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
        const decrypted = yield window.crypto.subtle.decrypt({ name: 'AES-GCM', iv: ivArr }, key, cipher);
        return dec.decode(decrypted);
    });
}
