import { format } from "date-fns"

export function funcDate(date: Date | string): Date | string | null {
  if (!date) return null
  return format(date, "dd-MM-yyyy")
}
