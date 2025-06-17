import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Users, Award, TrendingUp, Heart, Zap, Shield, Clock, Linkedin, Twitter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import LoginModal from '@/components/LoginModal';
import RegisterModal from '@/components/RegisterModal';

interface AboutProps {
  user: any;
  setUser: (user: any) => void;
}

const About = ({ user, setUser }: AboutProps) => {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const stats = [
    { icon: Users, label: "Aktif Kullanıcı", value: "50K+", color: "from-blue-500 to-cyan-500" },
    { icon: Award, label: "Saha Partneri", value: "1000+", color: "from-green-500 to-emerald-500" },
    { icon: TrendingUp, label: "Aylık Rezervasyon", value: "25K+", color: "from-purple-500 to-pink-500" },
    { icon: Heart, label: "Memnuniyet Oranı", value: "98%", color: "from-red-500 to-rose-500" }
  ];

  const values = [
    {
      icon: Zap,
      title: "Hızlı ve Kolay",
      description: "Birkaç tıkla rezervasyon yapın, anında onay alın."
    },
    {
      icon: Shield,
      title: "Güvenilir",
      description: "Doğrulanmış sahalar ve güvenli ödeme sistemi."
    },
    {
      icon: Users,
      title: "Topluluk Odaklı",
      description: "Futbol severleri bir araya getiriyoruz."
    },
    {
      icon: Clock,
      title: "7/24 Destek",
      description: "Her zaman yanınızdayız, kesintisiz hizmet."
    }
  ];

  const team = [
    {
      name: "Özlen Yudum Besleme",
      role: "Kurucu & CEO",
      image: "/image1.png",
      description: "10+ yıl teknoloji deneyimi",
      socials: {
        linkedin: "#",
        twitter: "#",
      }
    },
    {
      name: "Cem Barış Özden",
      role: "Kurucu & CTO",
      image: "/image2.jpg",
      description: "Yazılım geliştirme uzmanı",
      socials: {
        linkedin: "#",
        twitter: "#",
      }
    },
   
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Header 
        user={user} 
        onLoginClick={() => setShowLogin(true)}
        onRegisterClick={() => setShowRegister(true)}
        onLogout={() => setUser(null)}
      />
      
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Toplansın
            </span>{" "}
            Hikayesi
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            2020 yılında kurulan Toplansın, Türkiye'nin en büyük halı saha rezervasyon platformu olma yolunda 
            hızla ilerlemektedir. Amacımız, futbol severlerin kaliteli sahalar bulmasını kolaylaştırmak ve 
            spor kültürünü yaygınlaştırmaktır.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Rakamlarla Toplansın</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className={`mx-auto w-16 h-16 bg-gradient-to-r ${stat.color} rounded-full flex items-center justify-center text-white mb-4`}>
                    <stat.icon className="h-8 w-8" />
                  </div>
                  <div className="text-3xl font-bold text-green-600 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Misyonumuz</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Futbol tutkusunu yaşayan herkesi bir araya getirmek ve spor kültürünü geliştirmek için 
                teknolojinin gücünden faydalanıyoruz. Kaliteli halı sahaları kolayca bulabilir, 
                rezerve edebilir ve unutulmaz maçlar yaşayabilirsiniz.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Vizyonumuz, Türkiye'nin her köşesinde spor yapmak isteyen herkesi desteklemek ve 
                sağlıklı yaşam kültürünü yaygınlaştırmaktır.
              </p>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=600" 
                alt="Futbol sahası"
                className="rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Değerlerimiz</h2>
            <p className="text-lg text-gray-600">Bu değerler doğrultusunda hizmet veriyoruz</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center text-white mb-4">
                    <value.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Takımımız</h2>
            <p className="text-lg text-gray-600">Toplansın'ı hayata geçiren ekip</p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 justify-center max-w-2xl mx-auto">
            {team.map((member, index) => (
              <Card key={index} className="group relative text-center rounded-3xl border-0 shadow-lg bg-white overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <CardContent className="p-8">
                  <div className="relative inline-block mb-5 p-1 rounded-full bg-gradient-to-tr from-green-400 to-emerald-600">
                    <img
                      src={member.image}
                      alt={member.name}
                      className={`w-32 h-32 rounded-full object-cover ring-4 ring-white ${member.name === 'Cem Barış Özden' ? 'object-top' : ''}`}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{member.name}</h3>
                  <p className="font-semibold text-emerald-600 mb-3">{member.role}</p>
                  <p className="text-gray-500 text-sm px-4">{member.description}</p>
                  
                  <div className="mt-4 flex justify-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-emerald-600">
                      <Linkedin size={20} />
                    </a>
                    <a href={member.socials.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-emerald-600">
                      <Twitter size={20} />
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-500 to-emerald-600">
        <div className="max-w-4xl mx-auto text-center px-4 text-white">
          <h2 className="text-3xl font-bold mb-4">Toplansın Ailesine Katıl!</h2>
          <p className="text-lg mb-8 opacity-90">
            Sen de bu büyük ailenin bir parçası ol ve en iyi halı sahaları keşfet.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Badge variant="secondary" className="text-green-600 text-lg px-6 py-3">
              Ücretsiz Üyelik
            </Badge>
            <Badge variant="secondary" className="text-green-600 text-lg px-6 py-3">
              Anında Rezervasyon
            </Badge>
            <Badge variant="secondary" className="text-green-600 text-lg px-6 py-3">
              Güvenli Ödeme
            </Badge>
          </div>
        </div>
      </section>

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

export default About;
