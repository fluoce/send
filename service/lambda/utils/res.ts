export function res({
  status,
  data,
  message,
  headers,
}: {
  status: number;
  data?: Record<string, any>;
  message?: string;
  headers?: Record<string, any>;
}) {
  return {
    statusCode: status,
    headers: {
      'Content-Type': 'application/json',
      ...(headers || {}),
    },
    body: JSON.stringify({
      ...(message ? { message } : {}),
      ...(data || {}),
    }),
  };
}
