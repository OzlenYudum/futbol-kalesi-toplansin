
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Filter, Star, Lightbulb, Car, Shirt, Wifi, Coffee, Camera, Users } from 'lucide-react';
import Header from '@/components/Header';
import FieldCard from '@/components/FieldCard';

const Fields = () => {
  const [user, setUser] = useState(null);
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
      }
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
      }
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
      }
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
      }
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
      }
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
      }
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
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Header 
        user={user} 
        onLoginClick={() => {}}
        onRegisterClick={() => {}}
        onLogout={() => setUser(null)}
      />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Halı Sahalar
            </span>
          </h1>
          <p className="text-lg text-gray-600">İstanbul'un en iyi halı sahalarını keşfet</p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input 
                  placeholder="Saha adı veya konum ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12"
                />
              </div>
            </div>

            {/* Location Filters */}
            <div>
              <Select value={filters.city} onValueChange={(value) => setFilters(prev => ({ ...prev, city: value }))}>
                <SelectTrigger className="h-12">
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
                <SelectTrigger className="h-12">
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

          {/* Advanced Filters */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-4 mb-4">
              <Filter className="h-5 w-5 text-gray-500" />
              <span className="font-medium text-gray-700">Gelişmiş Filtreler</span>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Select value={filters.priceRange} onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value }))}>
                  <SelectTrigger>
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
                  <SelectTrigger>
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

            {/* Feature Toggles */}
            <div className="mt-4">
              <div className="flex flex-wrap gap-3">
                <Button
                  variant={filters.lighting ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleFilter('lighting')}
                  className={filters.lighting ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  <Lightbulb className="mr-2 h-4 w-4" />
                  Işıklı Saha
                </Button>
                <Button
                  variant={filters.shoeRental ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleFilter('shoeRental')}
                  className={filters.shoeRental ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  <Shirt className="mr-2 h-4 w-4" />
                  Ayakkabı Kiralama
                </Button>
                <Button
                  variant={filters.parking ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleFilter('parking')}
                  className={filters.parking ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  <Car className="mr-2 h-4 w-4" />
                  Ücretsiz Park
                </Button>
                <Button
                  variant={filters.wifi ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleFilter('wifi')}
                  className={filters.wifi ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  <Wifi className="mr-2 h-4 w-4" />
                  WiFi
                </Button>
                <Button
                  variant={filters.cafeteria ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleFilter('cafeteria')}
                  className={filters.cafeteria ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  <Coffee className="mr-2 h-4 w-4" />
                  Kafeterya
                </Button>
                <Button
                  variant={filters.locker ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleFilter('locker')}
                  className={filters.locker ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Soyunma Odası
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              {filteredFields.length} saha bulundu
            </h2>
            <Select defaultValue="rating">
              <SelectTrigger className="w-48">
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

        {/* Fields Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFields.map((field) => (
            <FieldCard key={field.id} field={field} />
          ))}
        </div>

        {filteredFields.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="mx-auto h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aradığınız kriterlere uygun saha bulunamadı</h3>
            <p className="text-gray-600">Filtreleri değiştirerek tekrar deneyin</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Fields;
