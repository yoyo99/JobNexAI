// cryptoUtils.ts : Fonctions utilitaires pour chiffrer/déchiffrer des données côté client (AES-GCM, WebCrypto)
// Utilisation :
//   const { encrypted, iv } = await encryptAES('secret', 'message à chiffrer')
//   const decrypted = await decryptAES('secret', encrypted, iv)

export async function encryptAES(password: string, data: string): Promise<{ encrypted: string; iv: string }> {
  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  const key = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc.encode(data)
  );
  return {
    encrypted: btoa(String.fromCharCode(...new Uint8Array(encrypted))) + '.' + btoa(String.fromCharCode(...salt)),
    iv: btoa(String.fromCharCode(...iv)),
  };
}

export async function decryptAES(password: string, encrypted: string, iv: string): Promise<string> {
  const enc = new TextEncoder();
  const dec = new TextDecoder();
  const [cipherB64, saltB64] = encrypted.split('.');
  const cipher = Uint8Array.from(atob(cipherB64), c => c.charCodeAt(0));
  const salt = Uint8Array.from(atob(saltB64), c => c.charCodeAt(0));
  const ivArr = Uint8Array.from(atob(iv), c => c.charCodeAt(0));
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  const key = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );
  const decrypted = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: ivArr },
    key,
    cipher
  );
  return dec.decode(decrypted);
}
