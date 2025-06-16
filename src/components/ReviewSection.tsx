import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Plus, Filter, TrendingUp } from 'lucide-react';
import ReviewCard from './ReviewCard';
import WriteReviewModal from './WriteReviewModal';
import { useCreateReview, useDeleteReview, useUpdateReview } from '@/hooks/api/useReviews';
import { toast } from 'sonner';
import { apiService } from '@/services/api';
import { User, Review, UpdateReviewData } from '@/types';

interface ReviewSectionProps {
  fieldId: string; // Backend'de string ID kullanıyoruz
  fieldName: string;
  rating: number;
  totalReviews: number;
  reviews: Review[];
  isLoggedIn?: boolean;
}

const ReviewSection = ({ 
  fieldId, 
  fieldName, 
  rating: averageRating, 
  totalReviews, 
  reviews: initialReviews,
  isLoggedIn = false 
}: ReviewSectionProps) => {
  const [reviews, setReviews] = useState(initialReviews);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [sortBy, setSortBy] = useState('newest');
  const [filterRating, setFilterRating] = useState('all');

  // Backend review hooks
  const createReviewMutation = useCreateReview();
  const deleteReviewMutation = useDeleteReview();
  const updateReviewMutation = useUpdateReview();

  // Debug: Log received reviews
  console.log('🎭 ReviewSection received props:');
  console.log('  - fieldId:', fieldId);
  console.log('  - fieldName:', fieldName);
  console.log('  - averageRating:', averageRating);
  console.log('  - totalReviews:', totalReviews);
  console.log('  - initialReviews:', initialReviews);
  console.log('  - current reviews state:', reviews);

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => {
    const count = reviews.filter(review => review.rating === rating).length;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { rating, count, percentage };
  });

  const handleOpenWriteModal = () => {
    setEditingReview(null);
    setIsWriteModalOpen(true);
  };

  const handleOpenEditModal = (review: Review) => {
    setEditingReview(review);
    setIsWriteModalOpen(true);
  };

  const handleSubmitReview = async (data: { rating: number; comment: string }) => {
    if (editingReview) {
      // Güvenlik kontrolü - kullanıcı giriş yapmış mı?
      const currentUser = apiService.getCurrentUser();
      if (!currentUser) {
        toast.error("Yorum güncellemek için giriş yapmanız gerekiyor.");
        setIsWriteModalOpen(false);
        return;
      }

      // Sahiplik kontrolü - bu kullanıcının yorumu mu?
      if (editingReview.userId !== currentUser.id) {
        toast.error("Sadece kendi yorumlarınızı güncelleyebilirsiniz.");
        setIsWriteModalOpen(false);
        return;
      }

      // WORKAROUND: Send all data the backend might require, to satisfy strict schema
      const updateData = {
        rating: data.rating,
        comment: data.comment,
        userId: editingReview.userId,
        haliSahaId: editingReview.haliSahaId
      };

      // Optional: Check if anything actually changed to avoid unnecessary API calls
      if (updateData.rating === editingReview.rating && updateData.comment === editingReview.comment) {
        toast.info("Yorumda bir değişiklik yapmadınız.");
        setIsWriteModalOpen(false);
        return;
      }

      try {
        await updateReviewMutation.mutateAsync({ reviewId: editingReview.id, data: updateData });
        // Optimistic update
        setReviews(prev => prev.map(r => r.id === editingReview.id ? { ...r, ...data } : r));
        toast.success("Yorum başarıyla güncellendi.");
      } catch (error: any) {
        const errorMessage = error?.message || error?.response?.data?.message || "Yorum güncellenirken bir hata oluştu.";
        toast.error(errorMessage);
        console.error("Update review error:", error.response?.data || error);
      }
    } else {
      // Create new review
      handleAddReview(data);
    }
    setIsWriteModalOpen(false);
  };

  const handleAddReview = async (newReview: { rating: number; comment: string }) => {
    console.log('🎯 handleAddReview called with:', newReview);
    console.log('🏟️ fieldId:', fieldId);
    
    // 🔧 TOKEN DEBUG - Detaylı token kontrolü
    console.log('=== TOKEN DEBUG START ===');
    const token = localStorage.getItem('token');
    console.log('1. Token exists:', !!token);
    console.log('2. Token preview:', token ? `${token.substring(0, 50)}...` : 'null');
    
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('3. Token payload:', payload);
        console.log('4. Payload keys:', Object.keys(payload));
        console.log('5. payload.id:', payload.id, 'type:', typeof payload.id);
        console.log('6. payload.userId:', payload.userId, 'type:', typeof payload.userId);
        console.log('7. payload.user?.id:', payload.user?.id, 'type:', typeof payload.user?.id);
        
        // Token expiry check
        if (payload.exp) {
          const now = Math.floor(Date.now() / 1000);
          const isExpired = payload.exp < now;
          console.log('8. Token exp:', payload.exp, 'now:', now, 'expired:', isExpired);
        }
      } catch (error) {
        console.error('❌ Token parse error:', error);
      }
    }
    console.log('=== TOKEN DEBUG END ===');
    
    if (!fieldId) {
      console.error('❌ Field ID is missing');
      toast.error('Halı saha bilgisi eksik. Sayfayı yenileyin.');
      return;
    }
    
    try {
      // Current user'ı al
      const currentUser = apiService.getCurrentUser();
      console.log('🔍 Current user from apiService:', currentUser);
      
      if (!currentUser) {
        console.error('❌ No current user found');
        toast.error('Kullanıcı bilgisi bulunamadı. Lütfen tekrar giriş yapın.');
        return;
      }
      
      if (!currentUser.id) {
        console.error('❌ User ID missing:', currentUser);
        toast.error('Kullanıcı ID bilgisi eksik. Lütfen tekrar giriş yapın.');
        return;
      }

      const reviewData = {
        userId: currentUser.id,
        haliSahaId: fieldId,
        rating: parseInt(newReview.rating.toString()), // Backend Int bekliyor
        comment: newReview.comment.trim() // Boşlukları temizle
      };
      
      console.log('📋 Final review data to send:', reviewData);
      console.log('📋 Review data types:', {
        userId: typeof reviewData.userId,
        haliSahaId: typeof reviewData.haliSahaId,
        rating: typeof reviewData.rating,
        comment: typeof reviewData.comment
      });
      
      // Validation kontrolü (Backend Zod schema'ya göre)
      if (!reviewData.comment || reviewData.comment.length < 1) {
        toast.error('Yorum boş olamaz.');
        return;
      }
      
      if (reviewData.rating < 1 || reviewData.rating > 5) {
        toast.error('Puan 1 ile 5 arasında olmalı.');
        return;
      }
      
      // UUID format kontrolü
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(reviewData.userId)) {
        console.error('❌ Invalid userId format:', reviewData.userId);
        toast.error('Kullanıcı ID formatı geçersiz.');
        return;
      }
      
      if (!uuidRegex.test(reviewData.haliSahaId)) {
        console.error('❌ Invalid haliSahaId format:', reviewData.haliSahaId);
        toast.error('Halı saha ID formatı geçersiz.');
        return;
      }
      
      console.log('📤 Sending review data:', reviewData);

      // Backend'e yorum gönder
      const result = await createReviewMutation.mutateAsync(reviewData);
      console.log('✅ Review creation result:', result);

      toast.success('Yorumunuz başarıyla eklendi!');
      
      // Replace the part where it adds to local state with the new logic
      const tempReview: Review = {
        id: result.id,
        userId: result.userId,
        haliSahaId: result.haliSahaId,
        user: result.user?.name || currentUser.name,
        rating: result.rating,
        comment: result.comment,
        date: new Date(result.createdAt).toLocaleDateString('tr-TR'),
        avatar: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?w=40&h=40&fit=crop&crop=face`,
        helpful: 0,
        notHelpful: 0,
        verified: true
      };
      
      setReviews(prev => [tempReview, ...prev]);
    } catch (error: any) {
      console.error('❌ Review creation error:', error);
      
      // Detaylı hata mesajı
      let errorMessage = 'Yorum eklenirken bir hata oluştu.';
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      console.error('Error details:', {
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status
      });
      
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (reviewId: string) => {
    // Güvenlik kontrolü - kullanıcı giriş yapmış mı?
    const currentUser = apiService.getCurrentUser();
    if (!currentUser) {
      toast.error("Yorum silmek için giriş yapmanız gerekiyor.");
      return;
    }

    // Sahiplik kontrolü - bu kullanıcının yorumu mu?
    const reviewToDelete = reviews.find(r => r.id === reviewId);
    if (!reviewToDelete) {
      toast.error("Silinecek yorum bulunamadı.");
      return;
    }

    if (reviewToDelete.userId !== currentUser.id) {
      toast.error("Sadece kendi yorumlarınızı silebilirsiniz.");
      return;
    }

    try {
      await deleteReviewMutation.mutateAsync(reviewId);
      setReviews(prev => prev.filter(review => review.id !== reviewId));
      toast.success("Yorum başarıyla silindi.");
    } catch (error: any) {
      const errorMessage = error?.message || "Yorum silinirken bir hata oluştu.";
      toast.error(errorMessage);
      console.error("Delete review error:", error);
    }
  };

  const handleHelpful = (reviewId: string) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { ...review, helpful: review.helpful + 1 }
        : review
    ));
  };

  const handleNotHelpful = (reviewId: string) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { ...review, notHelpful: review.notHelpful + 1 }
        : review
    ));
  };

  // Get current user for showing delete button
  const currentUser = apiService.getCurrentUser();

  // Filter and sort reviews
  const filteredAndSortedReviews = reviews
    .filter(review => filterRating === 'all' || review.rating.toString() === filterRating)
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        case 'helpful':
          return b.helpful - a.helpful;
        default:
          return 0;
      }
    });

  return (
    <div className="space-y-6">
      {/* Rating Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Değerlendirmeler ve Yorumlar</span>
            {isLoggedIn && (
              <Button 
                onClick={handleOpenWriteModal}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Yorum Yaz
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Overall Rating */}
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-900 mb-2">{averageRating}</div>
              <div className="flex items-center justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-6 w-6 ${i < Math.floor(averageRating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <p className="text-gray-600">{totalReviews} değerlendirme</p>
              <Badge variant="secondary" className="mt-2">
                <TrendingUp className="h-3 w-3 mr-1" />
                Son 30 günde +12 yorum
              </Badge>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-3">
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 min-w-[60px]">
                    <span className="text-sm font-medium">{rating}</span>
                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 min-w-[40px]">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Sorting */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Filtrele:</span>
        </div>
        <Select value={filterRating} onValueChange={setFilterRating}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm Puanlar</SelectItem>
            <SelectItem value="5">5 Yıldız</SelectItem>
            <SelectItem value="4">4 Yıldız</SelectItem>
            <SelectItem value="3">3 Yıldız</SelectItem>
            <SelectItem value="2">2 Yıldız</SelectItem>
            <SelectItem value="1">1 Yıldız</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">En Yeni</SelectItem>
            <SelectItem value="oldest">En Eski</SelectItem>
            <SelectItem value="highest">En Yüksek Puan</SelectItem>
            <SelectItem value="lowest">En Düşük Puan</SelectItem>
            <SelectItem value="helpful">En Faydalı</SelectItem>
          </SelectContent>
        </Select>
        
        <Badge variant="outline" className="ml-auto">
          {filteredAndSortedReviews.length} yorum gösteriliyor
        </Badge>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredAndSortedReviews.length > 0 ? (
          filteredAndSortedReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              currentUser={currentUser}
              onHelpful={handleHelpful}
              onNotHelpful={handleNotHelpful}
              onDelete={handleDelete}
              onEdit={handleOpenEditModal}
            />
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Henüz yorum bulunmuyor
              </h3>
              <p className="text-gray-600 mb-4">
                Bu saha hakkında ilk yorumu siz yazın!
              </p>
              {isLoggedIn && (
                <Button 
                  onClick={handleOpenWriteModal}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  İlk Yorumu Yaz
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Write Review Modal */}
      <WriteReviewModal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        onSubmit={handleSubmitReview}
        fieldName={fieldName}
        initialData={editingReview ? { rating: editingReview.rating, comment: editingReview.comment } : undefined}
      />
    </div>
  );
};

export default ReviewSection;
