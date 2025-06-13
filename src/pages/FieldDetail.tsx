
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, MapPin, Clock, Users, Wifi, Car, Lightbulb, Coffee, Shirt, Camera, Phone, Shield, ArrowLeft, Heart, Share2 } from 'lucide-react';
import Header from '@/components/Header';

const FieldDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
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
    capacity: "10v10, 7v7, 5v5",
    reviews: [
      {
        id: 1,
        user: "Mehmet Yılmaz",
        rating: 5,
        comment: "Harika bir saha! Zemin kalitesi mükemmel ve tesisler çok temiz. Kesinlikle tavsiye ederim.",
        date: "2024-01-15",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
      },
      {
        id: 2,
        user: "Ayşe Kara",
        rating: 4,
        comment: "Çok güzel bir kompleks. Park sorunu yok ve personel çok ilgili. Sadece kafeterya biraz pahalı.",
        date: "2024-01-10",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=40&h=40&fit=crop&crop=face"
      },
      {
        id: 3,
        user: "Can Demir",
        rating: 5,
        comment: "Arkadaşlarımla düzenli olarak geliyoruz. Rezervasyon sistemi çok kolay ve saha her zaman temiz.",
        date: "2024-01-05",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
      }
    ]
  };

  const timeSlots = [
    "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00",
    "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"
  ];

  const bookedSlots = ["14:00", "18:00", "20:00"]; // Mock booked slots

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) {
      alert("Lütfen tarih ve saat seçiniz!");
      return;
    }
    alert(`Rezervasyon yapıldı!\nTarih: ${selectedDate.toLocaleDateString('tr-TR')}\nSaat: ${selectedTime}\nSaha: ${field.name}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Header 
        user={user} 
        onLoginClick={() => {}}
        onRegisterClick={() => {}}
        onLogout={() => setUser(null)}
      />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/fields')}
            className="flex items-center gap-2 text-gray-600 hover:text-green-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Sahalara Dön
          </Button>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFavorite(!isFavorite)}
              className={isFavorite ? "text-red-500 hover:text-red-600" : "text-gray-400 hover:text-red-500"}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-green-600">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="relative">
              <div className="grid grid-cols-4 gap-2 h-96">
                <div className="col-span-2 row-span-2">
                  <img 
                    src={field.images[0]} 
                    alt={field.name}
                    className="w-full h-full object-cover rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
                  />
                </div>
                <div className="col-span-2 grid grid-cols-2 gap-2">
                  {field.images.slice(1).map((image, index) => (
                    <img 
                      key={index}
                      src={image} 
                      alt={`${field.name} ${index + 2}`}
                      className="w-full h-full object-cover rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
                    />
                  ))}
                </div>
              </div>
              <Badge className="absolute top-4 left-4 bg-green-600 text-white">
                ₺{field.pricePerHour}/saat
              </Badge>
            </div>

            {/* Field Info */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{field.name}</h1>
                  <div className="flex items-center gap-4 text-gray-600 mb-2">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{field.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      <span>{field.phone}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{field.workingHours}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{field.capacity}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 mb-1">
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    <span className="text-xl font-semibold">{field.rating}</span>
                  </div>
                  <span className="text-gray-500">({field.reviewCount} yorum)</span>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed">{field.description}</p>
            </div>

            {/* Amenities */}
            <Card>
              <CardHeader>
                <CardTitle>Özellikler ve Hizmetler</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {field.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                      <amenity.icon className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium">{amenity.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Yorumlar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {field.reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                      <div className="flex items-start gap-3">
                        <img 
                          src={review.avatar} 
                          alt={review.user}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{review.user}</span>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-4 w-4 ${i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                                />
                              ))}
                            </div>
                            <span className="text-gray-500 text-sm">{new Date(review.date).toLocaleDateString('tr-TR')}</span>
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Rezervasyon Yap</span>
                  <span className="text-green-600 font-bold">₺{field.pricePerHour}/saat</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2">Tarih Seçin</label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    className="rounded-md border"
                  />
                </div>

                {/* Time Selection */}
                {selectedDate && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Saat Seçin</label>
                    <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
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
                                ? "bg-green-600 hover:bg-green-700" 
                                : isBooked 
                                  ? "opacity-50 cursor-not-allowed" 
                                  : "hover:bg-green-50"
                            }`}
                          >
                            {time}
                          </Button>
                        );
                      })}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Kırmızı renkli saatler dolu
                    </p>
                  </div>
                )}

                {/* Booking Summary */}
                {selectedDate && selectedTime && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Rezervasyon Özeti</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Tarih:</span>
                        <span>{selectedDate.toLocaleDateString('tr-TR')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Saat:</span>
                        <span>{selectedTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Süre:</span>
                        <span>1 saat</span>
                      </div>
                      <div className="flex justify-between font-medium border-t pt-2 mt-2">
                        <span>Toplam:</span>
                        <span>₺{field.pricePerHour}</span>
                      </div>
                    </div>
                  </div>
                )}

                <Button 
                  onClick={handleBooking}
                  disabled={!selectedDate || !selectedTime}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                >
                  Rezervasyon Yap
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  Rezervasyonunuz onaylandıktan sonra SMS ile bilgilendirileceksiniz.
                </p>
              </CardContent>
            </Card>

            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle>Hızlı Bilgiler</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Minimum rezervasyon:</span>
                  <span className="font-medium">1 saat</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">İptal politikası:</span>
                  <span className="font-medium">2 saat öncesine kadar</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Ödeme:</span>
                  <span className="font-medium">Nakit/Kart</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Yaş sınırı:</span>
                  <span className="font-medium">16+</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldDetail;
