export function funcTrunc(text: string, maxLength: number = 18) {
  return text.length > maxLength ? `${text.slice(0, maxLength)}.....` : text
}
