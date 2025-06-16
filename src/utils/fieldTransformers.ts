import { HaliSaha, HaliSahaCard, Amenity } from '@/types';
import { DEFAULT_FIELD_IMAGES } from '@/constants';
import { 
  Lightbulb, Car, Shirt, Wifi, Coffee, Camera, Users, Shield 
} from 'lucide-react';

/**
 * Calculates the number of available slots based on working hours and booked slots.
 */
export const calculateAvailability = (
  startHour: string, 
  endHour: string, 
  bookedSlots: string[]
): string => {
  try {
    const start = parseInt(startHour.split(':')[0], 10);
    const end = parseInt(endHour.split(':')[0], 10);
    
    if (isNaN(start) || isNaN(end)) {
      return "Müsaitlik bilgisi yok";
    }

    // Assuming slots are hourly.
    const totalSlots = end - start;
    const bookedCount = bookedSlots?.length || 0;
    const availableSlots = totalSlots - bookedCount;

    if (availableSlots < 0) {
        return "Müsaitlik hesaplanamadı";
    }

    return `${availableSlots} slot mevcut`;
  } catch (error) {
    console.error("Error calculating availability:", error);
    return "Müsaitlik bilgisi yok";
  }
};

/**
 * Creates amenities array based on backend haliSaha properties
 */
export const createAmenities = (haliSaha: HaliSaha): Amenity[] => {
  return [
    { name: "Işıklı Saha", icon: Lightbulb, available: haliSaha.hasNightLighting },
    { name: "Ücretsiz Park", icon: Car, available: haliSaha.hasParking },
    { name: "Ayakkabı Kiralama", icon: Shirt, available: haliSaha.hasShoeRental },
    { name: "WiFi", icon: Wifi, available: haliSaha.hasWifi || false },
    { name: "Kafeterya", icon: Coffee, available: haliSaha.hasCafeteria },
    { name: "Güvenlik Kamerası", icon: Camera, available: haliSaha.hasSecurity || false },
    { name: "Soyunma Odası", icon: Users, available: haliSaha.hasShowers },
    { name: "24/7 Güvenlik", icon: Shield, available: haliSaha.has24Security || false }
  ];
};

/**
 * Creates simple amenities list for field cards
 */
export const createSimpleAmenities = (field: HaliSaha): string[] => {
  return [
    field.surface,
    `${field.maxPlayers} kişi`,
    field.hasParking ? 'Park Yeri' : null,
    field.hasShowers ? 'Duş' : null,
    field.hasCafeteria ? 'Kafeterya' : null,
    field.hasNightLighting ? 'Işıklı' : null,
  ].filter(Boolean) as string[];
};

/**
 * Creates features object for field cards
 */
export const createFieldFeatures = (field: HaliSaha) => {
  return {
    lighting: field.hasNightLighting,
    parking: field.hasParking,
    wifi: field.hasWifi || false,
    locker: field.hasShowers,
    shoeRental: field.hasShoeRental,
    cafeteria: field.hasCafeteria,
  };
};

/**
 * Gets field images with fallback to default images
 */
export const getFieldImages = (field: HaliSaha): string[] => {
  return field.imagesUrl?.length > 0 
    ? field.imagesUrl 
    : DEFAULT_FIELD_IMAGES.slice(0, 4);
};

/**
 * Transforms backend Field to frontend FieldCard for listing pages
 */
export const transformFieldToCard = (field: HaliSaha): HaliSahaCard => {
  if (!field || typeof field !== 'object') {
    console.error('❌ transformFieldToCard: Invalid field provided:', field);
    throw new Error('Invalid field data provided to transformFieldToCard');
  }

  const reviewCount = field.reviewCount || 0;
  const rating = reviewCount > 0 ? (field.rating || 0) : 0;
  const images = getFieldImages(field);

  return {
    id: field.id || '',
    name: field.name || 'İsimsiz Saha',
    location: field.location || 'Konum belirtilmemiş',
    rating,
    reviewCount,
    pricePerHour: field.pricePerHour || 0,
    image: images[0] || '/field-1.svg',
    images,
    amenities: createSimpleAmenities(field),
    premium: (field.pricePerHour || 0) > 250,
    availability: calculateAvailability(field.startHour || '09:00', field.endHour || '23:00', field.bookedSlots || []),
    features: createFieldFeatures(field),
  };
};

/**
 * Transforms backend Field to frontend FieldCard for detail page
 */
export const transformFieldToDetail = (field: HaliSaha): HaliSahaCard => {
  const reviewCount = field.reviewCount || 0;
  const rating = reviewCount > 0 ? (field.rating || 0) : 0;
  const images = getFieldImages(field);

  return {
    id: field.id,
    name: field.name,
    location: field.location,
    rating,
    reviewCount,
    pricePerHour: field.pricePerHour,
    image: images[0],
    images,
    amenities: createSimpleAmenities(field),
    premium: field.pricePerHour > 250,
    availability: calculateAvailability(field.startHour, field.endHour, field.bookedSlots),
    features: createFieldFeatures(field),
    description: field.description || "Modern tesisleri ve geniş alanı ile futbol tutkunlarının tercihi olan halı sahamız, profesyonel kalitede zemin ve tam donanımlı tesisleri ile unutulmaz maçlar yaşamanızı sağlar.",
    phone: field.phone,
    workingHours: `${field.startHour} - ${field.endHour}`,
    capacity: `${field.maxPlayers} kişi - ${field.size} - ${field.surface}`
  };
};

/**
 * Transforms a list of backend HaliSaha objects to HaliSahaCard objects.
 */
export const transformBackendFieldsToCards = (fields: HaliSaha[]): HaliSahaCard[] => {
  console.log('🔄 transformBackendFieldsToCards called with:', fields);
  console.log('🔄 fields type:', typeof fields);
  console.log('🔄 fields is Array:', Array.isArray(fields));
  
  if (!fields || !Array.isArray(fields)) {
    console.warn('⚠️ transformBackendFieldsToCards: Invalid input, not an array:', fields);
    return [];
  }
  
  if (fields.length === 0) {
    console.log('📋 transformBackendFieldsToCards: Empty array provided');
    return [];
  }
  
  try {
    const transformedFields = fields.map((field, index) => {
      console.log(`🔄 Transforming field ${index}:`, field);
      
      if (!field || typeof field !== 'object') {
        console.warn(`⚠️ Invalid field at index ${index}:`, field);
        return null;
      }
      
      return transformFieldToCard(field);
    }).filter(Boolean) as HaliSahaCard[];
    
    console.log('✅ transformBackendFieldsToCards result:', transformedFields);
    return transformedFields;
  } catch (error) {
    console.error('❌ Error in transformBackendFieldsToCards:', error);
    return [];
  }
}; 