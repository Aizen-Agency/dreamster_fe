import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService, LoginData, RegisterData } from '@/services/authService';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Cookies from 'js-cookie';

export function useRegister() {
    const router = useRouter();

    return useMutation({
        mutationFn: (data: RegisterData) => authService.register(data),
        onSuccess: (response) => {
            router.push(`/auth/register/profile?user_id=${response.user.id}`);
        },
        onError: (error: any) => {
            // Extract error message from the API response
            const errorMessage = error.response?.data?.message ||
                'Registration failed. Please try again.';
            console.error('Registration error:', errorMessage);
            return Promise.reject(new Error(errorMessage));
        }
    });
}

export function useSetUserRole() {
    const router = useRouter();

    return useMutation({
        mutationFn: (data: { user_id: string; role: string }) =>
            authService.setUserRole(data),
        onSuccess: () => {
            router.push('/auth/register/success');
        },
        onError: (error: any) => {
            // Extract error message from the API response
            const errorMessage = error.response?.data?.message ||
                'Failed to set user role. Please try again.';
            return Promise.reject(new Error(errorMessage));
        }
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
            login(
                data.user.username,
                false,
                data.token,
                data.user.role,
                data.user.id,
                data.user.email,
                data.user.avatar
            );

            // Invalidate and refetch user profile
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            if (data.user.role === 'musician') {
                router.push('/dashboard/musician');
            } else if (data.user.role === 'fan') {
                router.push('/collection');
            } else {
                router.push('/dashboard/admin');
            }
        },
        onError: (error: any) => {
            // Extract error message from the API response
            const errorMessage = error.response?.data?.message ||
                'Login failed. Please check your credentials.';
            return Promise.reject(new Error(errorMessage));
        }
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
            router.push('/auth/login/email');
        },
        onError: (error: any) => {
            console.error('Logout error:', error);
            // Still perform local logout even if API fails
            logout();
            queryClient.invalidateQueries();
            router.push('/auth/login/email');
        }
    });
}

export function useUserProfile() {
    // Check if user is logged in based on cookies
    const isLoggedIn = Cookies.get('isLoggedIn') === 'true';
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
        enabled: isLoggedIn, // Only run the query if the user is logged in based on cookies
    });
} 