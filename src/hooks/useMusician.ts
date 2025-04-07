import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';
export function useMusician(musicianId: string) {
    return useQuery({
        queryKey: ['musician', musicianId],
        queryFn: async () => {
            const response = await apiClient.get(`/user/${musicianId}`);
            return response.data;
        },
        enabled: !!musicianId,
    });
} 