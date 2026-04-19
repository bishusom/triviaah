export function buildMetaDescription(
  parts: Array<string | null | undefined>,
  maxLength = 155,
): string {
  const text = parts
    .filter((part): part is string => Boolean(part && part.trim()))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (text.length <= maxLength) {
    return text;
  }

  return text
    .slice(0, maxLength)
    .replace(/\s+\S*$/, '')
    .trimEnd();
}
