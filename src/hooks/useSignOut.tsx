// src/hooks/useSignOut.ts
import { useLogout } from './useAuth';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import Cookies from 'js-cookie';

export function useSignOut(options: { showConfirmation?: boolean } = {}) {
    const { showConfirmation = false } = options;
    const logoutMutation = useLogout();
    const queryClient = useQueryClient();
    const logoutStore = useAuthStore(state => state.logout);

    const signOut = async () => {
        // Show confirmation if enabled
        if (showConfirmation) {
            const confirmed = window.confirm('Are you sure you want to sign out?');
            if (!confirmed) return;
        }

        try {
            // Execute the logout mutation which handles API call
            await logoutMutation.mutateAsync();

            // Ensure all cookies are removed (belt and suspenders approach)
            const cookiesToRemove = [
                'token', 'isLoggedIn', 'username', 'isSubaccount',
                'role', 'id', 'email'
            ];

            cookiesToRemove.forEach(cookie => Cookies.remove(cookie));

            // Clear auth store state
            logoutStore();

            // Clear all queries in React Query cache
            queryClient.clear();

            // No need to handle redirection as useLogout already does this
        } catch (error) {
            console.error('Sign out error:', error);
        }
    };

    return {
        signOut,
        isSigningOut: logoutMutation.isPending,
        error: logoutMutation.error
    };
}