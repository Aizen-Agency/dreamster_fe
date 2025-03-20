import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTracks, getTrackDetails, getStreamUrl, likeTrack, unlikeTrack } from "@/services/trackService";
import { TrackListParams } from "@/types/track";

// Hook for fetching tracks list
export const useTracksList = (params: TrackListParams = {}) => {
    return useQuery({
        queryKey: ['tracks', params],
        queryFn: () => getTracks(params),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

// Hook for fetching track details
export const useTrackDetails = (trackId: string | null) => {
    return useQuery({
        queryKey: ['track', trackId],
        queryFn: () => getTrackDetails(trackId!),
        enabled: !!trackId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

// Hook for getting stream URL
export const useTrackStream = (trackId: string | null) => {
    return useQuery({
        queryKey: ['stream', trackId],
        queryFn: () => getStreamUrl(trackId!),
        enabled: !!trackId,
        staleTime: 60 * 1000, // 1 minute for stream URLs as they might expire
    });
};

// Hook for liking/unliking tracks
export const useTrackLikes = () => {
    const queryClient = useQueryClient();

    const likeMutation = useMutation({
        mutationFn: likeTrack,
        onSuccess: (_, trackId) => {
            // Invalidate the specific track and potentially the tracks list
            queryClient.invalidateQueries({ queryKey: ['track', trackId] });
            queryClient.invalidateQueries({ queryKey: ['tracks'] });
        },
    });

    const unlikeMutation = useMutation({
        mutationFn: unlikeTrack,
        onSuccess: (_, trackId) => {
            // Invalidate the specific track and potentially the tracks list
            queryClient.invalidateQueries({ queryKey: ['track', trackId] });
            queryClient.invalidateQueries({ queryKey: ['tracks'] });
        },
    });

    return {
        likeTrack: likeMutation.mutate,
        unlikeTrack: unlikeMutation.mutate,
        isLiking: likeMutation.isPending,
        isUnliking: unlikeMutation.isPending,
    };
}; 