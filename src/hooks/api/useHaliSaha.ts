import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { HaliSaha } from '@/types';

/**
 * Hook to fetch a specific HaliSaha by ID
 */
export const useHaliSahaById = (haliSahaId: string) => {
  return useQuery({
    queryKey: ['haliSaha', haliSahaId],
    queryFn: async (): Promise<HaliSaha> => {
      console.log('🏟️ Fetching HaliSaha by ID:', haliSahaId);
      const response = await apiService.getHaliSahaById(haliSahaId);
      console.log('✅ HaliSaha response:', response);
      return response.data;
    },
    enabled: !!haliSahaId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}; 