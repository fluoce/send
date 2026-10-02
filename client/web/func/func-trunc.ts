export function funcTrunc(text: string, maxLength: number = 18) {
  if (!text) return
  return text.length > maxLength ? `${text.slice(0, maxLength)}.....` : text
}
