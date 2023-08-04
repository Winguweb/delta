export const normalizeKeywords = (str: string) =>
  str
    // lower case words
    .toLowerCase()
    // remove accents and commas
    .normalize('NFD')
    .replace(/[\u0300-\u036f,]+/g, '')
    // separate words by comma or space
    .split(/[ ,]+/)
    .join(', ');

export const addKeywordToService = (keywords: string, newKeyword: string) => {
  const normalizedKeywords = normalizeKeywords(keywords);
  const normalizedNewKeyword = normalizeKeywords(newKeyword);

  if (normalizedKeywords === '') {
    return normalizedNewKeyword;
  }

  const uniqueValues = Array.from(
    new Set([
      ...normalizedKeywords.split(', '),
      ...normalizedNewKeyword.split(', '),
    ])
  );

  return uniqueValues.join(', ');
};
