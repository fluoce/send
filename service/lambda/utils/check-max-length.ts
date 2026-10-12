export function checkMaxLength({
  field,
  maxLength,
}: {
  field: string;
  maxLength: number;
}): boolean {
  if (typeof field !== 'string') {
    throw new Error('Field must be a string');
  }
  if (typeof maxLength !== 'number' || maxLength < 0) {
    throw new Error('maxLength must be a non-negative number');
  }
  return field.length <= maxLength;
}
