import axios from "axios";
import { Track, TrackListResponse, StreamResponse, TrackListParams } from "@/types/track";
import { useAuthStore } from "@/store/authStore";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

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

// Get tracks list with filters and pagination
export const getTracks = async (params: TrackListParams = {}): Promise<TrackListResponse> => {
    const { page = 1, per_page = 10, genre, sort_by = 'created_at' } = params;

    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('per_page', per_page.toString());
    if (genre) queryParams.append('genre', genre);
    queryParams.append('sort_by', sort_by);

    const response = await axios.get(
        `${API_BASE_URL}/tracks/?${queryParams.toString()}`,
        getAuthHeaders()
    );

    return response.data;
};

// Get track details
export const getTrackDetails = async (trackId: string): Promise<Track> => {
    const response = await axios.get(
        `${API_BASE_URL}/tracks/${trackId}`,
        getAuthHeaders()
    );

    return response.data;
};

// Get stream URL
export const getStreamUrl = async (trackId: string): Promise<StreamResponse> => {
    const response = await axios.get(
        `${API_BASE_URL}/stream/${trackId}`,
        getAuthHeaders()
    );

    return response.data;
};

// Like a track
export const likeTrack = async (trackId: string): Promise<void> => {
    await axios.post(
        `${API_BASE_URL}/tracks/${trackId}/like`,
        {},
        getAuthHeaders()
    );
};

// Unlike a track
export const unlikeTrack = async (trackId: string): Promise<void> => {
    await axios.delete(
        `${API_BASE_URL}/tracks/${trackId}/like`,
        getAuthHeaders()
    );
}; 