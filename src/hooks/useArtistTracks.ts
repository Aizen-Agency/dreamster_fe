import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import { Track, TrackListParams } from "@/types/track";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Types for the artist tracks response
export interface ArtistTracksResponse {
    artist: {
        id: string;
        name: string;
        username: string;
    };
    tracks: Track[];
    total: number;
    pages: number;
    current_page: number;
}

// Get auth headers
const getAuthHeaders = () => {
    const token = useAuthStore.getState().token;
    return {
        headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json"
        }
    };
};

// Hook for fetching artist tracks
export const useArtistTracks = (artistId: string, params: TrackListParams = {}) => {
    const { page = 1, per_page = 10, sort_by = 'created_at' } = params;

    return useQuery({
        queryKey: ['artist-tracks', artistId, params],
        queryFn: async () => {
            const queryParams = new URLSearchParams();
            queryParams.append('page', page.toString());
            queryParams.append('per_page', per_page.toString());
            if (params.genre) queryParams.append('genre', params.genre);
            queryParams.append('sort_by', sort_by);

            const response = await axios.get(
                `${API_BASE_URL}/tracks/artist/${artistId}?${queryParams.toString()}`,
                getAuthHeaders()
            );

            return response.data as ArtistTracksResponse;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        enabled: !!artistId,
    });
}; 