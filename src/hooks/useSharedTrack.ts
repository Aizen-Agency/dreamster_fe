import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

// Hook for fetching shared track details (no auth required)
export const useSharedTrackDetails = (trackId: string | null) => {
    return useQuery({
        queryKey: ['shared-track', trackId],
        queryFn: async () => {
            if (!trackId) throw new Error("Track ID is required");
            const response = await axios.get(`${API_BASE_URL}/tracks/share/${trackId}`);
            return response.data;
        },
        enabled: !!trackId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

// Hook for getting shared track stream URL (no auth required)
export const useSharedTrackStream = (trackId: string | null) => {
    return useQuery({
        queryKey: ['shared-stream', trackId],
        queryFn: async () => {
            if (!trackId) throw new Error("Track ID is required");
            const response = await axios.get(`${API_BASE_URL}/tracks/share/${trackId}/stream`);
            return response.data;
        },
        enabled: !!trackId,
        staleTime: 60 * 1000, // 1 minute for stream URLs as they might expire
    });
};

// Mutation for recording a track share
export const useRecordTrackShare = () => {
    return useMutation({
        mutationFn: async ({ trackId, platform = "link" }: { trackId: string; platform?: string }) => {
            const response = await axios.post(
                `${API_BASE_URL}/tracks/share/${trackId}/record-share`,
                { platform }
            );
            return response.data;
        }
    });
};

// Combined hook for shared track functionality
export const useSharedTrack = (trackId: string | null) => {
    const detailsQuery = useSharedTrackDetails(trackId);
    const streamQuery = useSharedTrackStream(trackId);
    const recordShareMutation = useRecordTrackShare();

    const shareTrack = async (platform: string = "link") => {
        if (!trackId) return;
        return recordShareMutation.mutateAsync({ trackId, platform });
    };

    return {
        trackData: detailsQuery.data,
        streamData: streamQuery.data,
        isLoading: detailsQuery.isLoading || streamQuery.isLoading,
        isError: detailsQuery.isError || streamQuery.isError,
        error: detailsQuery.error || streamQuery.error,
        shareTrack,
        isSharing: recordShareMutation.isPending
    };
}; 