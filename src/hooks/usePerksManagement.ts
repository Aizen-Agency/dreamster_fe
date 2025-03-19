import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { perksService, Perk, CreatePerkRequest, UpdatePerkRequest } from '@/services/perksService';

// Hook to fetch all perks for a track
export const useGetTrackPerks = (trackId: string) => {
    return useQuery({
        queryKey: ['trackPerks', trackId],
        queryFn: () => perksService.getTrackPerks(trackId),
        enabled: !!trackId,
    });
};

// Hook to fetch a single perk
export const useGetPerk = (trackId: string, perkId: string) => {
    return useQuery({
        queryKey: ['perk', trackId, perkId],
        queryFn: () => perksService.getPerk(trackId, perkId),
        enabled: !!trackId && !!perkId,
    });
};

// Hook to create a new perk
export const useCreatePerk = (trackId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (perkData: CreatePerkRequest) => perksService.createPerk(trackId, perkData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['trackPerks', trackId] });
        },
    });
};

// Hook to update an existing perk
export const useUpdatePerk = (trackId: string, perkId?: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ perkId: id, ...data }: UpdatePerkRequest & { perkId?: string }) =>
            perksService.updatePerk(trackId, id || perkId || '', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['trackPerks', trackId] });
            if (perkId) {
                queryClient.invalidateQueries({ queryKey: ['perk', trackId, perkId] });
            }
        },
    });
};

// Hook to delete a perk
export const useDeletePerk = (trackId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (perkId: string) => perksService.deletePerk(trackId, perkId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['trackPerks', trackId] });
        },
    });
};

// Hook to toggle perk status
export const useTogglePerkStatus = (trackId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (perkId: string) => perksService.togglePerkStatus(trackId, perkId),
        onSuccess: (_, perkId) => {
            queryClient.invalidateQueries({ queryKey: ['trackPerks', trackId] });
            queryClient.invalidateQueries({ queryKey: ['perk', trackId, perkId] });
        },
    });
};

// Hook to manage multiple perks at once (for the perks page)
export const usePerksManagement = (trackId: string) => {
    const { data: perks, isLoading, isError, refetch } = useGetTrackPerks(trackId);
    const createPerkMutation = useCreatePerk(trackId);
    const updatePerkMutation = useUpdatePerk(trackId);
    const deletePerkMutation = useDeletePerk(trackId);
    const togglePerkStatusMutation = useTogglePerkStatus(trackId);

    return {
        perks,
        isLoading,
        isError,
        refetch,
        createPerk: createPerkMutation.mutateAsync,
        updatePerk: updatePerkMutation.mutateAsync,
        deletePerk: deletePerkMutation.mutateAsync,
        togglePerkStatus: togglePerkStatusMutation.mutateAsync,
        isPending: createPerkMutation.isPending ||
            updatePerkMutation.isPending ||
            deletePerkMutation.isPending ||
            togglePerkStatusMutation.isPending
    };
}; 