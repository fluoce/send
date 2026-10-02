import { setImmediate as yieldToLoop } from 'node:timers/promises';
import { TemplateVariable } from 'src/config/database';
import { templateVariableRegex } from 'src/config/regex';

export async function funcExtractTemplateVariables(
  html: string | null | undefined,
): Promise<TemplateVariable[]> {
  if (!html) return [];

  const flags = templateVariableRegex.flags.includes('g')
    ? templateVariableRegex.flags
    : templateVariableRegex.flags + 'g';
  const regex = new RegExp(templateVariableRegex.source, flags);

  const variables = new Map<string, TemplateVariable>();
  let count = 0;

  for (const match of html.matchAll(regex)) {
    const name = match[1];
    if (!variables.has(name)) {
      variables.set(name, { name, required: true, type: 'string', value: '' });
    }
    if (++count % 100 === 0) await yieldToLoop();
  }

  return [...variables.values()];
}
