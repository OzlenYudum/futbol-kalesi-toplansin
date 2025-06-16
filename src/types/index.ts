// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'USER' | 'OWNER';
  createdAt?: string;
  updatedAt?: string;
}

// HaliSaha Types (Backend Model)
export interface HaliSaha {
  id: string;
  name: string;
  location: string;
  latitude?: number;
  longitude?: number;
  phone: string;
  description: string;
  pricePerHour: number;
  rating: number;
  reviewCount: number;
  startHour: string;
  endHour: string;
  size: string;
  surface: string;
  maxPlayers: number;
  hasParking: boolean;
  hasShowers: boolean;
  hasShoeRental: boolean;
  hasCafeteria: boolean;
  hasNightLighting: boolean;
  hasWifi?: boolean;
  hasSecurity?: boolean;
  has24Security?: boolean;
  imagesUrl: string[];
  bookedSlots: string[];
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

// Frontend HaliSaha Types (transformed)
export interface HaliSahaCard {
  id: string | number;
  name: string;
  location: string;
  rating: number;
  reviewCount: number;
  pricePerHour: number;
  image: string;
  images?: string[];
  amenities: string[];
  premium?: boolean;
  availability?: string;
  features: HaliSahaFeatures;
  description?: string;
  phone?: string;
  workingHours?: string;
  capacity?: string;
}

export interface HaliSahaFeatures {
  lighting: boolean;
  parking: boolean;
  wifi: boolean;
  locker: boolean;
  shoeRental?: boolean;
  cafeteria?: boolean;
}

export interface Amenity {
  name: string;
  icon: any;
  available: boolean;
}

// Review Types
export interface Review {
  id: string;
  userId: string;
  haliSahaId: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
  avatar: string;
  helpful: number;
  notHelpful: number;
  verified: boolean;
}

// Backend Review Types (Prisma Model'e göre)
export interface BackendReview {
  id: string;
  userId: string;
  haliSahaId: string;
  rating: number;
  comment: string;
  createdAt: string; // DateTime from Prisma
  user?: {
    id: string;
    name: string;
  };
  haliSaha?: {
    id: string;
    name: string;
  };
}

export interface CreateReviewData {
  userId: string;
  haliSahaId: string;
  rating: number;
  comment: string;
}

export interface UpdateReviewData {
  rating: number;
  comment: string;
  userId: string;
  haliSahaId: string;
}

// Filter Types
export interface HaliSahaFilters {
  city: string;
  district: string;
  priceRange: string;
  lighting: boolean;
  shoeRental: boolean;
  parking: boolean;
  wifi: boolean;
  cafeteria: boolean;
  locker: boolean;
  rating: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: any;
}

export interface LoginResponse {
  user: User;
  token: string;
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: 'USER' | 'OWNER';
}

// Reservation Types
export interface Reservation {
  id: string;
  userId: string;
  haliSahaId: string;
  status: 'pending' | 'approved' | 'cancelled';
  reservationDateTime: string; // ISO string
  createdAt: string;
  updatedAt: string;
  lastUpdatedById?: string;
  isRecurring: boolean;
  subscriptionId?: string;
  // Relations
  user?: User;
  haliSaha?: HaliSaha;
  lastUpdatedBy?: User;
}

export interface CreateReservationData {
  userId: string;
  haliSahaId: string;
  status?: 'pending' | 'approved' | 'cancelled';
  reservationDateTime: string; // ISO string
  isRecurring?: boolean;
  subscriptionId?: string;
  lastUpdatedById?: string;
}

export interface UpdateReservationData {
  userId?: string;
  haliSahaId?: string;
  status?: 'pending' | 'approved' | 'cancelled';
  reservationDateTime?: string;
  isRecurring?: boolean;
  subscriptionId?: string;
  lastUpdatedById?: string;
}

// City/District Types
export interface District {
  value: string;
  label: string;
}

export interface CityDistricts {
  [key: string]: District[];
}

// Component Props Types
export interface HeaderProps {
  user: User | null;
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onLogout: () => void;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface LoginModalProps extends ModalProps {
  onSwitchToRegister: () => void;
  onLogin: (user: User) => void;
}

export interface RegisterModalProps extends ModalProps {
  onSwitchToLogin: () => void;
  onRegister: (user: User) => void;
}

export interface HaliSahaCardProps {
  haliSaha: HaliSahaCard;
}

// Page Props Types
export interface PageProps {
  user: User | null;
  setUser: (user: User | null) => void;
} 