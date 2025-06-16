import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Calendar, MapPin, Clock, Star, Edit, Camera, Bell, Shield, Heart, Download, ChevronRight, Loader2, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import Header from '@/components/Header';
import ReservationCard from '@/components/ReservationCard';
import LoginModal from '@/components/LoginModal';
import RegisterModal from '@/components/RegisterModal';
import { useUserReservations, useUpdateReservation } from '@/hooks/api/useReservations';

interface ProfileProps {
  user: any;
  onLogout: () => void;
}

const Profile = ({ user, onLogout }: ProfileProps) => {
  const [activeTab, setActiveTab] = useState('reservations');
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: ''
  });
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true
  });
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Rezervasyon hook'ları
  const { data: reservations = [], isLoading: reservationsLoading, error: reservationsError } = useUserReservations();
  const updateReservationMutation = useUpdateReservation();

  // Rezervasyon iptal etme
  const handleCancelReservation = async (reservationId: string) => {
    if (!user) {
      toast({
        title: "Hata",
        description: "Rezervasyon iptal etmek için giriş yapmanız gerekiyor.",
        variant: "destructive",
      });
      return;
    }

    // İptal edilecek rezervasyonu bul
    const reservationToCancel = reservations.find(r => r.id === reservationId);
    if (!reservationToCancel) {
      toast({
        title: "Hata",
        description: "Rezervasyon bulunamadı.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('🚫 Cancelling reservation:', reservationId);

      await updateReservationMutation.mutateAsync({
        reservationId,
        data: { status: 'cancelled' }
      });
      
      toast({
        title: "Başarılı!",
        description: "Rezervasyonunuz başarıyla iptal edildi.",
      });
    } catch (error: any) {
      console.error('❌ Cancel reservation error:', error);
      toast({
        title: "Hata",
        description: error.message || "Rezervasyon iptal edilirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  // Rezervasyon detaylarını görüntüleme
  const handleViewReservation = (reservationId: string) => {
    navigate(`/reservation/${reservationId}`);
  };

  // Favorites will be implemented later with API
  const favorites: any[] = [];

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

  const handleProfileUpdate = () => {
    if (!profileData.name || !profileData.email) {
      toast({
        title: "Hata",
        description: "Lütfen tüm zorunlu alanları doldurun.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Başarılı!",
      description: "Profil bilgileriniz başarıyla güncellendi.",
    });
  };

  const handleReservationClick = (reservationId: string) => {
    // Rezervasyon detaylarını görüntüle
    handleViewReservation(reservationId);
  };

  const handleFavoriteClick = (fieldId: number) => {
    navigate(`/field/${fieldId}`);
  };

  const handleNotificationChange = (type: 'email' | 'sms') => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
    
    toast({
      title: "Bildirim Ayarları",
      description: `${type === 'email' ? 'E-posta' : 'SMS'} bildirimleri ${!notifications[type] ? 'açıldı' : 'kapatıldı'}.`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        user={user} 
        onLoginClick={() => setShowLogin(true)}
        onRegisterClick={() => setShowRegister(true)}
        onLogout={onLogout}
      />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-8 animate-fade-in hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="relative group">
                <Avatar className="h-24 w-24 group-hover:scale-105 transition-transform duration-300">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-2xl">
                    {user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <Button size="sm" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 bg-green-500 hover:bg-green-600 transition-all hover:scale-110">
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{user?.name || 'Kullanıcı'}</h1>
                <p className="text-gray-600 mb-4">{user?.email}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="animate-fade-in">
                    {user?.role === 'OWNER' ? 'Saha Sahibi' : 'Oyuncu'}
                  </Badge>
                  <Badge variant="outline" className="animate-fade-in" style={{ animationDelay: '100ms' }}>
                    Üye: {new Date().getFullYear()}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="animate-fade-in">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-white shadow-lg rounded-lg">
            <TabsTrigger value="reservations" className="transition-all hover:scale-105">Rezervasyonlar</TabsTrigger>
            <TabsTrigger value="favorites" className="transition-all hover:scale-105">Favoriler</TabsTrigger>
            <TabsTrigger value="settings" className="transition-all hover:scale-105">Ayarlar</TabsTrigger>
            <TabsTrigger value="activity" className="transition-all hover:scale-105">Aktivite</TabsTrigger>
          </TabsList>

          {/* Reservations Tab */}
          <TabsContent value="reservations" className="space-y-6">
            <div className="grid gap-6">
              <Card className="animate-fade-in hover:shadow-lg transition-shadow duration-300">
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
                  {reservationsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                      <span className="ml-2 text-gray-600">Rezervasyonlar yükleniyor...</span>
                    </div>
                  ) : reservationsError ? (
                    <div className="text-center py-8">
                      <div className="text-red-600 mb-2">Rezervasyonlar yüklenirken hata oluştu</div>
                      <p className="text-gray-600 text-sm">Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin</p>
                    </div>
                  ) : reservations.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz rezervasyonunuz yok</h3>
                      <p className="text-gray-600 mb-4">İlk rezervasyonunuzu yapmak için sahalar sayfasını ziyaret edin</p>
                      <Button 
                        onClick={() => navigate('/fields')}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                      >
                        Sahalar Sayfasına Git
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {reservations.map((reservation, index) => (
                        <div 
                          key={reservation.id}
                          className="animate-fade-in"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <ReservationCard
                            reservation={reservation}
                            onCancel={handleCancelReservation}
                            onUpdate={handleViewReservation}
                            isLoading={updateReservationMutation.isPending}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites" className="space-y-6">
            <Card className="animate-fade-in hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="mr-2 h-5 w-5 text-red-500" />
                  Favori Sahalarım
                </CardTitle>
                <CardDescription>
                  Beğendiğiniz sahaları buradan hızlıca erişebilirsiniz
                </CardDescription>
              </CardHeader>
              <CardContent>
                {favorites.length === 0 ? (
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz favori sahanız yok</h3>
                    <p className="text-gray-600 mb-4">Beğendiğiniz sahaları favorilere ekleyerek hızlıca erişebilirsiniz</p>
                    <Button 
                      onClick={() => navigate('/fields')}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                    >
                      Sahalar Sayfasına Git
                    </Button>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {favorites.map((field, index) => (
                      <Card 
                        key={field.id} 
                        className="hover:shadow-md transition-all duration-300 cursor-pointer hover:scale-[1.02] animate-fade-in"
                        style={{ animationDelay: `${index * 100}ms` }}
                        onClick={() => handleFavoriteClick(field.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-4">
                            <img 
                              src={field.image} 
                              alt={field.name}
                              className="w-16 h-16 rounded-lg object-cover hover:scale-110 transition-transform duration-300"
                            />
                            <div className="flex-1">
                              <h4 className="font-semibold hover:text-green-600 transition-colors">{field.name}</h4>
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
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid gap-6">
              <Card className="animate-fade-in hover:shadow-lg transition-shadow duration-300">
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
                      <Input 
                        id="name" 
                        value={profileData.name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                        className="transition-all focus:scale-105"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-posta</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                        className="transition-all focus:scale-105"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon</Label>
                    <Input 
                      id="phone" 
                      placeholder="+90 5XX XXX XX XX"
                      value={profileData.phone}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                      className="transition-all focus:scale-105"
                    />
                  </div>
                  <Button 
                    onClick={handleProfileUpdate}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all hover:scale-105"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Bilgileri Güncelle
                  </Button>
                </CardContent>
              </Card>

              <Card className="animate-fade-in hover:shadow-lg transition-shadow duration-300" style={{ animationDelay: '100ms' }}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="mr-2 h-5 w-5" />
                    Bildirim Ayarları
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div>
                      <h4 className="font-medium">E-posta Bildirimleri</h4>
                      <p className="text-sm text-gray-600">Rezervasyon ve kampanya bilgileri</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={notifications.email}
                      onChange={() => handleNotificationChange('email')}
                      className="rounded transition-all hover:scale-110" 
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div>
                      <h4 className="font-medium">SMS Bildirimleri</h4>
                      <p className="text-sm text-gray-600">Rezervasyon hatırlatmaları</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={notifications.sms}
                      onChange={() => handleNotificationChange('sms')}
                      className="rounded transition-all hover:scale-110" 
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card className="animate-fade-in hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle>Son Aktiviteler</CardTitle>
                <CardDescription>
                  Hesabınızdaki son hareketler
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz aktivite geçmişiniz yok</h3>
                  <p className="text-gray-600 mb-4">Rezervasyon yaptıkça aktiviteleriniz burada görünecek</p>
                  <Button 
                    onClick={() => navigate('/fields')}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                  >
                    İlk Rezervasyonunuzu Yapın
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSwitchToRegister={() => {
          setShowLogin(false);
          setShowRegister(true);
        }}
        onLogin={(user) => {
          // Bu durumda kullanıcı zaten giriş yapmış
          setShowLogin(false);
        }}
      />

      {/* Register Modal */}
      <RegisterModal
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        onSwitchToLogin={() => {
          setShowRegister(false);
          setShowLogin(true);
        }}
        onRegister={(user) => {
          // Bu durumda kullanıcı zaten giriş yapmış
          setShowRegister(false);
        }}
      />
    </div>
  );
};

export default Profile;
