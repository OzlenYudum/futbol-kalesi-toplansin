
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Calendar, MapPin, Clock, Star, Edit, Camera, Bell, Shield, Heart, Download, ChevronRight } from 'lucide-react';
import Header from '@/components/Header';

interface ProfileProps {
  user: any;
  onLogout: () => void;
}

const Profile = ({ user, onLogout }: ProfileProps) => {
  const [activeTab, setActiveTab] = useState('reservations');

  const reservations = [
    {
      id: 1,
      fieldName: "Yeşilköy Spor Kompleksi",
      date: "2024-06-15",
      time: "14:00 - 16:00",
      price: 500,
      status: "upcoming",
      location: "Yeşilköy, İstanbul",
      image: "https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=200"
    },
    {
      id: 2,
      fieldName: "Merkez Halı Saha",
      date: "2024-06-10",
      time: "18:00 - 20:00",
      price: 400,
      status: "completed",
      location: "Şişli, İstanbul",
      image: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=200"
    },
    {
      id: 3,
      fieldName: "Boğaziçi Sports Club",
      date: "2024-06-05",
      time: "20:00 - 22:00",
      price: 600,
      status: "completed",
      location: "Beşiktaş, İstanbul",
      image: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=200"
    }
  ];

  const favorites = [
    {
      id: 1,
      name: "Yeşilköy Spor Kompleksi",
      rating: 4.8,
      pricePerHour: 250,
      location: "Yeşilköy, İstanbul",
      image: "https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=200"
    },
    {
      id: 2,
      name: "Boğaziçi Sports Club",
      rating: 4.9,
      pricePerHour: 300,
      location: "Beşiktaş, İstanbul",
      image: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=200"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming': return 'Yaklaşan';
      case 'completed': return 'Tamamlandı';
      case 'cancelled': return 'İptal Edildi';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        user={user} 
        onLoginClick={() => {}}
        onRegisterClick={() => {}}
        onLogout={onLogout}
      />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-2xl">
                    {user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <Button size="sm" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0">
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{user?.name || 'Kullanıcı'}</h1>
                <p className="text-gray-600 mb-4">{user?.email}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">
                    {user?.role === 'owner' ? 'Saha Sahibi' : 'Oyuncu'}
                  </Badge>
                  <Badge variant="outline">
                    Üye: {new Date().getFullYear()}
                  </Badge>
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">4.8</div>
                <div className="flex justify-center mb-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-gray-600">Kullanıcı Puanı</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="reservations">Rezervasyonlar</TabsTrigger>
            <TabsTrigger value="favorites">Favoriler</TabsTrigger>
            <TabsTrigger value="settings">Ayarlar</TabsTrigger>
            <TabsTrigger value="activity">Aktivite</TabsTrigger>
          </TabsList>

          {/* Reservations Tab */}
          <TabsContent value="reservations" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    Rezervasyonlarım
                  </CardTitle>
                  <CardDescription>
                    Geçmiş ve gelecek rezervasyonlarınızı görüntüleyin
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reservations.map((reservation) => (
                      <Card key={reservation.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-4">
                            <img 
                              src={reservation.image} 
                              alt={reservation.fieldName}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <h4 className="font-semibold">{reservation.fieldName}</h4>
                              <div className="flex items-center text-sm text-gray-600 mt-1">
                                <MapPin className="h-4 w-4 mr-1" />
                                {reservation.location}
                              </div>
                              <div className="flex items-center text-sm text-gray-600 mt-1">
                                <Clock className="h-4 w-4 mr-1" />
                                {reservation.date} • {reservation.time}
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge className={getStatusColor(reservation.status)}>
                                {getStatusText(reservation.status)}
                              </Badge>
                              <div className="text-lg font-bold text-green-600 mt-2">
                                ₺{reservation.price}
                              </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="mr-2 h-5 w-5" />
                  Favori Sahalarım
                </CardTitle>
                <CardDescription>
                  Beğendiğiniz sahaları buradan hızlıca erişebilirsiniz
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {favorites.map((field) => (
                    <Card key={field.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                          <img 
                            src={field.image} 
                            alt={field.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold">{field.name}</h4>
                            <div className="flex items-center text-sm text-gray-600 mt-1">
                              <MapPin className="h-4 w-4 mr-1" />
                              {field.location}
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                                <span className="text-sm">{field.rating}</span>
                              </div>
                              <div className="text-green-600 font-semibold">
                                ₺{field.pricePerHour}/saat
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profil Bilgileri</CardTitle>
                  <CardDescription>
                    Kişisel bilgilerinizi güncelleyin
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Ad Soyad</Label>
                      <Input id="name" defaultValue={user?.name} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-posta</Label>
                      <Input id="email" type="email" defaultValue={user?.email} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon</Label>
                    <Input id="phone" placeholder="+90 5XX XXX XX XX" />
                  </div>
                  <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                    <Edit className="mr-2 h-4 w-4" />
                    Bilgileri Güncelle
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="mr-2 h-5 w-5" />
                    Bildirim Ayarları
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">E-posta Bildirimleri</h4>
                      <p className="text-sm text-gray-600">Rezervasyon ve kampanya bilgileri</p>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">SMS Bildirimleri</h4>
                      <p className="text-sm text-gray-600">Rezervasyon hatırlatmaları</p>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Son Aktiviteler</CardTitle>
                <CardDescription>
                  Hesabınızdaki son hareketler
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: "Rezervasyon yapıldı", detail: "Yeşilköy Spor Kompleksi", time: "2 saat önce", icon: Calendar },
                    { action: "Favori eklendi", detail: "Merkez Halı Saha", time: "1 gün önce", icon: Heart },
                    { action: "Profil güncellendi", detail: "Telefon numarası değiştirildi", time: "3 gün önce", icon: Edit },
                    { action: "Rezervasyon tamamlandı", detail: "Boğaziçi Sports Club", time: "1 hafta önce", icon: Star }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50">
                      <div className="p-2 bg-green-100 rounded-full">
                        <activity.icon className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{activity.action}</h4>
                        <p className="text-sm text-gray-600">{activity.detail}</p>
                      </div>
                      <span className="text-sm text-gray-500">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
