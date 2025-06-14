
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Filter, Star, Lightbulb, Car, Shirt, Wifi, Coffee, Camera, Users, Zap, Clock } from 'lucide-react';
import Header from '@/components/Header';
import FieldCard from '@/components/FieldCard';

interface FieldsProps {
  user: any;
  setUser: (user: any) => void;
}

const Fields = ({ user, setUser }: FieldsProps) => {
  const [filters, setFilters] = useState({
    city: '',
    district: '',
    priceRange: '',
    lighting: false,
    shoeRental: false,
    parking: false,
    wifi: false,
    cafeteria: false,
    locker: false,
    rating: ''
  });

  const [searchTerm, setSearchTerm] = useState('');

  const featuredFields = [
    {
      id: 1,
      name: "Yeşilköy Spor Kompleksi",
      location: "Yeşilköy, İstanbul",
      rating: 4.8,
      reviewCount: 124,
      pricePerHour: 250,
      image: "https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=400",
      amenities: ["Işıklı Saha", "Ücretsiz Park", "Ayakkabı Kiralama", "Soyunma Odası", "Duş", "Kafeterya"],
      features: {
        lighting: true,
        shoeRental: true,
        parking: true,
        wifi: true,
        cafeteria: true,
        locker: true
      },
      premium: true,
      availability: "Bugün 5 slot boş"
    },
    {
      id: 2,
      name: "Merkez Halı Saha",
      location: "Şişli, İstanbul",
      rating: 4.6,
      reviewCount: 89,
      pricePerHour: 200,
      image: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=400",
      amenities: ["Ücretsiz Park", "Soyunma Odası", "Duş", "WiFi"],
      features: {
        lighting: false,
        shoeRental: false,
        parking: true,
        wifi: true,
        cafeteria: false,
        locker: true
      },
      premium: false,
      availability: "Bugün 8 slot boş"
    },
    {
      id: 3,
      name: "Boğaziçi Sports Club",
      location: "Beşiktaş, İstanbul",
      rating: 4.9,
      reviewCount: 156,
      pricePerHour: 300,
      image: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=400",
      amenities: ["Işıklı Saha", "Ücretsiz Park", "Ayakkabı Kiralama", "Soyunma Odası", "Duş", "Kafeterya", "Lounge", "Güvenlik Kamerası"],
      features: {
        lighting: true,
        shoeRental: true,
        parking: true,
        wifi: true,
        cafeteria: true,
        locker: true
      },
      premium: true,
      availability: "Bugün 3 slot boş"
    },
    {
      id: 4,
      name: "Kadıköy Futbol Sahası",
      location: "Kadıköy, İstanbul",
      rating: 4.4,
      reviewCount: 78,
      pricePerHour: 180,
      image: "https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=400",
      amenities: ["Soyunma Odası", "Duş", "WiFi"],
      features: {
        lighting: false,
        shoeRental: false,
        parking: false,
        wifi: true,
        cafeteria: false,
        locker: true
      },
      premium: false,
      availability: "Bugün 12 slot boş"
    },
    {
      id: 5,
      name: "Ataşehir Premium Saha",
      location: "Ataşehir, İstanbul",
      rating: 4.7,
      reviewCount: 203,
      pricePerHour: 280,
      image: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=400",
      amenities: ["Işıklı Saha", "Ücretsiz Park", "Ayakkabı Kiralama", "Soyunma Odası", "Duş", "Kafeterya", "WiFi"],
      features: {
        lighting: true,
        shoeRental: true,
        parking: true,
        wifi: true,
        cafeteria: true,
        locker: true
      },
      premium: true,
      availability: "Bugün 7 slot boş"
    },
    {
      id: 6,
      name: "Üsküdar Halı Saha",
      location: "Üsküdar, İstanbul",
      rating: 4.3,
      reviewCount: 67,
      pricePerHour: 160,
      image: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=400",
      amenities: ["Soyunma Odası", "Duş"],
      features: {
        lighting: false,
        shoeRental: false,
        parking: false,
        wifi: false,
        cafeteria: false,
        locker: true
      },
      premium: false,
      availability: "Bugün 15 slot boş"
    }
  ];

  const filteredFields = featuredFields.filter(field => {
    const matchesSearch = field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         field.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLighting = !filters.lighting || field.features.lighting;
    const matchesShoeRental = !filters.shoeRental || field.features.shoeRental;
    const matchesParking = !filters.parking || field.features.parking;
    const matchesWifi = !filters.wifi || field.features.wifi;
    const matchesCafeteria = !filters.cafeteria || field.features.cafeteria;
    const matchesLocker = !filters.locker || field.features.locker;
    
    let matchesPrice = true;
    if (filters.priceRange === 'low') matchesPrice = field.pricePerHour < 200;
    else if (filters.priceRange === 'medium') matchesPrice = field.pricePerHour >= 200 && field.pricePerHour < 280;
    else if (filters.priceRange === 'high') matchesPrice = field.pricePerHour >= 280;
    
    let matchesRating = true;
    if (filters.rating === '4+') matchesRating = field.rating >= 4.0;
    else if (filters.rating === '4.5+') matchesRating = field.rating >= 4.5;
    else if (filters.rating === '4.8+') matchesRating = field.rating >= 4.8;

    return matchesSearch && matchesLighting && matchesShoeRental && matchesParking && 
           matchesWifi && matchesCafeteria && matchesLocker && matchesPrice && matchesRating;
  });

  const toggleFilter = (filterName: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName as keyof typeof prev]
    }));
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
        {/* Enhanced Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Premium Halı Sahalar
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-6">İstanbul'un en kaliteli halı sahalarını keşfet ve hemen rezervasyon yap</p>
          <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-green-500" />
              <span>Anında Rezervasyon</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>Doğrulanmış Yorumlar</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span>7/24 Destek</span>
            </div>
          </div>
        </div>

        {/* Enhanced Search and Filter Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-8 border border-white/50">
          <div className="grid lg:grid-cols-4 gap-6 mb-8">
            {/* Enhanced Search */}
            <div className="lg:col-span-2">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-hover:text-green-500 transition-colors" />
                <Input 
                  placeholder="Saha adı, konum veya özellik ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-14 text-lg border-2 border-gray-200 focus:border-green-500 rounded-xl bg-white/70 backdrop-blur-sm"
                />
              </div>
            </div>

            {/* Location Filters */}
            <div>
              <Select value={filters.city} onValueChange={(value) => setFilters(prev => ({ ...prev, city: value }))}>
                <SelectTrigger className="h-14 text-lg border-2 border-gray-200 focus:border-green-500 rounded-xl bg-white/70">
                  <SelectValue placeholder="Şehir seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="istanbul">İstanbul</SelectItem>
                  <SelectItem value="ankara">Ankara</SelectItem>
                  <SelectItem value="izmir">İzmir</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={filters.district} onValueChange={(value) => setFilters(prev => ({ ...prev, district: value }))}>
                <SelectTrigger className="h-14 text-lg border-2 border-gray-200 focus:border-green-500 rounded-xl bg-white/70">
                  <SelectValue placeholder="İlçe seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="besiktas">Beşiktaş</SelectItem>
                  <SelectItem value="sisli">Şişli</SelectItem>
                  <SelectItem value="kadikoy">Kadıköy</SelectItem>
                  <SelectItem value="atasehir">Ataşehir</SelectItem>
                  <SelectItem value="uskudar">Üsküdar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Enhanced Advanced Filters */}
          <div className="pt-6 border-t border-gray-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-gray-700 text-lg">Gelişmiş Filtreler</span>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <Select value={filters.priceRange} onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value }))}>
                  <SelectTrigger className="border-2 border-gray-200 focus:border-green-500 rounded-lg">
                    <SelectValue placeholder="Fiyat Aralığı" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">₺100 - ₺200</SelectItem>
                    <SelectItem value="medium">₺200 - ₺280</SelectItem>
                    <SelectItem value="high">₺280+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select value={filters.rating} onValueChange={(value) => setFilters(prev => ({ ...prev, rating: value }))}>
                  <SelectTrigger className="border-2 border-gray-200 focus:border-green-500 rounded-lg">
                    <SelectValue placeholder="Minimum Puan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4+">4.0+ ⭐</SelectItem>
                    <SelectItem value="4.5+">4.5+ ⭐</SelectItem>
                    <SelectItem value="4.8+">4.8+ ⭐</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Enhanced Feature Toggles */}
            <div className="flex flex-wrap gap-3">
              {[
                { key: 'lighting', icon: Lightbulb, label: 'Işıklı Saha' },
                { key: 'shoeRental', icon: Shirt, label: 'Ayakkabı Kiralama' },
                { key: 'parking', icon: Car, label: 'Ücretsiz Park' },
                { key: 'wifi', icon: Wifi, label: 'WiFi' },
                { key: 'cafeteria', icon: Coffee, label: 'Kafeterya' },
                { key: 'locker', icon: Users, label: 'Soyunma Odası' }
              ].map(({ key, icon: Icon, label }) => (
                <Button
                  key={key}
                  variant={filters[key as keyof typeof filters] ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleFilter(key)}
                  className={`${
                    filters[key as keyof typeof filters] 
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700" 
                      : "hover:bg-green-50 hover:border-green-300"
                  } transition-all duration-200 px-4 py-2`}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Results Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-1">
                {filteredFields.length} premium saha bulundu
              </h2>
              <p className="text-gray-600">Size en uygun sahayı seçin ve rezervasyon yapın</p>
            </div>
            <Select defaultValue="rating">
              <SelectTrigger className="w-48 border-2 border-gray-200 focus:border-green-500">
                <SelectValue placeholder="Sırala" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">En Yüksek Puan</SelectItem>
                <SelectItem value="price-low">En Düşük Fiyat</SelectItem>
                <SelectItem value="price-high">En Yüksek Fiyat</SelectItem>
                <SelectItem value="reviews">En Çok Yorum</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Enhanced Fields Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredFields.map((field) => (
            <FieldCard key={field.id} field={field} />
          ))}
        </div>

        {filteredFields.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl">
              <div className="text-gray-400 mb-6">
                <Search className="mx-auto h-16 w-16" />
              </div>
              <h3 className="text-2xl font-medium text-gray-900 mb-4">Aradığınız kriterlere uygun saha bulunamadı</h3>
              <p className="text-gray-600 mb-6">Filtreleri değiştirerek tekrar deneyin veya farklı kriterler kullanın</p>
              <Button 
                onClick={() => setFilters({
                  city: '',
                  district: '',
                  priceRange: '',
                  lighting: false,
                  shoeRental: false,
                  parking: false,
                  wifi: false,
                  cafeteria: false,
                  locker: false,
                  rating: ''
                })}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              >
                Filtreleri Temizle
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Fields;
