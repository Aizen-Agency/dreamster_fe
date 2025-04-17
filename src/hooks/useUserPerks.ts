import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userPerksService, UserPerk, PerkDownloadResponse } from '@/services/userPerksService';

// Hook for fetching all perks
export const useAllPerks = () => {
    return useQuery({
        queryKey: ['userPerks', 'all'],
        queryFn: () => userPerksService.getAllPerks(),
    });
};

// Hook for fetching perks by category
export const usePerksByCategory = (category: string) => {
    return useQuery({
        queryKey: ['userPerks', 'category', category],
        queryFn: () => userPerksService.getPerksByCategory(category),
        enabled: !!category,
    });
};

// Hook for fetching perks for a specific track
export const useTrackPerks = (trackId: string) => {
    return useQuery({
        queryKey: ['userPerks', 'track', trackId],
        queryFn: () => userPerksService.getTrackPerks(trackId),
        enabled: !!trackId,
    });
};

// Hook for downloading a perk
export const useDownloadPerk = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (perkId: string) => userPerksService.downloadPerk(perkId),
        onSuccess: (data, perkId) => {
            // Optionally invalidate queries or update cache
            queryClient.invalidateQueries({ queryKey: ['userPerks'] });
        },
    });
}; 