
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock } from 'lucide-react';

interface FieldCardProps {
  field: {
    id: number;
    name: string;
    location: string;
    rating: number;
    reviewCount: number;
    pricePerHour: number;
    image: string;
    amenities: string[];
  };
}

const FieldCard = ({ field }: FieldCardProps) => {
  const navigate = useNavigate();

  const handleReservationClick = () => {
    navigate(`/field/${field.id}`);
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
      <div className="relative">
        <img 
          src={field.image} 
          alt={field.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4">
          <Badge className="bg-white/90 text-gray-900 hover:bg-white">
            ₺{field.pricePerHour}/saat
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
            {field.name}
          </h3>
          <div className="flex items-center space-x-1 text-yellow-500">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-sm font-medium text-gray-700">{field.rating}</span>
            <span className="text-sm text-gray-500">({field.reviewCount})</span>
          </div>
        </div>
        
        <div className="flex items-center text-gray-600 mb-4">
          <MapPin className="h-4 w-4 mr-2" />
          <span className="text-sm">{field.location}</span>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {field.amenities.slice(0, 3).map((amenity, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {amenity}
            </Badge>
          ))}
          {field.amenities.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{field.amenities.length - 3} daha
            </Badge>
          )}
        </div>
        
        <Button 
          onClick={handleReservationClick}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
        >
          Rezervasyon Yap
        </Button>
      </CardContent>
    </Card>
  );
};

export default FieldCard;
