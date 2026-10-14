import { emailRegex } from 'src/config/regex';

type ParsedFromAddress = {
  name: string | null;
  email: string;
  domain: string;
};

export function parseFromAddress({
  from,
}: {
  from: unknown;
}): ParsedFromAddress {
  if (typeof from !== 'string' || /[\r\n]/.test(from)) {
    throw new Error(
      'From address must be a string and must not contain linebreaks',
    );
  }

  const value = from.trim();

  if (!value) {
    throw new Error('From address is empty');
  }

  const match = value.match(/^(.*?)<\s*([^<>]+)\s*>$/);

  let name: string | null = null;
  let email: string;

  if (match) {
    name =
      match[1]
        .trim()
        .replace(/^"(.*)"$/, '$1')
        .trim() || null;

    email = match[2].trim();
  } else {
    email = value;
  }

  if (email.length > 254 || !emailRegex.test(email)) {
    throw new Error('Invalid from email address');
  }

  email = email.toLowerCase();

  if (!email.includes('@')) {
    throw new Error('Email address missing domain part');
  }

  return {
    name,
    email,
    domain: email.split('@')[1],
  };
}
