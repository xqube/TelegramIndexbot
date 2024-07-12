import { createHmac } from 'crypto';

// /**
//  * Function to hash a string using HMAC with a secret key and encode the result in base64 URL format
//  * @param input - The string to hash
//  * @param key - The secret key used for HMAC
//  * @returns The hashed string in base64 URL format
//  */
export function hashStringWithKeyToBase64Url(input: string, key: string): string {
  const hmac = createHmac('sha1', key);
  hmac.update(input);
  const hmacBuffer = hmac.digest();

  // Encode the HMAC result in base64 URL format
  return hmacBuffer.toString('base64')
    .replace(/\+/g, '-') // Replace '+' with '-'
    .replace(/\//g, '_') // Replace '/' with '_'
    .replace(/=+$/, ''); // Remove trailing '='
}

// Example usage
const inputString = 'tg-mode';
const secretKey = '546145310';
const encodedString = hashStringWithKeyToBase64Url(inputString, secretKey).slice(22);

console.log(`Input: ${inputString}`);
console.log(`Hashed and Encoded (Base64 URL) with Key: ${encodedString}`);



