import { useAuthStore } from "@/store/authStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

// Types
export interface TrackFormData {
    title: string;
    description?: string;
    genre?: string;
    tags?: string[];
    starting_price?: number;
    exclusive?: boolean;
    audio: File;
    artwork?: File;
}

export interface Track {
    id: string;
    title: string;
    description?: string;
    genre?: string;
    tags?: string[];
    starting_price?: number;
    audio_url: string;
    artwork_url?: string;
    created_at: string;
    updated_at: string;
}

// Get auth headers for regular JSON requests
const getAuthHeaders = () => {
    const token = useAuthStore.getState().token;
    return {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    };
};

// Upload a track
export const useUploadTrack = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (trackData: TrackFormData) => {
            const token = useAuthStore.getState().token;

            // Create FormData object
            const formData = new FormData();
            formData.append("title", trackData.title);

            if (trackData.description) {
                formData.append("description", trackData.description);
            }

            if (trackData.genre) {
                formData.append("genre", trackData.genre);
            }

            if (trackData.tags && trackData.tags.length > 0) {
                formData.append("tags", JSON.stringify(trackData.tags));
            }

            if (trackData.starting_price) {
                formData.append("starting_price", trackData.starting_price.toString());
            }

            // Add exclusive field if provided
            if (trackData.exclusive !== undefined) {
                formData.append("exclusive", trackData.exclusive.toString());
            }

            // Append files
            formData.append("audio", trackData.audio);

            if (trackData.artwork) {
                formData.append("artwork", trackData.artwork);
            }

            // Let the browser set the Content-Type header with boundary
            const response = await axios.post(
                `${API_BASE_URL}/musician/tracks/`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            return response.data;
        },
        onSuccess: () => {
            // Invalidate and refetch tracks list
            queryClient.invalidateQueries({ queryKey: ["tracks"] });
        },
    });
};

// Get all tracks
export const useGetTracks = () => {
    return useQuery({
        queryKey: ["tracks"],
        queryFn: async () => {
            const response = await axios.get(
                `${API_BASE_URL}/musician/tracks/`,
                getAuthHeaders()
            );
            return response.data;
        },
    });
};

// Get a single track
export const useGetTrack = (trackId: string) => {
    return useQuery({
        queryKey: ["tracks", trackId],
        queryFn: async () => {
            const response = await axios.get(
                `${API_BASE_URL}/musician/tracks/${trackId}`,
                getAuthHeaders()
            );
            return response.data;
        },
        enabled: !!trackId,
    });
};

// Update a track
export const useUpdateTrack = (trackId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (trackData: Partial<Omit<TrackFormData, 'audio' | 'artwork'>> & {
            collaborators?: Array<{
                wallet_address: string;
                split_share: number;
            }>
        }) => {
            // Format collaborators for the API if they exist
            const formattedData = { ...trackData };

            if (trackData.collaborators) {
                formattedData.collaborators = trackData.collaborators.map(collab => ({
                    wallet_address: collab.wallet_address as string,
                    split_share: collab.split_share as number
                }));
            }

            const response = await axios.put(
                `${API_BASE_URL}/musician/tracks/${trackId}`,
                formattedData,
                getAuthHeaders()
            );

            return response.data;
        },
        onSuccess: () => {
            // Invalidate and refetch the specific track and the tracks list
            queryClient.invalidateQueries({ queryKey: ["tracks", trackId] });
            queryClient.invalidateQueries({ queryKey: ["tracks"] });
        },
    });
};

// Delete a track
export const useDeleteTrack = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (trackId: string) => {
            const response = await axios.delete(
                `${API_BASE_URL}/musician/tracks/${trackId}`,
                getAuthHeaders()
            );
            return response.data;
        },
        onSuccess: () => {
            // Invalidate and refetch tracks list
            queryClient.invalidateQueries({ queryKey: ["tracks"] });
        },
    });
}; 