import { CityDistricts } from '@/types';

// API Configuration - Proxy kullanarak CORS sorununu çöz
export const API_BASE_URL = 'https://toplansin-backend-production.up.railway.app/api';

export const API_ENDPOINTS = {
  LOGIN: '/login',
  REGISTER: '/register',
  HALISAHA: '/halisaha',
  HALISAHA_DETAIL: (id: string) => `/halisaha/${id}`,
  REVIEWS: '/review',
  REVIEW_CREATE: '/review/create',
  REVIEW_BY_ID: (id: string) => `/review/${id}`,
  REVIEW_DELETE: (id: string) => `/review/delete/${id}`,
  REVIEW_UPDATE: (id: string) => `/review/update/${id}`,
  // Reservation Endpoints
  RESERVATIONS: '/reservation',
  RESERVATION_CREATE: '/reservation/create',
  RESERVATION_BY_ID: (id: string) => `/reservation/${id}`,
  RESERVATION_UPDATE: (id: string) => `/reservation/update/${id}`,
} as const;

// Default Images
export const DEFAULT_FIELD_IMAGES = [
  '/field-1.svg',
  '/field-2.svg',
  '/field-3.svg',
  '/field-4.svg',
  '/field-5.svg',
  '/field-6.svg',
  '/field-7.svg',
  '/field-8.svg',
  '/field-9.svg',
  '/field-10.svg',
] as const;

// Time Slots
export const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", 
  "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", 
  "20:00", "21:00", "22:00", "23:00"
] as const;

// City Districts Mapping
export const CITY_DISTRICTS: CityDistricts = {
  istanbul: [
    { value: 'besiktas', label: 'Beşiktaş' },
    { value: 'sisli', label: 'Şişli' },
    { value: 'kadikoy', label: 'Kadıköy' },
    { value: 'atasehir', label: 'Ataşehir' },
    { value: 'uskudar', label: 'Üsküdar' },
    { value: 'fatih', label: 'Fatih' },
    { value: 'beyoglu', label: 'Beyoğlu' },
    { value: 'maltepe', label: 'Maltepe' },
    { value: 'pendik', label: 'Pendik' },
    { value: 'kartal', label: 'Kartal' },
    { value: 'bakirkoy', label: 'Bakırköy' },
    { value: 'zeytinburnu', label: 'Zeytinburnu' }
  ],
  ankara: [
    { value: 'cankaya', label: 'Çankaya' },
    { value: 'kecioren', label: 'Keçiören' },
    { value: 'yenimahalle', label: 'Yenimahalle' },
    { value: 'mamak', label: 'Mamak' },
    { value: 'sincan', label: 'Sincan' },
    { value: 'etimesgut', label: 'Etimesgut' }
  ],
  izmir: [
    { value: 'konak', label: 'Konak' },
    { value: 'karsiyaka', label: 'Karşıyaka' },
    { value: 'bornova', label: 'Bornova' },
    { value: 'buca', label: 'Buca' },
    { value: 'cigli', label: 'Çiğli' },
    { value: 'gaziemir', label: 'Gaziemir' }
  ],
  bursa: [
    { value: 'osmangazi', label: 'Osmangazi' },
    { value: 'nilufer', label: 'Nilüfer' },
    { value: 'yildirim', label: 'Yıldırım' },
    { value: 'mudanya', label: 'Mudanya' }
  ],
  antalya: [
    { value: 'muratpasa', label: 'Muratpaşa' },
    { value: 'kepez', label: 'Kepez' },
    { value: 'konyaalti', label: 'Konyaaltı' },
    { value: 'aksu', label: 'Aksu' }
  ]
};

// Şehir listesi
export const CITIES = [
  { value: 'istanbul', label: 'İstanbul' },
  { value: 'ankara', label: 'Ankara' },
  { value: 'izmir', label: 'İzmir' },
  { value: 'bursa', label: 'Bursa' },
  { value: 'antalya', label: 'Antalya' }
] as const;

// Filter Options
export const PRICE_RANGES = [
  { value: '0-150', label: '₺0 - ₺150' },
  { value: '150-250', label: '₺150 - ₺250' },
  { value: '250-350', label: '₺250 - ₺350' },
  { value: '350+', label: '₺350+' }
] as const;

export const RATING_OPTIONS = [
  { value: '4+', label: '4+ Yıldız' },
  { value: '3+', label: '3+ Yıldız' },
  { value: '2+', label: '2+ Yıldız' }
] as const;

export const SORT_OPTIONS = [
  { value: 'rating', label: 'En Yüksek Puan' },
  { value: 'price-low', label: 'En Düşük Fiyat' },
  { value: 'price-high', label: 'En Yüksek Fiyat' },
  { value: 'reviews', label: 'En Çok Yorum' }
] as const;

// Navigation Items
export const NAVIGATION_ITEMS = {
  LOGGED_IN: [
    { href: '/fields', label: 'Sahalar' },
    { href: '/about', label: 'Hakkımızda' },
    { href: '/contact', label: 'İletişim' }
  ],
  LOGGED_OUT: [
    { href: '/', label: 'Ana Sayfa' },
    { href: '/fields', label: 'Sahalar' },
    { href: '/about', label: 'Hakkımızda' },
    { href: '/contact', label: 'İletişim' }
  ]
} as const;

// Features for Homepage
export const HOMEPAGE_FEATURES = [
  {
    title: "Anında Rezervasyon",
    description: "Birkaç tıkla sahayı rezerve et, onayını hemen al",
    gradient: "from-blue-500 to-cyan-500",
    iconName: "Zap"
  },
  {
    title: "Güvenli Ödeme",
    description: "256-bit SSL şifrelemesi ile güvenli ödeme sistemi",
    gradient: "from-green-500 to-emerald-500",
    iconName: "Shield"
  },
  {
    title: "Kaliteli Sahalar",
    description: "Sadece kaliteli ve donanımlı halı sahalar platformumuzda",
    gradient: "from-purple-500 to-pink-500",
    iconName: "Trophy"
  },
  {
    title: "7/24 Destek",
    description: "Kesintisiz müşteri hizmetleri ile her zaman yanınızdayız",
    gradient: "from-orange-500 to-red-500",
    iconName: "Award"
  }
] as const;

export const HOMEPAGE_BENEFITS = [
  "Türkiye'nin en geniş halı saha ağı",
  "Anında onay ve SMS bilgilendirme",
  "Esnek iptal politikası",
  "Özel indirimler ve kampanyalar",
  "Mobil uyumlu platform",
  "Güvenilir ödeme seçenekleri"
] as const;

// Stats for Homepage
export const HOMEPAGE_STATS = [
  { number: "500+", label: "Aktif Saha" },
  { number: "50K+", label: "Tamamlanan Rezervasyon" },
  { number: "10K+", label: "Mutlu Müşteri" },
  { number: "25+", label: "Şehir" }
] as const;

// Mock Data
export const MOCK_BOOKED_SLOTS = ["14:00", "18:00", "20:00"] as const;

