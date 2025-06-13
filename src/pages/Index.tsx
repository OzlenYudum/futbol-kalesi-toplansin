
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, Users, Shield, Zap, Trophy } from 'lucide-react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FieldCard from '@/components/FieldCard';
import LoginModal from '@/components/LoginModal';
import RegisterModal from '@/components/RegisterModal';

const Index = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState(null);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Header 
        user={user} 
        onLoginClick={() => setShowLogin(true)}
        onRegisterClick={() => setShowRegister(true)}
        onLogout={() => setUser(null)}
      />
      
      <Hero onGetStarted={() => setShowRegister(true)} />
      
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

      {/* Featured Fields Section */}
      <section className="py-20 px-4 bg-gray-50">
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
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4">Toplansın</h3>
          <p className="text-gray-400 mb-6">
            Türkiye'nin en büyük halı saha rezervasyon platformu
          </p>
          <div className="flex justify-center space-x-6 text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Hakkımızda</a>
            <a href="#" className="hover:text-white transition-colors">Gizlilik</a>
            <a href="#" className="hover:text-white transition-colors">Şartlar</a>
            <a href="#" className="hover:text-white transition-colors">İletişim</a>
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
