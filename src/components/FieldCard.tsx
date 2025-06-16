
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, Zap, Crown, Wifi, Car, Lightbulb, Users, Shirt, Coffee } from 'lucide-react';

interface FieldCardProps {
  field: {
    id: string | number;
    name: string;
    location: string;
    rating: number;
    reviewCount: number;
    pricePerHour: number;
    image: string;
    amenities: string[];
    premium?: boolean;
    availability?: string;
    features?: {
      lighting: boolean;
      parking: boolean;
      wifi: boolean;
      locker: boolean;
      shoeRental?: boolean;
      cafeteria?: boolean;
    };
  };
}

const FieldCard = ({ field }: FieldCardProps) => {
  const navigate = useNavigate();

  const handleReservationClick = () => {
    navigate(`/field/${field.id}`);
  };

  const getAvailabilityColor = (availability: string) => {
    const slots = parseInt(availability.match(/\d+/)?.[0] || '0');
    if (slots <= 3) return 'text-red-600 bg-red-50';
    if (slots <= 7) return 'text-orange-600 bg-orange-50';
    return 'text-green-600 bg-green-50';
  };

  return (
    <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <div className="relative overflow-hidden">
        <img 
          src={field.image} 
          alt={field.name}
          className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Premium Badge */}
        {field.premium && (
          <div className="absolute top-4 left-4">
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 shadow-lg">
              <Crown className="h-3 w-3 mr-1" />
              Premium
            </Badge>
          </div>
        )}
        
        {/* Price Badge */}
        <div className="absolute top-4 right-4">
          <Badge className="bg-white/90 text-gray-900 hover:bg-white px-3 py-1 shadow-lg font-semibold">
            ₺{field.pricePerHour}/saat
          </Badge>
        </div>

        {/* Availability */}
        {field.availability && (
          <div className="absolute bottom-4 left-4">
            <Badge className={`${getAvailabilityColor(field.availability)} px-3 py-1 shadow-lg`}>
              <Clock className="h-3 w-3 mr-1" />
              {field.availability}
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-300 line-clamp-1">
            {field.name}
          </h3>
          <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-lg">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="text-sm font-semibold text-gray-800">{field.rating}</span>
            <span className="text-sm text-gray-500">({field.reviewCount})</span>
          </div>
        </div>
        
        <div className="flex items-center text-gray-600 mb-4">
          <MapPin className="h-4 w-4 mr-2 text-green-600" />
          <span className="text-sm">{field.location}</span>
        </div>

        {/* Quick Features */}
        {field.features && (
          <div className="flex items-center gap-2 mb-4">
            {field.features.lighting && (
              <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-md">
                <Lightbulb className="h-3 w-3 text-green-600" />
                <span className="text-xs text-green-700">Işıklı</span>
              </div>
            )}
            {field.features.parking && (
              <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-md">
                <Car className="h-3 w-3 text-blue-600" />
                <span className="text-xs text-blue-700">Park</span>
              </div>
            )}
            {field.features.wifi && (
              <div className="flex items-center gap-1 bg-purple-50 px-2 py-1 rounded-md">
                <Wifi className="h-3 w-3 text-purple-600" />
                <span className="text-xs text-purple-700">WiFi</span>
              </div>
            )}
            {field.features.locker && (
              <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-md">
                <Users className="h-3 w-3 text-orange-600" />
                <span className="text-xs text-orange-700">Soyunma</span>
              </div>
            )}
            {field.features.shoeRental && (
              <div className="flex items-center gap-1 bg-indigo-50 px-2 py-1 rounded-md">
                <Shirt className="h-3 w-3 text-indigo-600" />
                <span className="text-xs text-indigo-700">Ayakkabı</span>
              </div>
            )}
            {field.features.cafeteria && (
              <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-md">
                <Coffee className="h-3 w-3 text-amber-600" />
                <span className="text-xs text-amber-700">Kafeterya</span>
              </div>
            )}
          </div>
        )}
        
        <div className="flex flex-wrap gap-2 mb-4">
          {field.amenities.slice(0, 3).map((amenity, index) => (
            <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200">
              {amenity}
            </Badge>
          ))}
          {field.amenities.length > 3 && (
            <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
              +{field.amenities.length - 3} daha
            </Badge>
          )}
        </div>
        
        <Button 
          onClick={handleReservationClick}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 py-3 font-semibold"
        >
          <Zap className="h-4 w-4 mr-2" />
          Hemen Rezervasyon Yap
        </Button>
      </CardContent>
    </Card>
  );
};

export default FieldCard;
