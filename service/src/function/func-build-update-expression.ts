import { BadRequestException } from '@nestjs/common';

export function funcBuildUpdateExpression(fields: Record<string, unknown>) {
  const names: Record<string, string> = {};
  const values: Record<string, unknown> = {};
  const sets: string[] = [];

  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined) continue;
    names[`#${key}`] = key;
    values[`:${key}`] = value;
    sets.push(`#${key} = :${key}`);
  }

  if (sets.length === 0) {
    throw new BadRequestException('At least one field is required to update');
  }

  names['#updatedAt'] = 'updatedAt';
  values[':updatedAt'] = new Date().toISOString();
  sets.push('#updatedAt = :updatedAt');

  return {
    UpdateExpression: `SET ${sets.join(', ')}`,
    ExpressionAttributeNames: names,
    ExpressionAttributeValues: values,
  };
}
