import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, User, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { Reservation } from '@/types';
import { useHaliSahaById } from '@/hooks/api/useHaliSaha';
import { format, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';

interface ReservationCardProps {
  reservation: Reservation;
  onCancel?: (reservationId: string) => void;
  onUpdate?: (reservationId: string) => void;
  isLoading?: boolean;
}

const ReservationCard: React.FC<ReservationCardProps> = ({
  reservation,
  onCancel,
  onUpdate,
  isLoading = false
}) => {
  // Saha bilgilerini ayrı olarak çek
  const { data: haliSaha, isLoading: haliSahaLoading } = useHaliSahaById(reservation.haliSahaId);
  // Status'a göre renk ve ikon belirleme
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'approved':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: <CheckCircle className="h-4 w-4" />,
          text: 'Onaylandı'
        };
      case 'pending':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: <AlertCircle className="h-4 w-4" />,
          text: 'Beklemede'
        };
      case 'cancelled':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: <XCircle className="h-4 w-4" />,
          text: 'İptal Edildi'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: <AlertCircle className="h-4 w-4" />,
          text: status
        };
    }
  };

  const statusConfig = getStatusConfig(reservation.status);
  
  // Tarih formatlaması
  const reservationDate = parseISO(reservation.reservationDateTime);
  const formattedDate = format(reservationDate, 'dd MMMM yyyy', { locale: tr });
  const formattedTime = format(reservationDate, 'HH:mm');
  
  // Geçmiş tarih kontrolü
  const isPastDate = reservationDate < new Date();
  const canCancel = reservation.status === 'pending' && !isPastDate;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            {haliSaha?.name || reservation.haliSaha?.name || (haliSahaLoading ? 'Saha Bilgisi Yükleniyor...' : 'Saha Bilgisi Bulunamadı')}
          </CardTitle>
          <Badge 
            variant="outline" 
            className={`${statusConfig.color} flex items-center gap-1 font-medium`}
          >
            {statusConfig.icon}
            {statusConfig.text}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Rezervasyon Detayları */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="h-4 w-4 text-green-600" />
            <span className="font-medium">{formattedDate}</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="h-4 w-4 text-green-600" />
            <span className="font-medium">{formattedTime}</span>
          </div>
          
          {(haliSaha?.location || reservation.haliSaha?.location) && (
            <div className="flex items-center gap-2 text-gray-600 md:col-span-2">
              <MapPin className="h-4 w-4 text-green-600" />
              <span className="text-sm">{haliSaha?.location || reservation.haliSaha?.location}</span>
            </div>
          )}
        </div>

        {/* Ek Bilgiler */}
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Rezervasyon ID: {reservation.id.slice(0, 8)}...</span>
            </div>
            <span>
              Oluşturulma: {format(parseISO(reservation.createdAt), 'dd.MM.yyyy', { locale: tr })}
            </span>
          </div>
        </div>

        {/* Tekrarlanan Rezervasyon Bilgisi */}
        {reservation.isRecurring && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-blue-800">
              <Calendar className="h-4 w-4" />
              <span className="text-sm font-medium">Tekrarlanan Rezervasyon</span>
            </div>
          </div>
        )}

        {/* Geçmiş Tarih Uyarısı */}
        {isPastDate && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Bu rezervasyon geçmiş tarihli</span>
            </div>
          </div>
        )}

        {/* Aksiyon Butonları */}
        <div className="flex gap-2 pt-2">
          {canCancel && onCancel && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCancel(reservation.id)}
              disabled={isLoading}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              İptal Et
            </Button>
          )}
          
          {onUpdate && reservation.status !== 'cancelled' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUpdate(reservation.id)}
              disabled={isLoading}
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              Detaylar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReservationCard; 