import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { Reservation, CreateReservationData, UpdateReservationData } from '@/types';

/**
 * Hook to fetch user's reservations
 */
export const useUserReservations = () => {
  return useQuery({
    queryKey: ['user-reservations'],
    queryFn: async (): Promise<Reservation[]> => {
      console.log('🔄 Fetching user reservations...');
      try {
        const response = await apiService.getUserReservations();
        console.log('✅ User reservations response:', response);
        console.log('📊 Total reservations received:', response.data?.length || 0);
        return response.data || [];
      } catch (error: any) {
        console.error('❌ Failed to fetch user reservations:', error);
        throw error;
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

/**
 * Hook to fetch a specific reservation by ID
 */
export const useReservationById = (reservationId: string) => {
  return useQuery({
    queryKey: ['reservation', reservationId],
    queryFn: async (): Promise<Reservation> => {
      console.log('🔄 Fetching reservation by ID:', reservationId);
      const response = await apiService.getReservationById(reservationId);
      console.log('✅ Reservation response:', response);
      return response.data;
    },
    enabled: !!reservationId,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to create a new reservation
 */
export const useCreateReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reservationData: CreateReservationData): Promise<Reservation> => {
      console.log('🚀 Creating reservation:', reservationData);
      const response = await apiService.createReservation(reservationData);
      return response.data;
    },
    onSuccess: (newReservation) => {
      console.log('✅ Reservation created successfully:', newReservation);
      // Invalidate user reservations to refetch
      queryClient.invalidateQueries({ queryKey: ['user-reservations'] });
      
      // Optionally add the new reservation to cache immediately
      queryClient.setQueryData(['user-reservations'], (oldData: Reservation[] | undefined) => {
        return oldData ? [newReservation, ...oldData] : [newReservation];
      });
    },
    onError: (error: any) => {
      console.error('❌ Failed to create reservation:', error);
    }
  });
};

/**
 * Hook to update a reservation
 */
export const useUpdateReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reservationId, data }: { reservationId: string; data: UpdateReservationData }): Promise<Reservation> => {
      console.log('📝 Updating reservation:', reservationId, data);
      const response = await apiService.updateReservation(reservationId, data);
      return response.data;
    },
    onSuccess: (updatedReservation) => {
      console.log('✅ Reservation updated successfully:', updatedReservation);
      
      // Update the specific reservation in cache
      queryClient.setQueryData(['reservation', updatedReservation.id], updatedReservation);
      
      // Update the reservation in user reservations list
      queryClient.setQueryData(['user-reservations'], (oldData: Reservation[] | undefined) => {
        return oldData ? oldData.map(reservation => 
          reservation.id === updatedReservation.id ? updatedReservation : reservation
        ) : [];
      });
      
      // Invalidate to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['user-reservations'] });
    },
    onError: (error: any) => {
      console.error('❌ Failed to update reservation:', error);
    }
  });
}; 