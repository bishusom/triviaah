// lib/brainwave/cryptodle/cipher.ts

/**
 * Generates a deterministic substitution cipher based on a seed string.
 * Returns:
 *   - cipherMapping: object where key = plain letter/digit, value = cipher letter/digit
 *   - encryptedText: the input text transformed using the cipher
 */
export function generateDeterministicCipher(plainText: string, seed: string): {
  cipherMapping: Record<string, string>;
  encryptedText: string;
} {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  const digits = '0123456789';
  const seedHash = simpleHash(seed);
  
  // Create deterministic shuffles for letters and digits using the same seed hash.
  const shuffled = shuffleAlphabet(alphabet, seedHash);
  const shuffledDigits = shuffleAlphabet(digits, seedHash ^ 0x9e3779b9);
  
  const cipherMapping: Record<string, string> = {};
  for (let i = 0; i < alphabet.length; i++) {
    cipherMapping[alphabet[i]] = shuffled[i];
  }
  for (let i = 0; i < digits.length; i++) {
    cipherMapping[digits[i]] = shuffledDigits[i];
  }
  
  const encryptedText = plainText
    .toLowerCase()
    .split('')
    .map(ch => (/[a-z0-9]/.test(ch) ? cipherMapping[ch] : ch))
    .join('');
  
  return { cipherMapping, encryptedText };
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

function shuffleAlphabet(alphabet: string, seed: number): string {
  const arr = alphabet.split('');
  // Seeded random using mulberry32
  let rng = () => {
    seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = (t + Math.imul(t ^ t >>> 7, 61 | t)) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
  
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join('');
}
