
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Star, MapPin, Clock, Users, Shield, Zap, Trophy, Download, X, Smartphone, Apple, Play, ChevronRight, TrendingUp } from 'lucide-react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FieldCard from '@/components/FieldCard';
import LoginModal from '@/components/LoginModal';
import RegisterModal from '@/components/RegisterModal';

const Index = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState(null);
  const [showAppBanner, setShowAppBanner] = useState(true);

  useEffect(() => {
    // Show app banner after 2 seconds for better UX
    const timer = setTimeout(() => {
      setShowAppBanner(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const featuredFields = [
    {
      id: 1,
      name: "Yeşilköy Spor Kompleksi",
      location: "Yeşilköy, İstanbul",
      rating: 4.8,
      reviewCount: 124,
      pricePerHour: 250,
      image: "https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=400",
      amenities: ["Ücretsiz Park", "Soyunma Odası", "Duş", "Kafeterya"]
    },
    {
      id: 2,
      name: "Merkez Halı Saha",
      location: "Şişli, İstanbul",
      rating: 4.6,
      reviewCount: 89,
      pricePerHour: 200,
      image: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=400",
      amenities: ["Ücretsiz Park", "Soyunma Odası", "Duş"]
    },
    {
      id: 3,
      name: "Boğaziçi Sports Club",
      location: "Beşiktaş, İstanbul",
      rating: 4.9,
      reviewCount: 156,
      pricePerHour: 300,
      image: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=400",
      amenities: ["Ücretsiz Park", "Soyunma Odası", "Duş", "Kafeterya", "Lounge"]
    }
  ];

  const features = [
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Anında Rezervasyon",
      description: "Birkaç tıkla sahayı rezerve et, onayını hemen al"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Güvenli Ödeme",
      description: "256-bit SSL şifrelemesi ile güvenli ödeme sistemi"
    },
    {
      icon: <Trophy className="h-8 w-8" />,
      title: "Kaliteli Sahalar",
      description: "Sadece kaliteli ve donanımlı halı sahalar platformumuzda"
    }
  ];

  const reviewStats = [
    { rating: 5, count: 2847, percentage: 68 },
    { rating: 4, count: 923, percentage: 22 },
    { rating: 3, count: 284, percentage: 7 },
    { rating: 2, count: 93, percentage: 2 },
    { rating: 1, count: 42, percentage: 1 }
  ];

  const stats = [
    { value: "500+", label: "Aktif Halı Saha", icon: <MapPin className="h-6 w-6" /> },
    { value: "10K+", label: "Mutlu Kullanıcı", icon: <Users className="h-6 w-6" /> },
    { value: "50K+", label: "Tamamlanan Rezervasyon", icon: <Trophy className="h-6 w-6" /> },
    { value: "4.8", label: "Ortalama Puan", icon: <Star className="h-6 w-6" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-gray-50">
      <Header 
        user={user} 
        onLoginClick={() => setShowLogin(true)}
        onRegisterClick={() => setShowRegister(true)}
        onLogout={() => setUser(null)}
      />
      
      {/* Mobile App Banner */}
      {showAppBanner && (
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-white/20 rounded-lg">
                <Smartphone className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold">Toplansın Mobil Uygulaması</p>
                <p className="text-sm opacity-90">Daha hızlı rezervasyon için indirin</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                size="sm" 
                variant="secondary"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <Apple className="h-4 w-4 mr-2" />
                iOS
              </Button>
              <Button 
                size="sm" 
                variant="secondary"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <Play className="h-4 w-4 mr-2" />
                Android
              </Button>
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => setShowAppBanner(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <Hero onGetStarted={() => setShowRegister(true)} />
      
      {/* Enhanced Stats Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="mx-auto w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-green-600 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Neden Toplansın?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Halı saha rezervasyonunu kolaylaştırıyoruz. Kaliteli sahalar, uygun fiyatlar ve hızlı rezervasyon.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center group hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews Section with Graphics */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Müşteri Değerlendirmeleri
            </h2>
            <p className="text-xl text-gray-600">
              Kullanıcılarımızın deneyimlerini keşfedin
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Review Stats */}
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-5xl font-bold text-green-600 mb-2">4.8</div>
                <div className="flex justify-center mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-6 w-6 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600">4,189 değerlendirme</p>
              </div>
              
              <div className="space-y-3">
                {reviewStats.map((stat) => (
                  <div key={stat.rating} className="flex items-center space-x-3">
                    <span className="w-8 text-sm font-medium">{stat.rating}</span>
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <div className="flex-1">
                      <Progress value={stat.percentage} className="h-2" />
                    </div>
                    <span className="w-12 text-sm text-gray-600">{stat.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sample Reviews */}
            <div className="space-y-4">
              {[
                {
                  name: "Ahmet K.",
                  rating: 5,
                  comment: "Harika bir platform! Sahayı çok kolay rezerve ettim.",
                  date: "2 gün önce"
                },
                {
                  name: "Mehmet S.",
                  rating: 4,
                  comment: "Kaliteli sahalar ve uygun fiyatlar. Tavsiye ederim.",
                  date: "1 hafta önce"
                },
                {
                  name: "Zeynep A.",
                  rating: 5,
                  comment: "Müşteri hizmetleri çok iyi. Sorunumu hemen çözdüler.",
                  date: "2 hafta önce"
                }
              ].map((review, index) => (
                <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                      {review.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{review.name}</h4>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                      <div className="flex items-center mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`h-4 w-4 ${star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <p className="text-gray-700 text-sm">{review.comment}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Fields Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Öne Çıkan Halı Sahalar
            </h2>
            <p className="text-xl text-gray-600">
              En popüler ve kaliteli halı sahaları keşfet
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {featuredFields.map((field) => (
              <FieldCard key={field.id} field={field} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-green-500 to-emerald-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Özel Fırsatları Kaçırma!
          </h2>
          <p className="text-xl mb-8 opacity-90">
            E-bültenimize abone ol, indirimlerden ve yeni sahalardan ilk sen haberdar ol.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="E-posta adresiniz"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <Button className="bg-white text-green-600 hover:bg-gray-100 px-6 py-3">
              Abone Ol
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-12 text-white">
            <h2 className="text-4xl font-bold mb-4">
              Hemen Sahaya Çık!
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Arkadaşlarınla unutulmaz maçlar için en iyi halı sahaları rezerve et.
            </p>
            <Button 
              size="lg" 
              className="bg-white text-green-600 hover:bg-gray-100 text-lg px-8 py-3"
              onClick={() => setShowRegister(true)}
            >
              Ücretsiz Kayıt Ol
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Toplansın</h3>
              <p className="text-gray-400 mb-4">
                Türkiye'nin en büyük halı saha rezervasyon platformu
              </p>
              <div className="flex space-x-4">
                <Button size="sm" variant="outline" className="border-gray-600 text-gray-400 hover:text-white">
                  <Apple className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" className="border-gray-600 text-gray-400 hover:text-white">
                  <Play className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Sahalar</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Rezervasyon</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Mobil Uygulama</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Destek</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Yardım Merkezi</a></li>
                <li><a href="#" className="hover:text-white transition-colors">İletişim</a></li>
                <li><a href="#" className="hover:text-white transition-colors">SSS</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Şirket</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Hakkımızda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Kariyer</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Toplansın. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>

      <LoginModal 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)}
        onSwitchToRegister={() => {
          setShowLogin(false);
          setShowRegister(true);
        }}
        onLogin={setUser}
      />
      
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

export default Index;
