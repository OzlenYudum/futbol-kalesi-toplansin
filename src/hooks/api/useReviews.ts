import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { apiService } from '@/services/api';
import { BackendReview, CreateReviewData, Review, UpdateReviewData } from '@/types';
import { getFieldReviews, calculateAverageRating, getReviewCount } from '@/utils/reviewTransformers';
import { API_BASE_URL, API_ENDPOINTS } from '@/constants';

/**
 * Hook to fetch all reviews
 */
export const useAllReviews = () => {
  const query = useQuery({
    queryKey: ['reviews'],
    queryFn: async (): Promise<BackendReview[]> => {
      console.log('🔄 Fetching all reviews from backend...');
      console.log('🌐 API Base URL:', API_BASE_URL);
      console.log('📍 Full API URL:', `${API_BASE_URL}${API_ENDPOINTS.REVIEWS}`);
      
      try {
        const response = await apiService.getAllReviews();
        console.log('✅ Backend reviews response:', response);
        console.log('📊 Total reviews received:', response.data?.length || 0);
        
        if (response.data && Array.isArray(response.data)) {
          console.log('✅ Valid array response received');
          return response.data;
        } else {
          console.warn('⚠️ Response data is not an array:', response.data);
          return [];
        }
      } catch (error: any) {
        console.error('❌ API Error Details:');
        console.error('  - Error message:', error?.message);
        console.error('  - Error name:', error?.name);
        console.error('  - Error stack:', error?.stack);
        console.error('  - Full error object:', error);
        
        // Network error kontrolü
        if (error instanceof TypeError && error.message.includes('fetch')) {
          console.error('🌐 Network error detected - backend unreachable');
        }
        
        // Önce cache'ten veri almayı dene
        const cachedData = JSON.parse(localStorage.getItem('reviews-cache') || '[]');
        if (cachedData.length > 0) {
          console.log('📦 Using cached reviews:', cachedData.length);
          return cachedData;
        }
        
        // Cache de boşsa son çare olarak boş array döndür
        console.warn('💾 No cached data available, returning empty array');
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1, // Sadece 1 kez tekrar dene
  });

  // Başarılı veri alındığında cache'e kaydet
  useEffect(() => {
    if (query.data && query.data.length > 0 && query.isSuccess) {
      localStorage.setItem('reviews-cache', JSON.stringify(query.data));
      console.log('💾 Reviews cached successfully');
    }
  }, [query.data, query.isSuccess]);

  return query;
};

/**
 * Hook to get reviews for a specific field
 */
export const useFieldReviews = (fieldId: string) => {
  const { data: allReviews, isLoading, error } = useAllReviews();

  // Eğer fieldId boş ise erken return - review işlemini yapma
  if (!fieldId || fieldId.trim() === '') {
    console.log('⚠️ fieldId is empty, returning empty state');
    return {
      reviews: [],
      rating: 0,
      reviewCount: 0,
      isLoading: false,
      error: null,
    };
  }

  console.log(`🏟️ Processing reviews for field: ${fieldId}`);
  console.log('📋 All reviews from backend:', allReviews);
  
  // 🔍 DETAILED REVIEW INSPECTION
  if (allReviews && allReviews.length > 0) {
    console.log('🔍 Detailed review inspection:');
    allReviews.forEach((review, index) => {
      console.log(`  Review ${index}:`, {
        id: review.id,
        haliSahaId: review.haliSahaId,
        userId: review.userId,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        createdAtType: typeof review.createdAt
      });
      console.log(`  Review ${index} haliSahaId type:`, typeof review.haliSahaId);
      console.log(`  Review ${index} haliSahaId === fieldId:`, review.haliSahaId === fieldId);
      console.log(`  Review ${index} haliSahaId length:`, review.haliSahaId?.length);
      console.log(`  fieldId length:`, fieldId.length);
      console.log(`  Review ${index} createdAt:`, review.createdAt);
      console.log(`  Review ${index} date parsing test:`, new Date(review.createdAt));
    });
  }

  const fieldReviews: Review[] = allReviews ? getFieldReviews(allReviews, fieldId) : [];
  const averageRating = allReviews ? calculateAverageRating(allReviews.filter(r => r.haliSahaId === fieldId)) : 0;
  const reviewCount = allReviews ? getReviewCount(allReviews, fieldId) : 0;

  console.log(`🎯 Filtered reviews for field ${fieldId}:`, fieldReviews);
  console.log(`⭐ Average rating: ${averageRating}, Count: ${reviewCount}`);

  return {
    reviews: fieldReviews,
    rating: averageRating,
    reviewCount,
    isLoading,
    error,
  };
};

/**
 * Hook to create a new review
 */
export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reviewData: CreateReviewData): Promise<BackendReview> => {
      const response = await apiService.createReview(reviewData);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate reviews cache to refetch
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (reviewId: string) => apiService.deleteReview(reviewId),
    onSuccess: () => {
      // Invalidate and refetch reviews query to update the list
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation<BackendReview, Error, { reviewId: string; data: UpdateReviewData }>({
    mutationFn: ({ reviewId, data }) => apiService.updateReview(reviewId, data),
    onSuccess: (updatedReview) => {
      // Update the cache directly for instant UI update
      queryClient.setQueryData(['reviews'], (oldData: BackendReview[] | undefined) => {
        return oldData ? oldData.map(review => review.id === updatedReview.id ? updatedReview : review) : [];
      });
      // Optionally, invalidate to ensure data is fresh
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}; 