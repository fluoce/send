export function res({
  status,
  data,
  message,
  error,
  headers,
}: {
  status: number;
  data?: Record<string, any>;
  message?: string;
  error?: string;
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
      ...(error ? { error } : {}),
      ...(data || {}),
    }),
  };
}
