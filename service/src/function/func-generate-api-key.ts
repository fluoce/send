import { randomBytes } from 'crypto';

export function funcGenerateApiKey(): string {
  return `send_${randomBytes(10)
    .toString('base64')
    .replace(
      /[\+\/=]/g,
      '',
    )}${Date.now().toString(36)}${Math.floor(Math.random() * 10)}`;
}
