import apiClient from "@/lib/apiClient";

export interface UserPerk {
    id: string;
    title: string;
    description: string;
    category: string;
    perk_type: "text" | "url" | "file" | "audio" | "image" | "video";
    s3_url?: string;
    track_id: string;
    track_title: string;
    artist_id: string;
    artist_name: string;
    is_direct?: boolean;
    created_at: string;
}

export interface PerkDownloadResponse {
    content?: string;
    download_url?: string;
    perk_type: "text" | "url" | "file" | "audio" | "image" | "video";
    expires_in?: number;
}

export const userPerksService = {
    // Get all perks for the current user
    getAllPerks: async (): Promise<UserPerk[]> => {
        const response = await apiClient.get('/user/perks/');
        return response.data.perks;
    },

    // Get perks by category
    getPerksByCategory: async (category: string): Promise<UserPerk[]> => {
        const response = await apiClient.get(`/user/perks/category/${category}`);
        return response.data.perks;
    },

    // Get perks for a specific track
    getTrackPerks: async (trackId: string): Promise<UserPerk[]> => {
        const response = await apiClient.get(`/user/perks/track/${trackId}`);
        return response.data.perks;
    },

    // Download a perk
    downloadPerk: async (perkId: string): Promise<PerkDownloadResponse> => {
        const response = await apiClient.get(`/user/perks/download/${perkId}`);
        return response.data;
    }
}; 