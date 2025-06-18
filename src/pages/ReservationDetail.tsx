import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  ArrowLeft,
  Edit,
  Trash2,
  RefreshCw,
  Activity,
  CreditCard,
  Users,
  MapIcon
} from 'lucide-react';
import { format, parseISO, differenceInHours, isPast } from 'date-fns';
import { tr } from 'date-fns/locale';
import { useReservationById, useUpdateReservation } from '@/hooks/api/useReservations';
import { useHaliSahaById } from '@/hooks/api/useHaliSaha';
import { Reservation } from '@/types';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import LoadingSpinner from '@/components/LoadingSpinner';

interface ReservationDetailProps {
  user?: any;
  setUser?: (user: any) => void;
}

const ReservationDetail: React.FC<ReservationDetailProps> = ({ user, setUser }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // Hooks
  const { data: reservation, isLoading, error, refetch } = useReservationById(id || '');
  const { data: haliSaha, isLoading: haliSahaLoading } = useHaliSahaById(reservation?.haliSahaId || '');
  const updateReservationMutation = useUpdateReservation();

  if (!id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <Header 
          user={user} 
          onLoginClick={() => setShowLogin(true)}
          onRegisterClick={() => setShowRegister(true)}
          onLogout={() => setUser?.(null)}
        />
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Geçersiz rezervasyon ID'si
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (isLoading || haliSahaLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <Header 
          user={user} 
          onLoginClick={() => setShowLogin(true)}
          onRegisterClick={() => setShowRegister(true)}
          onLogout={() => setUser?.(null)}
        />
        <div className="container mx-auto px-4 py-8">
          <LoadingSpinner message="Rezervasyon detayları yükleniyor..." />
        </div>
      </div>
    );
  }

  if (error || !reservation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <Header 
          user={user} 
          onLoginClick={() => setShowLogin(true)}
          onRegisterClick={() => setShowRegister(true)}
          onLogout={() => setUser?.(null)}
        />
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Rezervasyon bulunamadı veya yüklenirken bir hata oluştu.
            </AlertDescription>
          </Alert>
          <Button 
            onClick={() => navigate('/profile')}
            className="mt-4"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Rezervasyonlarıma Dön
          </Button>
        </div>
      </div>
    );
  }

  // Status configuration
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'approved':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: <CheckCircle className="h-4 w-4" />,
          text: 'Onaylandı',
          bgColor: 'bg-green-50'
        };
      case 'pending':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: <AlertCircle className="h-4 w-4" />,
          text: 'Beklemede',
          bgColor: 'bg-yellow-50'
        };
      case 'cancelled':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: <XCircle className="h-4 w-4" />,
          text: 'İptal Edildi',
          bgColor: 'bg-red-50'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: <AlertCircle className="h-4 w-4" />,
          text: status,
          bgColor: 'bg-gray-50'
        };
    }
  };

  // Date formatting
  const reservationDate = parseISO(reservation.reservationDateTime);
  const createdDate = parseISO(reservation.createdAt);
  const updatedDate = parseISO(reservation.updatedAt);
  
  const formattedDate = format(reservationDate, 'dd MMMM yyyy EEEE', { locale: tr });
  const formattedTime = format(reservationDate, 'HH:mm');
  const timeUntilReservation = differenceInHours(reservationDate, new Date());
  const isPastReservation = isPast(reservationDate);

  const statusConfig = getStatusConfig(reservation.status);

  // Action handlers
  const handleCancelReservation = async () => {
    if (!window.confirm('Bu rezervasyonu iptal etmek istediğinizden emin misiniz?')) {
      return;
    }

    if (!user) {
      toast({
        title: "Hata",
        description: "Rezervasyon iptal etmek için giriş yapmanız gerekiyor.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('🚫 Cancelling reservation:', reservation.id);

      await updateReservationMutation.mutateAsync({
        reservationId: reservation.id,
        data: { status: 'cancelled' }
      });
      
      toast({
        title: "Başarılı!",
        description: "Rezervasyonunuz başarıyla iptal edildi.",
      });
      
      refetch();
    } catch (error: any) {
      console.error('❌ Cancel reservation error:', error);
      toast({
        title: "Hata",
        description: error.message || "Rezervasyon iptal edilirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleEditReservation = () => {
    toast({
      title: "Bilgi",
      description: "Rezervasyon düzenleme özelliği yakında eklenecek.",
    });
  };

  const canCancel = reservation.status === 'pending' && !isPastReservation && timeUntilReservation > 2;
  const canEdit = reservation.status === 'pending' && !isPastReservation && timeUntilReservation > 24;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <Header 
        user={user} 
        onLoginClick={() => setShowLogin(true)}
        onRegisterClick={() => setShowRegister(true)}
        onLogout={() => setUser?.(null)}
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            onClick={() => navigate('/profile')}
            variant="outline"
            className="hover:bg-green-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Rezervasyonlarıma Dön
          </Button>
          
          <div className="flex gap-2">
            <Button
              onClick={() => refetch()}
              variant="outline"
              size="sm"
              disabled={isLoading}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Yenile
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Card */}
            <Card className={`border-2 ${statusConfig.bgColor}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    Rezervasyon Detayları
                  </CardTitle>
                  <Badge 
                    variant="outline" 
                    className={`${statusConfig.color} flex items-center gap-2 font-medium text-sm px-3 py-1`}
                  >
                    {statusConfig.icon}
                    {statusConfig.text}
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Reservation Info */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Calendar className="mr-2 h-5 w-5 text-green-600" />
                  Saha ve Tarih Bilgileri
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapIcon className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900">
                          {haliSaha?.name || reservation.haliSaha?.name || 'Saha Bilgisi Yükleniyor...'}
                        </p>
                        {(haliSaha?.location || reservation.haliSaha?.location) && (
                          <p className="text-gray-600 text-sm">{haliSaha?.location || reservation.haliSaha?.location}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-semibold text-gray-900">{formattedDate}</p>
                        <p className="text-gray-600 text-sm">Rezervasyon Tarihi</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-semibold text-gray-900">{formattedTime}</p>
                        <p className="text-gray-600 text-sm">Rezervasyon Saati</p>
                      </div>
                    </div>
                    
                    {(haliSaha?.phone || reservation.haliSaha?.phone) && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-semibold text-gray-900">{haliSaha?.phone || reservation.haliSaha?.phone}</p>
                          <p className="text-gray-600 text-sm">Saha Telefonu</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Time Until Reservation */}
                {!isPastReservation && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-blue-800">
                      <Clock className="h-5 w-5" />
                      <span className="font-medium">
                        {timeUntilReservation > 24 
                          ? `${Math.floor(timeUntilReservation / 24)} gün ${timeUntilReservation % 24} saat kaldı`
                          : timeUntilReservation > 0 
                            ? `${timeUntilReservation} saat kaldı`
                            : 'Rezervasyon zamanı geldi!'
                        }
                      </span>
                    </div>
                  </div>
                )}

                {/* Past Reservation Notice */}
                {isPastReservation && reservation.status !== 'cancelled' && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">Bu rezervasyon tamamlandı</span>
                    </div>
                  </div>
                )}

                {/* Recurring Reservation */}
                {reservation.isRecurring && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-purple-800">
                      <RefreshCw className="h-5 w-5" />
                      <span className="font-medium">Tekrarlanan Rezervasyon</span>
                    </div>
                    {reservation.subscriptionId && (
                      <p className="text-purple-700 text-sm mt-1">
                        Abonelik ID: {reservation.subscriptionId}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* User Info */}
            {reservation.user && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <User className="mr-2 h-5 w-5 text-green-600" />
                    Rezervasyon Sahibi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-semibold text-gray-900">{reservation.user.name}</p>
                        <p className="text-gray-600 text-sm">İsim</p>
                      </div>
                    </div>
                    
                    {reservation.user.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-semibold text-gray-900">{reservation.user.email}</p>
                          <p className="text-gray-600 text-sm">E-posta</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            {!isPastReservation && reservation.status !== 'cancelled' && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Activity className="mr-2 h-5 w-5 text-green-600" />
                    İşlemler
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {canEdit && (
                      <Button
                        onClick={handleEditReservation}
                        variant="outline"
                        className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300"
                      >
                        <Edit className="h-4 w-4" />
                        Düzenle
                      </Button>
                    )}
                    
                    {canCancel && (
                      <Button
                        onClick={handleCancelReservation}
                        variant="outline"
                        disabled={updateReservationMutation.isPending}
                        className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        İptal Et
                      </Button>
                    )}
                    
                    {!canCancel && !canEdit && reservation.status === 'pending' && (
                      <div className="text-gray-600 text-sm">
                        <p>• Rezervasyonunuz 2 saatten az kaldığında iptal edilemez</p>
                        <p>• Rezervasyonunuz 24 saatten az kaldığında düzenlenemez</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Hızlı Bilgiler</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Rezervasyon ID:</span>
                  <span className="font-mono text-sm">{reservation.id.slice(0, 8)}...</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Oluşturulma:</span>
                  <span className="font-medium">
                    {format(createdDate, 'dd.MM.yyyy HH:mm', { locale: tr })}
                  </span>
                </div>

                {reservation.updatedAt && reservation.updatedAt !== reservation.createdAt && (
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Son Güncelleme:</span>
                    <span className="font-medium">
                      {format(updatedDate, 'dd.MM.yyyy HH:mm', { locale: tr })}
                    </span>
                  </div>
                )}

                {reservation.lastUpdatedBy && (
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Güncelleyen:</span>
                    <span className="font-medium">{reservation.lastUpdatedBy.name}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Field Details */}
            {reservation.haliSaha && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Saha Detayları</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {reservation.haliSaha.pricePerHour && (
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-gray-600">Saatlik Ücret:</span>
                      <span className="font-bold text-green-600">
                        ₺{reservation.haliSaha.pricePerHour}
                      </span>
                    </div>
                  )}
                  
                  {reservation.haliSaha.maxPlayers && (
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Kapasite:</span>
                      <span className="font-medium">{reservation.haliSaha.maxPlayers}</span>
                    </div>
                  )}

                  {reservation.haliSaha.surface && (
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Zemin:</span>
                      <span className="font-medium">{reservation.haliSaha.surface}</span>
                    </div>
                  )}

                  <Button
                    onClick={() => navigate(`/field/${reservation.haliSahaId}`)}
                    variant="outline"
                    className="w-full mt-4 hover:bg-green-50"
                  >
                    Saha Detaylarını Gör
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Support */}
            <Card className="shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader>
                <CardTitle className="text-lg text-blue-900">Yardım Gerekiyor mu?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-800 text-sm mb-4">
                  Rezervasyonunuzla ilgili sorularınız için bizimle iletişime geçin.
                </p>
                <Button 
                  onClick={() => navigate('/contact')}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  İletişim
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationDetail; 