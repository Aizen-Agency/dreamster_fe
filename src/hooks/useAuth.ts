import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService, LoginData, RegisterData } from '@/services/authService';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export function useRegister() {
    const router = useRouter();

    return useMutation({
        mutationFn: (data: RegisterData) => authService.register(data),
        onSuccess: () => {
            router.push('/auth/register/success');
        },
    });
}

export function useLogin() {
    const router = useRouter();
    const login = useAuthStore((state) => state.login);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: LoginData) => authService.login(data),
        onSuccess: (data) => {
            // Update the auth store
            login(data.user.username, false, data.token);

            // Invalidate and refetch user profile
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });

            // Redirect to dashboard
            router.push('/dashboard');
        },
    });
}

export function useLogout() {
    const router = useRouter();
    const logout = useAuthStore((state) => state.logout);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => authService.logout(),
        onSuccess: () => {
            // Update the auth store
            logout();

            // Clear any user-related queries from the cache
            queryClient.invalidateQueries();

            // Redirect to login page
            router.push('/auth/login');
        },
    });
}

export function useUserProfile() {
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const updateUser = useAuthStore((state) => state.updateUser);

    return useQuery({
        queryKey: ['userProfile'],
        queryFn: async () => {
            const data = await authService.getUserProfile();
            // Update user data in store with profile info
            if (data) {
                updateUser({
                    email: data.email,
                    // Add any other fields from profile
                });
            }
            return data;
        },
        enabled: isLoggedIn, // Only run the query if the user is logged in
    });
} 