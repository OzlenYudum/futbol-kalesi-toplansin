
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Target, Award, Heart, Shield, Clock, Star, Trophy } from 'lucide-react';
import Header from '@/components/Header';

interface AboutProps {
  user: any;
  setUser: (user: any) => void;
}

const About = ({ user, setUser }: AboutProps) => {
  const stats = [
    { icon: <Users className="h-8 w-8" />, number: "10,000+", label: "Aktif Kullanıcı" },
    { icon: <Target className="h-8 w-8" />, number: "500+", label: "Halı Saha" },
    { icon: <Award className="h-8 w-8" />, number: "50,000+", label: "Tamamlanan Rezervasyon" },
    { icon: <Star className="h-8 w-8" />, number: "4.8", label: "Ortalama Puan" }
  ];

  const values = [
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Müşteri Memnuniyeti",
      description: "Kullanıcılarımızın memnuniyeti bizim en büyük önceliğimizdir."
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Güvenilirlik",
      description: "Güvenli ödeme sistemi ve doğrulanmış sahalarla güven veriyoruz."
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Hızlı Hizmet",
      description: "Anında rezervasyon ve 7/24 müşteri desteği sunuyoruz."
    },
    {
      icon: <Trophy className="h-6 w-6" />,
      title: "Kalite",
      description: "Sadece kaliteli ve donanımlı halı sahalar platformumuzda yer alır."
    }
  ];

  const team = [
    {
      name: "Ahmet Yılmaz",
      role: "Kurucu & CEO",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300",
      description: "10+ yıl teknoloji sektöründe deneyim"
    },
    {
      name: "Elif Kaya",
      role: "CTO",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b05b?w=300",
      description: "Yazılım geliştirme uzmanı"
    },
    {
      name: "Murat Demir",
      role: "Operasyon Müdürü",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300",
      description: "Saha ortaklıkları ve operasyon yönetimi"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Header 
        user={user} 
        onLoginClick={() => {}}
        onRegisterClick={() => {}}
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
                  <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white mb-4">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-green-600 mb-2">{stat.number}</div>
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
                    {value.icon}
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
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                  <Badge variant="secondary" className="mb-3">{member.role}</Badge>
                  <p className="text-gray-600">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-12 text-white">
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
        </div>
      </section>
    </div>
  );
};

export default About;
