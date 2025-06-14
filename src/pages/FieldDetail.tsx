
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Star, MapPin, Clock, Users, Wifi, Car, Lightbulb, Coffee, Shirt, Camera, Phone, Shield, ArrowLeft, Heart, Share2 } from 'lucide-react';
import Header from '@/components/Header';
import ReviewSection from '@/components/ReviewSection';
import { toast } from "sonner";

interface FieldDetailProps {
  user: any;
  setUser: (user: any) => void;
}

const FieldDetail = ({ user, setUser }: FieldDetailProps) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  // Mock data - in real app, this would come from API based on ID
  const field = {
    id: parseInt(id || '1'),
    name: "Yeşilköy Spor Kompleksi",
    location: "Yeşilköy Mah. Atatürk Cad. No:45, Bakırköy/İstanbul",
    rating: 4.8,
    reviewCount: 124,
    pricePerHour: 250,
    images: [
      "https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=800",
      "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800",
      "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800",
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800"
    ],
    amenities: [
      { name: "Işıklı Saha", icon: Lightbulb, available: true },
      { name: "Ücretsiz Park", icon: Car, available: true },
      { name: "Ayakkabı Kiralama", icon: Shirt, available: true },
      { name: "WiFi", icon: Wifi, available: true },
      { name: "Kafeterya", icon: Coffee, available: true },
      { name: "Güvenlik Kamerası", icon: Camera, available: true },
      { name: "Soyunma Odası", icon: Users, available: true },
      { name: "24/7 Güvenlik", icon: Shield, available: true }
    ],
    description: "Modern tesisleri ve geniş alanı ile futbol tutkunlarının tercihi olan halı sahamız, profesyonel kalitede zemin ve tam donanımlı tesisleri ile unutulmaz maçlar yaşamanızı sağlar.",
    phone: "+90 212 555 0123",
    workingHours: "06:00 - 02:00",
    capacity: "10v10, 7v7, 5v5"
  };

  const mockReviews = [
    {
      id: 1,
      user: "Mehmet Yılmaz",
      rating: 5,
      comment: "Harika bir saha! Zemin kalitesi mükemmel ve tesisler çok temiz. Kesinlikle tavsiye ederim. Işıklandırma da çok iyi, gece maçları için ideal.",
      date: "2024-01-15",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      helpful: 8,
      notHelpful: 1,
      verified: true
    },
    {
      id: 2,
      user: "Ayşe Kara",
      rating: 4,
      comment: "Çok güzel bir kompleks. Park sorunu yok ve personel çok ilgili. Sadece kafeterya biraz pahalı. Genel olarak memnun kaldım.",
      date: "2024-01-10",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=40&h=40&fit=crop&crop=face",
      helpful: 5,
      notHelpful: 0,
      verified: true
    },
    {
      id: 3,
      user: "Can Demir",
      rating: 5,
      comment: "Arkadaşlarımla düzenli olarak geliyoruz. Rezervasyon sistemi çok kolay ve saha her zaman temiz. Soyunma odaları da çok düzenli.",
      date: "2024-01-05",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      helpful: 12,
      notHelpful: 2,
      verified: true
    },
    {
      id: 4,
      user: "Fatma Özkan",
      rating: 3,
      comment: "Saha güzel ama rezervasyon iptal politikası biraz sıkı. 2 saat öncesinden iptal etmek zorunda kalmak bazen zor oluyor.",
      date: "2024-01-02",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
      helpful: 3,
      notHelpful: 4,
      verified: false
    }
  ];

  const timeSlots = [
    "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00",
    "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"
  ];

  const bookedSlots = ["14:00", "18:00", "20:00"]; // Mock booked slots

  const handleBooking = () => {
    if (!user) {
      toast.error("Rezervasyon yapmak için giriş yapmalısınız!");
      return;
    }
    
    if (!selectedDate || !selectedTime) {
      toast.error("Lütfen tarih ve saat seçiniz!");
      return;
    }
    
    toast.success(`Rezervasyon yapıldı!\nTarih: ${selectedDate.toLocaleDateString('tr-TR')}\nSaat: ${selectedTime}\nSaha: ${field.name}`);
  };

  const handleFavorite = () => {
    if (!user) {
      toast.error("Favorilere eklemek için giriş yapmalısınız!");
      return;
    }
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "Favorilerden çıkarıldı" : "Favorilere eklendi");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <Header 
        user={user} 
        onLoginClick={() => {}}
        onRegisterClick={() => {}}
        onLogout={() => setUser(null)}
      />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/fields')}
            className="flex items-center gap-2 text-gray-600 hover:text-green-600 hover:bg-green-50 transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Sahalara Dön
          </Button>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleFavorite}
              className={`transition-all duration-200 ${isFavorite ? "text-red-500 hover:text-red-600 bg-red-50" : "text-gray-400 hover:text-red-500 hover:bg-red-50"}`}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-green-600 hover:bg-green-50 transition-all duration-200">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Enhanced Image Gallery */}
            <div className="relative group">
              <div className="grid grid-cols-4 gap-3 h-96 rounded-2xl overflow-hidden shadow-2xl">
                <div className="col-span-2 row-span-2 relative overflow-hidden">
                  <img 
                    src={field.images[0]} 
                    alt={field.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500 cursor-pointer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="col-span-2 grid grid-cols-2 gap-3">
                  {field.images.slice(1).map((image, index) => (
                    <div key={index} className="relative overflow-hidden rounded-lg">
                      <img 
                        src={image} 
                        alt={`${field.name} ${index + 2}`}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500 cursor-pointer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  ))}
                </div>
              </div>
              <Badge className="absolute top-6 left-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 text-lg shadow-lg">
                ₺{field.pricePerHour}/saat
              </Badge>
            </div>

            {/* Enhanced Field Info */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
                      {field.name}
                    </h1>
                    <div className="space-y-3 text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-green-600" />
                        <span className="text-lg">{field.location}</span>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <Phone className="h-5 w-5 text-green-600" />
                          <span>{field.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-green-600" />
                          <span>{field.workingHours}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-green-600" />
                          <span>{field.capacity}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-2xl border border-yellow-200">
                    <div className="flex items-center gap-2 mb-2 justify-end">
                      <Star className="h-6 w-6 text-yellow-500 fill-current" />
                      <span className="text-2xl font-bold text-gray-900">{field.rating}</span>
                    </div>
                    <span className="text-gray-600">({field.reviewCount} yorum)</span>
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed text-lg bg-gray-50 p-6 rounded-xl border-l-4 border-green-500">
                  {field.description}
                </p>
              </CardContent>
            </Card>

            {/* Enhanced Amenities */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Özellikler ve Hizmetler
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {field.amenities.map((amenity, index) => (
                    <div key={index} className="group flex items-center gap-3 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100 hover:shadow-lg transition-all duration-300 hover:scale-105">
                      <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg group-hover:scale-110 transition-transform duration-300">
                        <amenity.icon className="h-5 w-5 text-white" />
                      </div>
                      <span className="font-medium text-gray-800">{amenity.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Reviews Section */}
            <ReviewSection
              fieldId={field.id}
              fieldName={field.name}
              averageRating={field.rating}
              totalReviews={field.reviewCount}
              reviews={mockReviews}
              isLoggedIn={!!user}
            />
          </div>

          {/* Enhanced Booking Sidebar */}
          <div className="space-y-6">
            <div className="lg:sticky lg:top-4 space-y-6">
              <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm z-10">
                <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center justify-between text-xl">
                    <span>Rezervasyon Yap</span>
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      ₺{field.pricePerHour}/saat
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  {!user && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                      <p className="text-orange-800 font-medium mb-2">Rezervasyon yapmak için giriş yapın</p>
                      <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                        Giriş Yap
                      </Button>
                    </div>
                  )}

                  {/* Date Selection */}
                  <div>
                    <label className="block text-sm font-semibold mb-3 text-gray-700">Tarih Seçin</label>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date() || !user}
                        className="rounded-md"
                      />
                    </div>
                  </div>

                  {/* Time Selection */}
                  {selectedDate && user && (
                    <div>
                      <label className="block text-sm font-semibold mb-3 text-gray-700">Saat Seçin</label>
                      <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto bg-gray-50 p-3 rounded-lg">
                        {timeSlots.map((time) => {
                          const isBooked = bookedSlots.includes(time);
                          const isSelected = selectedTime === time;
                          return (
                            <Button
                              key={time}
                              variant={isSelected ? "default" : "outline"}
                              size="sm"
                              disabled={isBooked}
                              onClick={() => setSelectedTime(time)}
                              className={`${
                                isSelected 
                                  ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700" 
                                  : isBooked 
                                    ? "opacity-50 cursor-not-allowed bg-red-100 text-red-600" 
                                    : "hover:bg-green-50 hover:border-green-300"
                              } transition-all duration-200`}
                            >
                              {time}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Booking Summary */}
                  {selectedDate && selectedTime && user && (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                      <h4 className="font-semibold mb-4 text-gray-800 text-lg">Rezervasyon Özeti</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Tarih:</span>
                          <span className="font-medium">{selectedDate.toLocaleDateString('tr-TR')}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Saat:</span>
                          <span className="font-medium">{selectedTime}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Süre:</span>
                          <span className="font-medium">1 saat</span>
                        </div>
                        <div className="border-t border-green-200 pt-3 mt-3">
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold text-gray-800">Toplam:</span>
                            <span className="text-xl font-bold text-green-600">₺{field.pricePerHour}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <Button 
                    onClick={handleBooking}
                    disabled={!selectedDate || !selectedTime || !user}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {!user ? "Giriş Yapın" : "Rezervasyon Yap"}
                  </Button>

                  <p className="text-xs text-gray-500 text-center bg-gray-50 p-3 rounded-lg">
                    Rezervasyonunuz onaylandıktan sonra SMS ile bilgilendirileceksiniz.
                  </p>
                </CardContent>
              </Card>

              {/* Enhanced Quick Info */}
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-800">Hızlı Bilgiler</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: "Minimum rezervasyon:", value: "1 saat" },
                    { label: "İptal politikası:", value: "2 saat öncesine kadar" },
                    { label: "Ödeme:", value: "Nakit/Kart" },
                    { label: "Yaş sınırı:", value: "16+" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                      <span className="text-gray-600">{item.label}</span>
                      <span className="font-medium text-gray-800">{item.value}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldDetail;
