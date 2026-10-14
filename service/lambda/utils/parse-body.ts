export function parseBody({
  body,
}: {
  body?: string;
}): Record<string, unknown> {
  if (typeof body !== 'string' || !body) {
    throw new Error('Request body is missing or not a string');
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(body);
  } catch (err) {
    throw new Error('Invalid JSON in body');
  }
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    throw new Error('Parsed body is not a valid object');
  }
  return parsed as Record<string, unknown>;
}
