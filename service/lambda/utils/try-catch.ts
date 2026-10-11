import { res } from './res';

export async function tryCatch<T>({
  fn,
  errorMessage = 'Internal server error',
}: {
  fn: () => Promise<T>;
  errorMessage?: string;
}): Promise<T | ReturnType<typeof res>> {
  try {
    return await fn();
  } catch (error) {
    console.log('send-email-error: ', error);
    return res({
      status: 500,
      message: errorMessage,
    });
  }
}
