import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { transformFieldToCard, transformFieldToDetail } from '@/utils/fieldTransformers';
import { HaliSahaCard } from '@/types';

export const useHaliSahalar = () => {
  return useQuery({
    queryKey: ['halisahalar'],
    queryFn: async (): Promise<HaliSahaCard[]> => {
      const response = await apiService.getHaliSahalar();
      return response.data.map(transformFieldToCard);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useHaliSahaDetail = (id: string) => {
  return useQuery({
    queryKey: ['halisaha', id],
    queryFn: async (): Promise<HaliSahaCard> => {
      const response = await apiService.getHaliSahaById(id);
      return transformFieldToDetail(response.data);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}; 