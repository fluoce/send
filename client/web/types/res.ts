export type ResType<T> = {
  statusCode: number
  success: boolean
  message: string
  data: T & {
    message: string
  }
}
