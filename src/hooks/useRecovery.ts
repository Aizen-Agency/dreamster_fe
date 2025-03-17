import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/authService';

export function useRequestPasswordReset() {
    return useMutation({
        mutationFn: (email: string) => authService.requestPasswordReset(email),
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message ||
                'Failed to send verification code. Please try again.';
            return Promise.reject(new Error(errorMessage));
        }
    });
}

export function useVerifyResetCode() {
    return useMutation({
        mutationFn: ({ email, code }: { email: string; code: string }) =>
            authService.verifyResetCode(email, code),
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message ||
                'Invalid or expired verification code. Please try again.';
            return Promise.reject(new Error(errorMessage));
        }
    });
}

export function useResetPassword() {
    return useMutation({
        mutationFn: ({
            email,
            reset_token,
            new_password
        }: {
            email: string;
            reset_token: string;
            new_password: string
        }) => authService.resetPassword(email, reset_token, new_password),
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message ||
                'Failed to reset password. Please try again.';
            return Promise.reject(new Error(errorMessage));
        }
    });
} 