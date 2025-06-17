import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Filter, Star, Lightbulb, Car, Shirt, Wifi, Coffee, Camera, Users, Zap, Clock, Heart, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import Header from '@/components/Header';
import FieldCard from '@/components/FieldCard';
import { useQuery } from '@tanstack/react-query';
import { HaliSaha } from '@/types';
import { transformBackendFieldsToCards } from '@/utils/fieldTransformers';
import { normalizeText, compareTextsNormalized, matchesSearchTerm } from '@/utils/textUtils';
import { CITY_DISTRICTS, CITIES, API_BASE_URL } from '@/constants';
import LoginModal from '@/components/LoginModal';
import RegisterModal from '@/components/RegisterModal';

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
  const [sortBy, setSortBy] = useState('rating');
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // Seçilen şehre göre ilçeleri getir
  const getDistrictsForCity = (city: string) => {
    return CITY_DISTRICTS[city as keyof typeof CITY_DISTRICTS] || [];
  };

  // Backend'den tüm halı sahaları çek
  const { data: apiResponse, isLoading, isError } = useQuery({
    queryKey: ['halisahalar'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/halisaha/`);
      if (!res.ok) throw new Error('Halı sahalar yüklenemedi');
      const apiResponse = await res.json();
      
      console.log('🏟️ Backend response:', apiResponse);
      console.log('🏟️ Backend response.data:', apiResponse.data);
      
      // Gelen ham veriyi merkezi transformer ile dönüştür
      const transformedData = transformBackendFieldsToCards(apiResponse.data as HaliSaha[]);
      console.log('🏟️ Transformed data:', transformedData);
      
      return transformedData;
    },
  });
  
  console.log('🏟️ Query result apiResponse:', apiResponse);
  console.log('🏟️ apiResponse type:', typeof apiResponse);
  console.log('🏟️ apiResponse is Array:', Array.isArray(apiResponse));
  
  // Backend'den gelen veriyi frontend formatına çevir - güvenli null check ile
  const allFields = Array.isArray(apiResponse) ? apiResponse : [];
  
  console.log('🏟️ allFields:', allFields);
  console.log('🏟️ allFields length:', allFields.length);

  const featuredFields = allFields; // Artık tüm sahalar backend'den geliyor ve dönüştürülmüş

  console.log('🏟️ featuredFields:', featuredFields);
  console.log('🏟️ featuredFields type:', typeof featuredFields);
  console.log('🏟️ featuredFields is Array:', Array.isArray(featuredFields));

  // Güvenli filtreleme - data yoksa boş array kullan ve ekstra array kontrolü
  const filteredFields = Array.isArray(featuredFields) ? featuredFields.filter(field => {
    // Güvenlik kontrolü - field ve gerekli alanlar var mı?
    if (!field || !field.name || !field.location) {
      console.warn('⚠️ Invalid field data:', field);
      return false;
    }

    // Arama terimi eşleştirmesi - Türkçe karakter desteği ile
    const matchesSearch = matchesSearchTerm(field.name, searchTerm) ||
                         matchesSearchTerm(field.location, searchTerm);
    
    // Şehir eşleştirmesi - hem value hem label ile kontrol et
    let matchesCity = true;
    if (filters.city) {
      const selectedCity = CITIES.find(city => city.value === filters.city);
      const cityLabel = selectedCity?.label || filters.city;
      
      matchesCity = compareTextsNormalized(field.location, filters.city) || 
                   compareTextsNormalized(field.location, cityLabel);
    }
    
    // İlçe eşleştirmesi - hem value hem label ile kontrol et
    let matchesDistrict = true;
    if (filters.district) {
      const districts = getDistrictsForCity(filters.city);
      const selectedDistrict = districts.find(district => district.value === filters.district);
      const districtLabel = selectedDistrict?.label || filters.district;
      
      matchesDistrict = compareTextsNormalized(field.location, filters.district) || 
                       compareTextsNormalized(field.location, districtLabel);
    }
    
    // Features güvenlik kontrolü
    const fieldFeatures = field.features || {} as any;
    const matchesLighting = !filters.lighting || fieldFeatures.lighting;
    const matchesShoeRental = !filters.shoeRental || fieldFeatures.shoeRental;
    const matchesParking = !filters.parking || fieldFeatures.parking;
    const matchesWifi = !filters.wifi || fieldFeatures.wifi;
    const matchesCafeteria = !filters.cafeteria || fieldFeatures.cafeteria;
    const matchesLocker = !filters.locker || fieldFeatures.locker;
    
    let matchesPrice = true;
    const pricePerHour = field.pricePerHour || 0;
    if (filters.priceRange === 'low') matchesPrice = pricePerHour < 200;
    else if (filters.priceRange === 'medium') matchesPrice = pricePerHour >= 200 && pricePerHour < 280;
    else if (filters.priceRange === 'high') matchesPrice = pricePerHour >= 280;
    
    let matchesRating = true;
    const rating = field.rating || 0;
    if (filters.rating === '4+') matchesRating = rating >= 4.0;
    else if (filters.rating === '4.5+') matchesRating = rating >= 4.5;
    else if (filters.rating === '4.8+') matchesRating = rating >= 4.8;

    return matchesSearch && matchesCity && matchesDistrict && matchesLighting && matchesShoeRental && 
           matchesParking && matchesWifi && matchesCafeteria && matchesLocker && matchesPrice && matchesRating;
  }).sort((a, b) => {
    // Null check ile güvenli sorting
    const aPrice = a?.pricePerHour || 0;
    const bPrice = b?.pricePerHour || 0;
    const aRating = a?.rating || 0;
    const bRating = b?.rating || 0;
    const aReviewCount = a?.reviewCount || 0;
    const bReviewCount = b?.reviewCount || 0;

    switch (sortBy) {
      case 'price-low':
        return aPrice - bPrice;
      case 'price-high':
        return bPrice - aPrice;
      case 'reviews':
        return bReviewCount - aReviewCount;
      case 'rating':
      default:
        return bRating - aRating;
    }
  }) : [];

  const toggleFilter = (filterName: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName as keyof typeof prev]
    }));
  };

  const clearAllFilters = () => {
    setFilters({
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
    setSearchTerm('');
    setSortBy('rating');
    toast({
      title: "Filtreler Temizlendi",
      description: "Tüm filtreler başarıyla temizlendi.",
    });
  };

  const handleFieldClick = (fieldId: string | number) => {
    navigate(`/field/${fieldId}`);
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
            <p className="text-xl text-gray-600">Halı sahalar yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
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
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Halı sahalar yüklenemedi</h2>
            <p className="text-gray-600 mb-6">Bir hata oluştu. Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.</p>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              Sayfayı Yenile
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
        {/* Enhanced Header Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Premium Halı Sahalar
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-6">İstanbul'un en kaliteli halı sahalarını keşfet ve hemen rezervasyon yap</p>
          <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: '100ms' }}>
              <Zap className="h-4 w-4 text-green-500" />
              <span>Anında Rezervasyon</span>
            </div>
            <div className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: '200ms' }}>
              <Star className="h-4 w-4 text-yellow-500" />
              <span>Doğrulanmış Yorumlar</span>
            </div>
            <div className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: '300ms' }}>
              <Clock className="h-4 w-4 text-blue-500" />
              <span>7/24 Destek</span>
            </div>
          </div>
        </div>

        {/* Enhanced Search and Filter Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-8 border border-white/50 animate-fade-in">
          <div className="grid lg:grid-cols-4 gap-6 mb-8">
            {/* Enhanced Search */}
            <div className="lg:col-span-2">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-hover:text-green-500 transition-colors" />
                <Input 
                  placeholder="Saha adı, konum veya özellik ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-14 text-lg border-2 border-gray-200 focus:border-green-500 rounded-xl bg-white/70 backdrop-blur-sm transition-all focus:scale-105"
                />
              </div>
            </div>

            {/* Location Filters */}
            <div>
              <Select 
                value={filters.city} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, city: value, district: '' }))}
              >
                <SelectTrigger className="h-14 text-lg border-2 border-gray-200 focus:border-green-500 rounded-xl bg-white/70 transition-all hover:scale-105">
                  <SelectValue placeholder="Şehir seçin" />
                </SelectTrigger>
                <SelectContent className="bg-white shadow-lg border rounded-lg z-50">
                  {CITIES.map((city) => (
                    <SelectItem key={city.value} value={city.value}>
                      {city.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select 
                value={filters.district} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, district: value }))}
                disabled={!filters.city}
              >
                <SelectTrigger className={`h-14 text-lg border-2 border-gray-200 focus:border-green-500 rounded-xl bg-white/70 transition-all hover:scale-105 ${!filters.city ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <SelectValue placeholder={filters.city ? "İlçe seçin" : "Önce şehir seçin"} />
                </SelectTrigger>
                <SelectContent className="bg-white shadow-lg border rounded-lg z-50">
                  {getDistrictsForCity(filters.city).map((district) => (
                    <SelectItem key={district.value} value={district.value}>
                      {district.label}
                    </SelectItem>
                  ))}
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
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="ml-auto text-gray-600 hover:text-red-600 hover:border-red-300 transition-all"
              >
                Filtreleri Temizle
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <Select value={filters.priceRange} onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value }))}>
                  <SelectTrigger className="border-2 border-gray-200 focus:border-green-500 rounded-lg transition-all hover:scale-105">
                    <SelectValue placeholder="Fiyat Aralığı" />
                  </SelectTrigger>
                  <SelectContent className="bg-white shadow-lg border rounded-lg z-50">
                    <SelectItem value="low">₺100 - ₺200</SelectItem>
                    <SelectItem value="medium">₺200 - ₺280</SelectItem>
                    <SelectItem value="high">₺280+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select value={filters.rating} onValueChange={(value) => setFilters(prev => ({ ...prev, rating: value }))}>
                  <SelectTrigger className="border-2 border-gray-200 focus:border-green-500 rounded-lg transition-all hover:scale-105">
                    <SelectValue placeholder="Minimum Puan" />
                  </SelectTrigger>
                  <SelectContent className="bg-white shadow-lg border rounded-lg z-50">
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
              ].map(({ key, icon: Icon, label }, index) => (
                <Button
                  key={key}
                  variant={filters[key as keyof typeof filters] ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleFilter(key)}
                  className={`${
                    filters[key as keyof typeof filters] 
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700" 
                      : "hover:bg-green-50 hover:border-green-300"
                  } transition-all duration-200 px-4 py-2 animate-fade-in hover:scale-105`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Results Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex justify-between items-center bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-1">
                {filteredFields.length} premium saha bulundu
              </h2>
              <p className="text-gray-600">Size en uygun sahayı seçin ve rezervasyon yapın</p>
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48 border-2 border-gray-200 focus:border-green-500 transition-all hover:scale-105">
                <SelectValue placeholder="Sırala" />
              </SelectTrigger>
              <SelectContent className="bg-white shadow-lg border rounded-lg z-50">
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
          {filteredFields.map((field, index) => (
            <div 
              key={field.id} 
              className="animate-fade-in cursor-pointer group"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => handleFieldClick(field.id)}
            >
              <FieldCard field={field} />
            </div>
          ))}
        </div>

        {filteredFields.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl">
              <div className="text-gray-400 mb-6">
                <Search className="mx-auto h-16 w-16" />
              </div>
              <h3 className="text-2xl font-medium text-gray-900 mb-4">Aradığınız kriterlere uygun saha bulunamadı</h3>
              <p className="text-gray-600 mb-6">Filtreleri değiştirerek tekrar deneyin veya farklı kriterler kullanın</p>
              <Button 
                onClick={clearAllFilters}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all hover:scale-105"
              >
                Filtreleri Temizle
              </Button>
            </div>
          </div>
        )}
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

export default Fields;
