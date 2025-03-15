import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import Cookies from 'js-cookie';

export function useUserProfile() {
    return useQuery({
        queryKey: ['userProfile'],
        queryFn: () => authService.getUserProfile(),
    });
}

export function useUpdateProfile() {
    const queryClient = useQueryClient();
    const updateUserInStore = useAuthStore((state) => state.updateUser);

    return useMutation({
        mutationFn: (data: {
            username?: string;
            phone_number?: string;
            password?: string;
        }) => authService.updateUserProfile(data),

        onSuccess: (response) => {
            // Update username in store and cookies if it was changed
            if (response.username) {
                updateUserInStore({ username: response.username });
                Cookies.set("username", response.username, {
                    secure: true,
                    sameSite: 'strict',
                    expires: 7
                });
            }

            // Invalidate and refetch the profile data
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            return { message: "Profile updated" };
        },

        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || 'Failed to update profile. Please try again.';
            return errorMessage;
        }
    });
} 