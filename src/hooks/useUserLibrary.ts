import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import { Track } from "@/types/track";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

// Get auth headers helper
const getAuthHeaders = () => {
    const token = useAuthStore.getState().token;
    return {
        headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json"
        }
    };
};

// Types for library responses
export interface UserLibraryResponse {
    library: Track[];
    count: number;
}

export interface UserTransactionsResponse {
    transactions: {
        id: string;
        track_id: string;
        track_title: string;
        artist: string;
        amount: number;
        status: string;
        payment_id: string;
        date: string;
        error: string | null;
    }[];
    count: number;
}

export interface TrackOwnershipResponse {
    owns: boolean;
    purchase_date?: string;
    token_id?: string;
}

// Hook for fetching user's library (owned tracks)
export const useUserLibrary = () => {
    const { token } = useAuthStore();

    return useQuery({
        queryKey: ['user', 'library'],
        queryFn: async () => {
            const response = await axios.get(
                `${API_BASE_URL}/user/library/`,
                getAuthHeaders()
            );
            return response.data as UserLibraryResponse;
        },
        enabled: !!token,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

// Hook for fetching user's transaction history
export const useUserTransactions = () => {
    const { token } = useAuthStore();

    return useQuery({
        queryKey: ['user', 'transactions'],
        queryFn: async () => {
            const response = await axios.get(
                `${API_BASE_URL}/user/library/transactions`,
                getAuthHeaders()
            );
            return response.data as UserTransactionsResponse;
        },
        enabled: !!token,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

// Hook for checking if user owns a specific track
export const useCheckTrackOwnership = (trackId: string) => {
    const { token } = useAuthStore();

    return useQuery({
        queryKey: ['user', 'owns', trackId],
        queryFn: async () => {
            const response = await axios.get(
                `${API_BASE_URL}/user/library/owns/${trackId}`,
                getAuthHeaders()
            );
            return response.data as TrackOwnershipResponse;
        },
        enabled: !!token && !!trackId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}; 