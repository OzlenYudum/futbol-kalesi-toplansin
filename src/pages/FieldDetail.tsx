import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Star, MapPin, Clock, Users, Wifi, Car, Lightbulb, Coffee, Shirt, Camera, Phone, Shield, ArrowLeft, Heart, Share2 } from 'lucide-react';
import Header from '@/components/Header';
import ReviewSection from '@/components/ReviewSection';
import LoginModal from '@/components/LoginModal';
import RegisterModal from '@/components/RegisterModal';
import { toast } from "sonner";
import { useQuery } from '@tanstack/react-query';
import { useFieldReviews } from '@/hooks/api/useReviews';
import { useCreateReservation } from '@/hooks/api/useReservations';

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
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // Rezervasyon hook'u
  const createReservationMutation = useCreateReservation();

  // Backend'den halı saha detayını çek
  const { data: apiResponse, isLoading: fieldLoading, isError: fieldError } = useQuery({
    queryKey: ['halisaha', id],
    queryFn: async () => {
      const res = await fetch(`http://192.168.1.33:5000/api/halisaha/${id}`);
      if (!res.ok) throw new Error('Halı saha bulunamadı');
      return res.json();
    },
    enabled: !!id, // id varsa sorguyu çalıştır
  });

  // Gerçek field ID'yi al - sadece backend'den veli geldiğinde
  const realFieldId = apiResponse?.data?.id;

  // Backend'den reviews çek - sadece field ID hazır olduğunda
  const { 
    reviews: fieldReviews, 
    rating: backendAverageRating, 
    reviewCount: backendReviewCount, 
    isLoading: reviewsLoading 
  } = useFieldReviews(realFieldId || ''); // Empty string yerine realFieldId kullan, ama fallback olarak empty string

  // Debug: Log review data
  console.log('🏟️ FieldDetail review data:');
  console.log('  - fieldId (URL):', id);
  console.log('  - realFieldId (backend):', realFieldId);
  console.log('  - fieldReviews:', fieldReviews);
  console.log('  - backendAverageRating:', backendAverageRating);
  console.log('  - backendReviewCount:', backendReviewCount);
  console.log('  - reviewsLoading:', reviewsLoading);
  console.log('  - fieldLoading:', fieldLoading);

  // Toplam loading state - hem field hem reviews hazır olana kadar loading göster
  const isLoading = fieldLoading || (realFieldId && reviewsLoading);

  // Backend'den gelen veriyi frontend formatına çevir
  const field = apiResponse?.data ? (() => {
    const backendField = apiResponse.data;
    
    // Backend'den gelen gerçek rating ve review count kullan
    const rating = backendAverageRating > 0 ? backendAverageRating : 0; // Fallback rating
    const reviewCount = backendReviewCount > 0 ? backendReviewCount : 0;
    
    // Amenities'i backend verilerine göre oluştur
    const amenities = [
      { name: "Işıklı Saha", icon: Lightbulb, available: backendField.hasNightLighting },
      { name: "Ücretsiz Park", icon: Car, available: backendField.hasParking },
      { name: "Ayakkabı Kiralama", icon: Shirt, available: backendField.hasShoeRental },
      { name: "WiFi", icon: Wifi, available: backendField.hasWifi || false },
      { name: "Kafeterya", icon: Coffee, available: backendField.hasCafeteria },
      { name: "Güvenlik Kamerası", icon: Camera, available: backendField.hasSecurity || false },
      { name: "Soyunma Odası", icon: Users, available: backendField.hasShowers },
      { name: "24/7 Güvenlik", icon: Shield, available: backendField.has24Security || false }
    ];

    console.log('🆔 Field ID comparison:');
    console.log('  - URL ID:', id);
    console.log('  - Backend ID:', backendField.id);
    console.log('  - IDs match:', id === backendField.id);

    return {
      id: backendField.id, // Backend'den gelen gerçek ID kullan
      name: backendField.name,
      location: backendField.location,
      rating: rating,
      reviewCount: reviewCount,
      pricePerHour: backendField.pricePerHour,
      images: backendField.imagesUrl?.length > 0 ? backendField.imagesUrl : [
        '/field-1.svg',
        '/field-2.svg',
        '/field-3.svg',
        '/field-4.svg'
      ], // Backend'den gelen tüm resimleri kullan
      amenities: amenities,
      description: backendField.description || "Modern tesisleri ve geniş alanı ile futbol tutkunlarının tercihi olan halı sahamız, profesyonel kalitede zemin ve tam donanımlı tesisleri ile unutulmaz maçlar yaşamanızı sağlar.",
      phone: backendField.phone,
      workingHours: `${backendField.startHour} - ${backendField.endHour}`,
      capacity: `${backendField.maxPlayers} kişi - ${backendField.size} - ${backendField.surface}`
    };
  })() : null;

  const timeSlots = [
    "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00",
    "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"
  ];

  // Backend'den gelen booked slots (şimdilik boş, ileride API'den çekilecek)
  const bookedSlots = apiResponse?.data?.bookedSlots || [];

  const handleBooking = async () => {
    if (!user) {
      toast.error("Rezervasyon yapmak için giriş yapmalısınız!");
      return;
    }
    
    if (!selectedDate || !selectedTime) {
      toast.error("Lütfen tarih ve saat seçiniz!");
      return;
    }
    
    if (!field) {
      toast.error("Saha bilgileri yüklenemedi!");
      return;
    }

    try {
      // Tarih ve saati ISO string formatına çevir
      const [hours, minutes] = selectedTime.split(':');
      const reservationDateTime = new Date(selectedDate);
      reservationDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const reservationData = {
        userId: user.id,
        haliSahaId: field.id.toString(),
        status: 'pending' as const,
        reservationDateTime: reservationDateTime.toISOString(),
        isRecurring: false
      };

      console.log('🚀 Creating reservation:', reservationData);

      await createReservationMutation.mutateAsync(reservationData);
      
      toast.success(`Rezervasyon başarıyla oluşturuldu!\nTarih: ${selectedDate.toLocaleDateString('tr-TR')}\nSaat: ${selectedTime}\nSaha: ${field.name}`);
      
      // Formu temizle
      setSelectedDate(undefined);
      setSelectedTime('');
      
    } catch (error: any) {
      console.error('❌ Reservation creation failed:', error);
      toast.error(error.message || "Rezervasyon oluşturulurken bir hata oluştu!");
    }
  };

  const handleFavorite = () => {
    if (!user) {
      toast.error("Favorilere eklemek için giriş yapmalısınız!");
      return;
    }
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "Favorilerden çıkarıldı" : "Favorilere eklendi");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <Header 
          user={user} 
          onLoginClick={() => setShowLogin(true)}
          onRegisterClick={() => setShowRegister(true)}
          onLogout={() => setUser(null)}
        />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-xl text-gray-600">Halı saha bilgileri yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (fieldError || !field) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <Header 
          user={user} 
          onLoginClick={() => setShowLogin(true)}
          onRegisterClick={() => setShowRegister(true)}
          onLogout={() => setUser(null)}
        />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">😞</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Halı saha bulunamadı</h2>
            <p className="text-gray-600 mb-6">Aradığınız halı saha mevcut değil veya kaldırılmış olabilir.</p>
            <Button 
              onClick={() => navigate('/fields')}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              Tüm Sahalara Dön
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <Header 
        user={user} 
        onLoginClick={() => setShowLogin(true)}
        onRegisterClick={() => setShowRegister(true)}
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
                  {field.amenities.filter(amenity => amenity.available).map((amenity, index) => (
                    <div key={index} className="group flex items-center gap-3 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100 hover:shadow-lg transition-all duration-300 hover:scale-105">
                      <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg group-hover:scale-110 transition-transform duration-300">
                        <amenity.icon className="h-5 w-5 text-white" />
                      </div>
                      <span className="font-medium text-gray-800">{amenity.name}</span>
                    </div>
                  ))}
                </div>
                {field.amenities.filter(amenity => amenity.available).length === 0 && (
                  <p className="text-gray-500 text-center py-8">Bu sahada özel hizmet bulunmamaktadır.</p>
                )}
              </CardContent>
            </Card>

            {/* Enhanced Reviews Section */}
            <ReviewSection
              fieldId={field.id} // Backend'den gelen gerçek ID kullan
              fieldName={field.name}
              rating={field.rating}
              totalReviews={field.reviewCount}
              reviews={fieldReviews}
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
                      <Button 
                        size="sm" 
                        onClick={() => setShowLogin(true)}
                        className="bg-orange-500 hover:bg-orange-600"
                      >
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
                    disabled={!selectedDate || !selectedTime || !user || createReservationMutation.isPending}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {createReservationMutation.isPending 
                      ? "Rezervasyon Yapılıyor..." 
                      : !user 
                        ? "Giriş Yapın" 
                        : "Rezervasyon Yap"
                    }
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

      {/* Login Modal */}
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSwitchToRegister={() => {
          setShowLogin(false);
          setShowRegister(true);
        }}
        onLogin={setUser}
      />

      {/* Register Modal */}
      <RegisterModal
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        onSwitchToLogin={() => {
          setShowRegister(false);
          setShowLogin(true);
        }}
        onRegister={setUser}
      />
    </div>
  );
};

export default FieldDetail;
