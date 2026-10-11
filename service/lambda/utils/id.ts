import { ulid } from 'ulid';

export function getId({ prefix }: { prefix: string }) {
  return `${prefix}_${ulid()}`;
}
