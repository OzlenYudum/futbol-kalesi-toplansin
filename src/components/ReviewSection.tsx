
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Plus, Filter, TrendingUp } from 'lucide-react';
import ReviewCard from './ReviewCard';
import WriteReviewModal from './WriteReviewModal';

interface Review {
  id: number;
  user: string;
  rating: number;
  comment: string;
  date: string;
  avatar: string;
  helpful: number;
  notHelpful: number;
  verified: boolean;
}

interface ReviewSectionProps {
  fieldId: number;
  fieldName: string;
  averageRating: number;
  totalReviews: number;
  reviews: Review[];
  isLoggedIn?: boolean;
}

const ReviewSection = ({ 
  fieldId, 
  fieldName, 
  averageRating, 
  totalReviews, 
  reviews: initialReviews,
  isLoggedIn = false 
}: ReviewSectionProps) => {
  const [reviews, setReviews] = useState(initialReviews);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [filterRating, setFilterRating] = useState('all');

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => {
    const count = reviews.filter(review => review.rating === rating).length;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { rating, count, percentage };
  });

  const handleAddReview = (newReview: { rating: number; comment: string }) => {
    const review: Review = {
      id: Date.now(),
      user: "Kullanıcı", // In real app, this would come from user context
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString(),
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      helpful: 0,
      notHelpful: 0,
      verified: true
    };
    
    setReviews(prev => [review, ...prev]);
  };

  const handleHelpful = (reviewId: number) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { ...review, helpful: review.helpful + 1 }
        : review
    ));
  };

  const handleNotHelpful = (reviewId: number) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { ...review, notHelpful: review.notHelpful + 1 }
        : review
    ));
  };

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
                onClick={() => setIsWriteModalOpen(true)}
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
              onHelpful={handleHelpful}
              onNotHelpful={handleNotHelpful}
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
                  onClick={() => setIsWriteModalOpen(true)}
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
        onSubmit={handleAddReview}
        fieldName={fieldName}
      />
    </div>
  );
};

export default ReviewSection;
