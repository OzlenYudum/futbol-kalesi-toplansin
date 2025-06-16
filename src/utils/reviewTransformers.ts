import { BackendReview, Review } from '@/types';

/**
 * Transforms backend review to frontend review format
 */
export const transformBackendReview = (backendReview: BackendReview): Review => {
  console.log('🔄 Transforming backend review:', backendReview);
  
  // Safe date transformation
  const formatDate = (dateString: string): string => {
    try {
      if (!dateString) {
        return new Date().toLocaleDateString('tr-TR'); // Fallback to today
      }
      
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn('⚠️ Invalid date received:', dateString);
        return new Date().toLocaleDateString('tr-TR'); // Fallback to today
      }
      
      return date.toLocaleDateString('tr-TR');
    } catch (error) {
      console.error('❌ Date parsing error:', error);
      return new Date().toLocaleDateString('tr-TR'); // Fallback to today
    }
  };
  
  return {
    id: backendReview.id, // Keep original string UUID
    userId: backendReview.userId,
    haliSahaId: backendReview.haliSahaId,
    user: backendReview.user?.name || 'Anonim Kullanıcı',
    rating: backendReview.rating,
    comment: backendReview.comment,
    date: formatDate(backendReview.createdAt),
    avatar: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?w=40&h=40&fit=crop&crop=face`, // Random avatar
    helpful: Math.floor(Math.random() * 20), // Random helpful count
    notHelpful: Math.floor(Math.random() * 5), // Random not helpful count
    verified: Math.random() > 0.3, // 70% chance of being verified
  };
};

/**
 * Filters reviews by field ID
 */
export const filterReviewsByFieldId = (reviews: BackendReview[], fieldId: string): BackendReview[] => {
  // Defensive check to prevent errors if data is malformed
  if (!reviews || !fieldId) {
    return [];
  }
  
  return reviews.filter(review => {
    // Ensure both IDs are strings and trim any whitespace before comparing
    const reviewFieldId = String(review.haliSahaId || '').trim();
    const targetFieldId = String(fieldId).trim();
    return reviewFieldId === targetFieldId;
  });
};

/**
 * Calculates average rating from reviews
 */
export const calculateAverageRating = (reviews: BackendReview[]): number => {
  if (reviews.length === 0) return 0;
  
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  const average = sum / reviews.length;
  
  return Math.round(average * 10) / 10; // Round to 1 decimal place
};

/**
 * Gets review count for a field
 */
export const getReviewCount = (reviews: BackendReview[], fieldId: string): number => {
  return filterReviewsByFieldId(reviews, fieldId).length;
};

/**
 * Transforms and filters reviews for a specific field
 */
export const getFieldReviews = (allReviews: BackendReview[], fieldId: string): Review[] => {
  const fieldReviews = filterReviewsByFieldId(allReviews, fieldId);
  return fieldReviews.map(transformBackendReview);
}; 