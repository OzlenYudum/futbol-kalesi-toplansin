import { HaliSaha, HaliSahaCard, Amenity } from '@/types';
import { DEFAULT_FIELD_IMAGES } from '@/constants';
import { 
  Lightbulb, Car, Shirt, Wifi, Coffee, Camera, Users, Shield 
} from 'lucide-react';

/**
 * Generates a realistic rating between 3.5 and 5.0

 * Generates availability text based on available slots or random
 */
export const generateAvailability = (availableSlots?: number): string => {
  const slots = availableSlots || Math.floor(Math.random() * 10) + 1;
  return `${slots} slot mevcut`;
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
 * Creates simple amenities list for haliSaha cards
 */
export const createSimpleAmenities = (haliSaha: HaliSaha): string[] => {
  return [
    haliSaha.surface,
    `${haliSaha.maxPlayers} kişi`,
    haliSaha.hasParking ? 'Park Yeri' : null,
    haliSaha.hasShowers ? 'Duş' : null,
    haliSaha.hasCafeteria ? 'Kafeterya' : null,
    haliSaha.hasNightLighting ? 'Işıklı' : null,
  ].filter(Boolean) as string[];
};

/**
 * Creates features object for haliSaha cards
 */
export const createHaliSahaFeatures = (haliSaha: HaliSaha) => {
  return {
    lighting: haliSaha.hasNightLighting,
    parking: haliSaha.hasParking,
    wifi: haliSaha.hasWifi || false,
    locker: haliSaha.hasShowers,
    shoeRental: haliSaha.hasShoeRental,
    cafeteria: haliSaha.hasCafeteria,
  };
};

/**
 * Gets haliSaha images with fallback to default images
 */
export const getHaliSahaImages = (haliSaha: HaliSaha): string[] => {
  return haliSaha.imagesUrl?.length > 0 
    ? haliSaha.imagesUrl 
    : DEFAULT_FIELD_IMAGES.slice(0, 4);
};

/**
 * Transforms backend HaliSaha to frontend HaliSahaCard for listing pages
 */
export const transformHaliSahaToCard = (haliSaha: HaliSaha): HaliSahaCard => {

  const images = getHaliSahaImages(haliSaha);

  return {
    id: haliSaha.id,
    name: haliSaha.name,
    location: haliSaha.location,
    rating: haliSaha.rating,
    reviewCount: haliSaha.reviewCount,
    pricePerHour: haliSaha.pricePerHour,
    image: images[0],
    images,
    amenities: createSimpleAmenities(haliSaha),
    premium: haliSaha.pricePerHour > 250,
    availability: generateAvailability(),
    features: createHaliSahaFeatures(haliSaha),
  };
};

/**
 * Transforms backend HaliSaha to frontend HaliSahaCard for detail page
 */
export const transformHaliSahaToDetail = (haliSaha: HaliSaha): HaliSahaCard => {
  
  const images = getHaliSahaImages(haliSaha);

  return {
    id: haliSaha.id,
    name: haliSaha.name,
    location: haliSaha.location,
    rating: haliSaha.rating,
    reviewCount: haliSaha.reviewCount,
    pricePerHour: haliSaha.pricePerHour,
    image: images[0],
    images,
    amenities: createSimpleAmenities(haliSaha),
    premium: haliSaha.pricePerHour > 250,
    features: createHaliSahaFeatures(haliSaha),
    description: haliSaha.description || "Modern tesisleri ve geniş alanı ile futbol tutkunlarının tercihi olan halı sahamız, profesyonel kalitede zemin ve tam donanımlı tesisleri ile unutulmaz maçlar yaşamanızı sağlar.",
    phone: haliSaha.phone,
    workingHours: `${haliSaha.startHour} - ${haliSaha.endHour}`,
    capacity: `${haliSaha.maxPlayers} kişi - ${haliSaha.size} - ${haliSaha.surface}`
  };
}; 