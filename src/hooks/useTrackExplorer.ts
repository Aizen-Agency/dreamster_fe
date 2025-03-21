import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTracks, getTrackDetails, getStreamUrl, likeTrack, unlikeTrack } from "@/services/trackService";
import { TrackListParams } from "@/types/track";
import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const getAuthHeaders = () => {
    const token = useAuthStore.getState().token;
    return {
        headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json"
        }
    };
};

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

// Enhanced hook for liking/unliking tracks with status check
export const useTrackLikes = (trackId?: string | null) => {
    const queryClient = useQueryClient();

    // Query to check if the current track is liked
    const likeStatusQuery = useQuery({
        queryKey: ['track-like-status', trackId],
        queryFn: async () => {
            if (!trackId) return { liked: false, likes_count: 0 };
            const response = await axios.get(
                `${API_BASE_URL}/tracks/${trackId}/like/status`,
                getAuthHeaders()
            );
            return response.data;
        },
        enabled: !!trackId,
    });

    // Mutation for liking a track
    const likeMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await axios.post(
                `${API_BASE_URL}/tracks/${id}/like`,
                {},
                getAuthHeaders()
            );
            return response.data;
        },
        onSuccess: (data, trackId) => {
            // Update like status in cache
            queryClient.setQueryData(['track-like-status', trackId], {
                liked: true,
                likes_count: data.likes_count
            });

            // Invalidate relevant queries
            queryClient.invalidateQueries({ queryKey: ['track', trackId] });
            queryClient.invalidateQueries({ queryKey: ['tracks'] });
            queryClient.invalidateQueries({ queryKey: ['tracks', 'liked'] });
        },
    });

    // Mutation for unliking a track
    const unlikeMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await axios.delete(
                `${API_BASE_URL}/tracks/${id}/like`,
                getAuthHeaders()
            );
            return response.data;
        },
        onSuccess: (data, trackId) => {
            // Update like status in cache
            queryClient.setQueryData(['track-like-status', trackId], {
                liked: false,
                likes_count: data.likes_count
            });

            // Invalidate relevant queries
            queryClient.invalidateQueries({ queryKey: ['track', trackId] });
            queryClient.invalidateQueries({ queryKey: ['tracks'] });
            queryClient.invalidateQueries({ queryKey: ['tracks', 'liked'] });
        },
    });

    // Function to toggle like status
    const toggleLike = (id: string) => {
        const isCurrentlyLiked = likeStatusQuery.data?.liked;

        if (isCurrentlyLiked) {
            unlikeMutation.mutate(id);
        } else {
            likeMutation.mutate(id);
        }
    };

    return {
        isLiked: likeStatusQuery.data?.liked || false,
        likesCount: likeStatusQuery.data?.likes_count || 0,
        isLoading: likeStatusQuery.isLoading,
        toggleLike,
        likeTrack: likeMutation.mutate,
        unlikeTrack: unlikeMutation.mutate,
        isLiking: likeMutation.isPending,
        isUnliking: unlikeMutation.isPending,
    };
};

// Hook for fetching user's liked tracks
export const useLikedTracks = (params: TrackListParams = {}) => {
    return useQuery({
        queryKey: ['tracks', 'liked', params],
        queryFn: async () => {
            const { page = 1, per_page = 10 } = params;

            const queryParams = new URLSearchParams();
            queryParams.append('page', page.toString());
            queryParams.append('per_page', per_page.toString());

            const response = await axios.get(
                `${API_BASE_URL}/tracks/liked?${queryParams.toString()}`,
                getAuthHeaders()
            );

            return response.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}; 