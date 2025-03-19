import apiClient from "@/lib/apiClient";

export interface Perk {
    id: string;
    title: string;
    description: string;
    url?: string;
    active: boolean;
    created_at?: string;
    updated_at?: string;
    track_id?: string;
}

export interface CreatePerkRequest {
    title: string;
    description: string;
    url?: string;
    active?: boolean;
}

export interface UpdatePerkRequest {
    title?: string;
    description?: string;
    url?: string;
    active?: boolean;
}

export const perksService = {
    // Get all perks for a track
    getTrackPerks: async (trackId: string): Promise<Perk[]> => {
        const response = await apiClient.get(`/musician/tracks/${trackId}/perks`);
        return response.data;
    },

    // Get a single perk
    getPerk: async (trackId: string, perkId: string): Promise<Perk> => {
        const response = await apiClient.get(`/musician/tracks/${trackId}/perks/${perkId}`);
        return response.data;
    },

    // Create a new perk
    createPerk: async (trackId: string, perkData: CreatePerkRequest): Promise<Perk> => {
        const response = await apiClient.post(`/musician/tracks/${trackId}/perks`, perkData);
        return response.data.perk;
    },

    // Update an existing perk
    updatePerk: async (trackId: string, perkId: string, perkData: UpdatePerkRequest): Promise<Perk> => {
        const response = await apiClient.put(`/musician/tracks/${trackId}/perks/${perkId}`, perkData);
        return response.data.perk;
    },

    // Delete a perk
    deletePerk: async (trackId: string, perkId: string): Promise<void> => {
        await apiClient.delete(`/musician/tracks/${trackId}/perks/${perkId}`);
    },

    // Toggle perk active status
    togglePerkStatus: async (trackId: string, perkId: string): Promise<{ active: boolean }> => {
        const response = await apiClient.patch(`/musician/tracks/${trackId}/perks/toggle/${perkId}`);
        return { active: response.data.active };
    },
}; 