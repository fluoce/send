export function getHeader({
  headers,
  name,
}: {
  headers: Record<string, string | undefined> | undefined;
  name: string;
}): string | undefined {
  if (!headers) return undefined;
  const key = Object.keys(headers).find(
    (k) => k.toLowerCase() === name.toLowerCase(),
  );
  return key ? headers[key]?.trim() || undefined : undefined;
}
