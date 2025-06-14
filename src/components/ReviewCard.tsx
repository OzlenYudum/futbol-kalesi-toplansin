
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from "@/components/ui/button";

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

interface ReviewCardProps {
  review: Review;
  onHelpful?: (reviewId: number) => void;
  onNotHelpful?: (reviewId: number) => void;
}

const ReviewCard = ({ review, onHelpful, onNotHelpful }: ReviewCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={review.avatar} alt={review.user} />
            <AvatarFallback className="bg-green-100 text-green-600">
              {review.user.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-gray-900">{review.user}</h4>
                {review.verified && (
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                    Doğrulanmış
                  </Badge>
                )}
              </div>
              <span className="text-sm text-gray-500">{formatDate(review.date)}</span>
            </div>
            
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-700">{review.rating}/5</span>
            </div>
            
            <p className="text-gray-700 leading-relaxed mb-4">{review.comment}</p>
            
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onHelpful?.(review.id)}
                className="text-gray-600 hover:text-green-600 hover:bg-green-50"
              >
                <ThumbsUp className="h-4 w-4 mr-1" />
                Faydalı ({review.helpful})
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNotHelpful?.(review.id)}
                className="text-gray-600 hover:text-red-600 hover:bg-red-50"
              >
                <ThumbsDown className="h-4 w-4 mr-1" />
                Faydalı değil ({review.notHelpful})
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
