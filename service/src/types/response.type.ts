export type ResponseDataType<T = Record<string, any>> = {
  message?: string;
} & T;
