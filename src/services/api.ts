import { API_BASE_URL, API_ENDPOINTS } from '@/constants';
import { ApiResponse, LoginFormData, RegisterFormData, LoginResponse, User, HaliSaha, BackendReview, CreateReviewData, UpdateReviewData, Reservation, CreateReservationData, UpdateReservationData } from '@/types';

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    console.log('📡 Making request:', {
      url,
      method: config.method || 'GET',
      headers: config.headers,
      body: config.body
    });

    try {
      const response = await fetch(url, config);
      console.log('📨 Response status:', response.status);
      console.log('📨 Response headers:', Object.fromEntries(response.headers.entries()));
      
      // Response text'i önce al, sonra JSON parse et
      const responseText = await response.text();
      console.log('📨 Raw response text:', responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
        console.log('📨 Parsed response data:', data);
      } catch (parseError) {
        console.error('❌ JSON parse error:', parseError);
        console.error('❌ Response was not valid JSON:', responseText);
        throw new Error('Invalid JSON response from server');
      }

      if (!response.ok) {
        console.error('❌ Request failed:', {
          status: response.status,
          statusText: response.statusText,
          url: url,
          method: config.method || 'GET',
          requestBody: config.body,
          responseData: data
        });
        
        // Backend'den gelen hata mesajını kullan
        const errorMessage = data?.message || data?.error || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth Services
  async login(credentials: LoginFormData): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterFormData): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>(API_ENDPOINTS.REGISTER, {
      method: 'POST',
      body: JSON.stringify({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        password: userData.password,
        role: userData.role,
      }),
    });
  }

  // HaliSaha Services
  async getHaliSahalar(): Promise<ApiResponse<HaliSaha[]>> {
    return this.request<HaliSaha[]>(API_ENDPOINTS.HALISAHA);
  }

  async getHaliSahaById(id: string): Promise<ApiResponse<HaliSaha>> {
    return this.request<HaliSaha>(API_ENDPOINTS.HALISAHA_DETAIL(id));
  }

  // Token Management
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  removeToken(): void {
    localStorage.removeItem('token');
  }

  // Authenticated Requests
  private async authenticatedRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = this.getToken();
    
    console.log('🔐 Authenticated request:', {
      endpoint,
      method: options.method || 'GET',
      hasToken: !!token,
      body: options.body
    });
    
    return this.request<T>(endpoint, {
      ...options,
      headers: {
        ...options.headers,
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
  }

  // Review Services
  async getAllReviews(): Promise<ApiResponse<BackendReview[]>> {
    // ❗ Authentication sınırlaması backend'de kaldırıldığı için normal request kullan
    console.log('📖 Fetching reviews without authentication requirement');
    console.log('📍 API URL:', `${this.baseURL}${API_ENDPOINTS.REVIEWS}`);
    return this.request<BackendReview[]>(API_ENDPOINTS.REVIEWS);
  }

  async createReview(reviewData: CreateReviewData): Promise<ApiResponse<BackendReview>> {
    console.log('🚀 Creating review with data:', reviewData);
    console.log('📍 API URL:', `${API_BASE_URL}${API_ENDPOINTS.REVIEW_CREATE}`);
    console.log('🔑 Token exists:', !!this.getToken());
    
    // Validate required fields
    if (!reviewData.userId || !reviewData.haliSahaId || !reviewData.rating || !reviewData.comment) {
      console.error('❌ Missing required fields:', reviewData);
      throw new Error('Eksik alanlar: userId, haliSahaId, rating, comment gerekli');
    }
    
    // Additional validation
    console.log('✅ Validation checks:');
    console.log('  - userId:', reviewData.userId, 'type:', typeof reviewData.userId);
    console.log('  - haliSahaId:', reviewData.haliSahaId, 'type:', typeof reviewData.haliSahaId);
    console.log('  - rating:', reviewData.rating, 'type:', typeof reviewData.rating);
    console.log('  - comment:', reviewData.comment, 'length:', reviewData.comment.length);
    
    try {
      const response = await this.authenticatedRequest<BackendReview>(API_ENDPOINTS.REVIEW_CREATE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });
      
      console.log('✅ Review creation response:', response);
      return response;
    } catch (error: any) {
      console.error('❌ Review creation API error:', error);
      console.error('Error message:', error?.message);
      console.error('Error name:', error?.name);
      console.error('Full error object:', error);
      
      // Daha detaylı hata analizi
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('🌐 Network error - backend çalışıyor mu?');
        throw new Error('Sunucuya bağlanılamıyor. Backend çalışıyor mu?');
      }
      
      throw error;
    }
  }

  async deleteReview(reviewId: string): Promise<void> {
    // Önce yorumun sahibi olup olmadığını kontrol et
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      throw new Error('Yorum silmek için giriş yapmanız gerekiyor.');
    }

    // Önce yorumu getir ve sahiplik kontrolü yap
    try {
      const allReviews = await this.getAllReviews();
      const reviewToDelete = allReviews.data?.find(review => review.id === reviewId);
      
      if (!reviewToDelete) {
        throw new Error('Silinecek yorum bulunamadı.');
      }
      
      if (reviewToDelete.userId !== currentUser.id) {
        throw new Error('Sadece kendi yorumlarınızı silebilirsiniz.');
      }
      
      // Sahiplik doğrulandıktan sonra sil
      await this.authenticatedRequest<void>(API_ENDPOINTS.REVIEW_DELETE(reviewId), {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('❌ Delete review error:', error);
      throw error;
    }
  }

  async updateReview(reviewId: string, data: UpdateReviewData): Promise<BackendReview> {
    // Önce yorumun sahibi olup olmadığını kontrol et
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      throw new Error('Yorum güncellemek için giriş yapmanız gerekiyor.');
    }

    // Önce yorumu getir ve sahiplik kontrolü yap
    try {
      const allReviews = await this.getAllReviews();
      const reviewToUpdate = allReviews.data?.find(review => review.id === reviewId);
      
      if (!reviewToUpdate) {
        throw new Error('Güncellenecek yorum bulunamadı.');
      }
      
      if (reviewToUpdate.userId !== currentUser.id) {
        throw new Error('Sadece kendi yorumlarınızı güncelleyebilirsiniz.');
      }
      
      // Sahiplik doğrulandıktan sonra güncelle
      const response = await this.authenticatedRequest<BackendReview>(API_ENDPOINTS.REVIEW_UPDATE(reviewId), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return response.data;
    } catch (error) {
      console.error('❌ Update review error:', error);
      throw error;
    }
  }

  // Reservation Services
  async getUserReservations(): Promise<ApiResponse<Reservation[]>> {
    console.log('📅 Fetching user reservations');
    return this.authenticatedRequest<Reservation[]>(API_ENDPOINTS.RESERVATIONS);
  }

  async createReservation(reservationData: CreateReservationData): Promise<ApiResponse<Reservation>> {
    console.log('🚀 Creating reservation with data:', reservationData);
    
    // Validate required fields
    if (!reservationData.userId || !reservationData.haliSahaId || !reservationData.reservationDateTime) {
      console.error('❌ Missing required fields:', reservationData);
      throw new Error('Eksik alanlar: userId, haliSahaId, reservationDateTime gerekli');
    }
    
    // Additional validation
    console.log('✅ Reservation validation checks:');
    console.log('  - userId:', reservationData.userId, 'type:', typeof reservationData.userId);
    console.log('  - haliSahaId:', reservationData.haliSahaId, 'type:', typeof reservationData.haliSahaId);
    console.log('  - status:', reservationData.status, 'type:', typeof reservationData.status);
    console.log('  - reservationDateTime:', reservationData.reservationDateTime, 'type:', typeof reservationData.reservationDateTime);
    console.log('  - isRecurring:', reservationData.isRecurring, 'type:', typeof reservationData.isRecurring);
    
    // UUID validation check
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    console.log('🔍 UUID validation:');
    console.log('  - userId is valid UUID:', uuidRegex.test(reservationData.userId));
    console.log('  - haliSahaId is valid UUID:', uuidRegex.test(reservationData.haliSahaId));
    
    // Date validation check
    const dateTest = new Date(reservationData.reservationDateTime);
    console.log('📅 Date validation:');
    console.log('  - reservationDateTime parsed:', dateTest);
    console.log('  - is valid date:', !isNaN(dateTest.getTime()));
    console.log('  - ISO string format:', reservationData.reservationDateTime);

    // Before sending to backend, let's fetch the field to check bookedSlots
    console.log('🔍 Checking for slot conflicts before sending to backend...');
    try {
      const fieldResponse = await this.request<any>(`${API_ENDPOINTS.HALISAHA}/${reservationData.haliSahaId}`);
      const bookedSlots = fieldResponse.data?.bookedSlots || [];
      
      // Check if the requested slot is already booked
      const requestedDateTime = new Date(reservationData.reservationDateTime);
      const isSlotBooked = bookedSlots.some((bookedSlot: string) => {
        const bookedDateTime = new Date(bookedSlot);
        return bookedDateTime.getTime() === requestedDateTime.getTime();
      });

      if (isSlotBooked) {
        console.error('❌ Slot conflict detected:', {
          requestedDateTime: reservationData.reservationDateTime,
          bookedSlots
        });
        throw new Error('Bu tarih ve saat için zaten rezervasyon bulunmaktadır. Lütfen başka bir saat seçiniz.');
      }
      
      console.log('✅ No slot conflicts detected, proceeding with reservation...');
    } catch (error: any) {
      if (error.message.includes('rezervasyon bulunmaktadır')) {
        throw error; // Re-throw our custom conflict error
      }
      console.warn('⚠️ Could not verify slot conflicts, proceeding anyway:', error.message);
    }
    
    return this.authenticatedRequest<Reservation>(API_ENDPOINTS.RESERVATION_CREATE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reservationData),
    });
  }

  async getReservationById(reservationId: string): Promise<ApiResponse<Reservation>> {
    console.log('📅 Fetching reservation by ID:', reservationId);
    return this.authenticatedRequest<Reservation>(API_ENDPOINTS.RESERVATION_BY_ID(reservationId));
  }

  async updateReservation(reservationId: string, data: UpdateReservationData): Promise<ApiResponse<Reservation>> {
    console.log('📝 Updating reservation:', reservationId, data);
    
    // Validation checks
    console.log('✅ Update reservation validation checks:');
    console.log('  - reservationId:', reservationId, 'type:', typeof reservationId);
    console.log('  - data:', data);
    
    if (data.userId) {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      console.log('  - userId is valid UUID:', uuidRegex.test(data.userId));
    }
    
    if (data.haliSahaId) {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      console.log('  - haliSahaId is valid UUID:', uuidRegex.test(data.haliSahaId));
    }
    
    if (data.reservationDateTime) {
      const dateTest = new Date(data.reservationDateTime);
      console.log('  - reservationDateTime is valid date:', !isNaN(dateTest.getTime()));
    }
    
    return this.authenticatedRequest<Reservation>(API_ENDPOINTS.RESERVATION_UPDATE(reservationId), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  // Get current user info from token
  getCurrentUser(): User | null {
    const token = this.getToken();
    console.log('🔑 Getting current user, token exists:', !!token);
    console.log('🔑 Token preview:', token ? `${token.substring(0, 20)}...` : 'null');
    
    if (!token) {
      console.warn('❌ No token found in localStorage');
      return null;
    }
    
    try {
      // JWT token'dan user bilgisini çıkar
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Token payload:', payload);
      
      const user = {
        id: payload.id,
        name: payload.name || 'Kullanıcı',
        email: payload.email || '',
        phone: payload.phone || '',
        role: payload.role || 'USER'
      };
      
      console.log('Parsed user:', user);
      return user;
    } catch (error) {
      console.error('Error parsing token:', error);
      return null;
    }
  }
}

export const apiService = new ApiService();
export default apiService; 