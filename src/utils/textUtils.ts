/**
 * Türkçe karakterleri normalize eder (ğ->g, ü->u, vb.)
 * Filtreleme ve arama işlemlerinde kullanılır
 */
export const normalizeText = (text: string): string => {
  return text.toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .trim();
};

/**
 * İki metni Türkçe karakter normalizasyonu ile karşılaştırır
 */
export const compareTextsNormalized = (text1: string, text2: string): boolean => {
  return normalizeText(text1).includes(normalizeText(text2));
};

/**
 * Arama terimi ile metni Türkçe karakter desteği ile eşleştirir
 */
export const matchesSearchTerm = (text: string, searchTerm: string): boolean => {
  if (!searchTerm.trim()) return true;
  return compareTextsNormalized(text, searchTerm);
}; 