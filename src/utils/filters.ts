import { HaliSahaCard, HaliSahaFilters } from '@/types';

/**
 * Normalizes Turkish characters for better search matching
 */
export const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c');
};

/**
 * Checks if field matches search term
 */
export const matchesSearchTerm = (field: HaliSahaCard, searchTerm: string): boolean => {
  if (!searchTerm) return true;
  
  const normalizedSearch = normalizeText(searchTerm);
  const normalizedName = normalizeText(field.name);
  const normalizedLocation = normalizeText(field.location);
  
  return normalizedName.includes(normalizedSearch) || 
         normalizedLocation.includes(normalizedSearch);
};

/**
 * Checks if field matches city filter
 */
export const matchesCity = (field: HaliSahaCard, city: string): boolean => {
  if (!city) return true;
  
  const normalizedCity = normalizeText(city);
  const normalizedLocation = normalizeText(field.location);
  
  return normalizedLocation.includes(normalizedCity);
};

/**
 * Checks if field matches district filter
 */
export const matchesDistrict = (field: HaliSahaCard, district: string): boolean => {
  if (!district) return true;
  
  const normalizedDistrict = normalizeText(district);
  const normalizedLocation = normalizeText(field.location);
  
  return normalizedLocation.includes(normalizedDistrict);
};

/**
 * Checks if field matches price range filter
 */
export const matchesPriceRange = (field: HaliSahaCard, priceRange: string): boolean => {
  if (!priceRange) return true;
  
  const price = field.pricePerHour;
  
  switch (priceRange) {
    case '0-150':
      return price <= 150;
    case '150-250':
      return price > 150 && price <= 250;
    case '250-350':
      return price > 250 && price <= 350;
    case '350+':
      return price > 350;
    default:
      return true;
  }
};

/**
 * Checks if field matches rating filter
 */
export const matchesRating = (field: HaliSahaCard, rating: string): boolean => {
  if (!rating) return true;
  
  const fieldRating = field.rating;
  const minRating = parseFloat(rating.replace('+', ''));
  
  return fieldRating >= minRating;
};

/**
 * Checks if field matches feature filters
 */
export const matchesFeatures = (field: HaliSahaCard, filters: HaliSahaFilters): boolean => {
  const { lighting, shoeRental, parking, wifi, cafeteria, locker } = filters;
  
  if (lighting && !field.features.lighting) return false;
  if (shoeRental && !field.features.shoeRental) return false;
  if (parking && !field.features.parking) return false;
  if (wifi && !field.features.wifi) return false;
  if (cafeteria && !field.features.cafeteria) return false;
  if (locker && !field.features.locker) return false;
  
  return true;
};

/**
 * Applies all filters to a field
 */
export const applyFilters = (
  field: HaliSahaCard, 
  filters: HaliSahaFilters, 
  searchTerm: string
): boolean => {
  return (
    matchesSearchTerm(field, searchTerm) &&
    matchesCity(field, filters.city) &&
    matchesDistrict(field, filters.district) &&
    matchesPriceRange(field, filters.priceRange) &&
    matchesRating(field, filters.rating) &&
    matchesFeatures(field, filters)
  );
};

/**
 * Sorts fields based on sort option
 */
export const sortFields = (fields: HaliSahaCard[], sortBy: string): HaliSahaCard[] => {
  return [...fields].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.pricePerHour - b.pricePerHour;
      case 'price-high':
        return b.pricePerHour - a.pricePerHour;
      case 'reviews':
        return b.reviewCount - a.reviewCount;
      case 'rating':
      default:
        return b.rating - a.rating;
    }
  });
};

/**
 * Gets availability color based on slot count
 */
export const getAvailabilityColor = (availability: string): string => {
  const slots = parseInt(availability.match(/\d+/)?.[0] || '0');
  if (slots <= 3) return 'text-red-600 bg-red-50';
  if (slots <= 7) return 'text-orange-600 bg-orange-50';
  return 'text-green-600 bg-green-50';
}; 