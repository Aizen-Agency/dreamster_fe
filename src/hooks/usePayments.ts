import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

// Create payment intent
export const useCreatePaymentIntent = () => {
    const { token } = useAuthStore();

    return useMutation({
        mutationFn: async ({ trackId, quantity = 1 }: { trackId: string, quantity?: number }) => {
            const response = await axios.post(
                `${API_BASE_URL}/payments/create-payment-intent`,
                { track_id: trackId, quantity },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            return response.data;
        }
    });
};

// Get user's owned tracks (library)
export const useUserLibrary = () => {
    const { token } = useAuthStore();

    return useQuery({
        queryKey: ['user', 'library'],
        queryFn: async () => {
            const response = await axios.get(
                `${API_BASE_URL}/user/library`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            return response.data;
        },
        enabled: !!token
    });
};

// Get user's transaction history
export const useTransactionHistory = () => {
    const { token } = useAuthStore();

    return useQuery({
        queryKey: ['user', 'transactions'],
        queryFn: async () => {
            const response = await axios.get(
                `${API_BASE_URL}/user/library/transactions`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            return response.data;
        },
        enabled: !!token
    });
};

// Check if user owns a specific track
export const useCheckTrackOwnership = (trackId: string) => {
    const { token } = useAuthStore();

    return useQuery({
        queryKey: ['user', 'owns', trackId],
        queryFn: async () => {
            const response = await axios.get(
                `${API_BASE_URL}/user/library/owns/${trackId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            return response.data;
        },
        enabled: !!token && !!trackId
    });
}; 