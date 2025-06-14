
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from 'lucide-react';

interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (review: { rating: number; comment: string }) => void;
  fieldName: string;
}

const WriteReviewModal = ({ isOpen, onClose, onSubmit, fieldName }: WriteReviewModalProps) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Lütfen bir puan seçiniz!');
      return;
    }
    if (comment.trim().length < 10) {
      alert('Yorum en az 10 karakter olmalıdır!');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      onSubmit({ rating, comment: comment.trim() });
      setRating(0);
      setHoverRating(0);
      setComment('');
      setLoading(false);
      onClose();
    }, 1000);
  };

  const resetForm = () => {
    setRating(0);
    setHoverRating(0);
    setComment('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Yorum Yaz
            </span>
          </DialogTitle>
          <p className="text-center text-gray-600 mt-2">
            {fieldName} hakkında deneyiminizi paylaşın
          </p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-3">
            <Label className="text-base font-medium">Puanınız</Label>
            <div className="flex items-center justify-center gap-2 p-4 bg-gray-50 rounded-lg">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="transition-transform hover:scale-110"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star 
                    className={`h-8 w-8 ${
                      star <= (hoverRating || rating) 
                        ? 'text-yellow-500 fill-current' 
                        : 'text-gray-300'
                    }`} 
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-center text-sm text-gray-600">
                {rating === 1 && "Çok kötü"}
                {rating === 2 && "Kötü"}
                {rating === 3 && "Orta"}
                {rating === 4 && "İyi"}
                {rating === 5 && "Mükemmel"}
              </p>
            )}
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="comment" className="text-base font-medium">
              Yorumunuz
            </Label>
            <Textarea
              id="comment"
              placeholder="Saha hakkındaki deneyiminizi detaylı bir şekilde paylaşın..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="resize-none focus:ring-2 focus:ring-green-500"
              maxLength={500}
            />
            <div className="text-right text-xs text-gray-500">
              {comment.length}/500 karakter
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              className="flex-1"
              disabled={loading}
            >
              İptal
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
              disabled={loading || rating === 0}
            >
              {loading ? 'Gönderiliyor...' : 'Yorum Gönder'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WriteReviewModal;
