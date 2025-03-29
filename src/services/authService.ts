import apiClient from '@/lib/apiClient';
import Cookies from 'js-cookie';

export interface RegisterData {
    email: string;
    password: string;
    username: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface AuthResponse {
    user: {
        id: string;
        username: string;
        email: string;
        role?: string;
    };
    token?: string;
}

export interface LoginResponse {
    user: {
        id: string;
        username: string;
        email: string;
        role: string;
        avatar: string;
    };
    token: string;
}

export const authService = {
    async register(data: RegisterData): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/auth/register', data);
        return response.data;
    },

    async setUserRole(data: { user_id: string; role: string }): Promise<any> {
        const response = await apiClient.post('/auth/set-role', data);
        return response.data;
    },

    async login(data: LoginData): Promise<LoginResponse> {
        const response = await apiClient.post<LoginResponse>('/auth/login', data);

        // Store the JWT token and user info in cookies
        if (response.data.token) {
            Cookies.set('token', response.data.token, {
                secure: true,
                sameSite: 'strict',
                expires: 7 // 7 days
            });
            Cookies.set('isLoggedIn', 'true', {
                secure: true,
                sameSite: 'strict',
                expires: 7
            });
            Cookies.set('username', response.data.user.username, {
                secure: true,
                sameSite: 'strict',
                expires: 7
            });
        }

        return response.data;
    },

    async logout(): Promise<void> {
        try {
            await apiClient.post('/auth/logout');
        } finally {
            // Clear cookies regardless of API response
            Cookies.remove('token');
            Cookies.remove('isLoggedIn');
            Cookies.remove('username');
        }
    },

    async getUserProfile(): Promise<any> {
        const response = await apiClient.get('/user/profile');
        return response.data;
    },

    async updateUserProfile(data: {
        username?: string;
        phone_number?: string;
        password?: string;
    }): Promise<any> {
        const response = await apiClient.put('/user/update', data);
        return response.data;
    },

    async requestPasswordReset(email: string): Promise<any> {
        const response = await apiClient.post('/auth/recovery/request-reset', { email });
        return response.data;
    },

    async verifyResetCode(email: string, code: string): Promise<any> {
        const response = await apiClient.post('/auth/recovery/verify-code', { email, code });
        return response.data;
    },

    async resetPassword(email: string, reset_token: string, new_password: string): Promise<any> {
        const response = await apiClient.post('/auth/recovery/reset-password', {
            email,
            reset_token,
            new_password
        });
        return response.data;
    },

    async uploadProfilePicture(formData: FormData): Promise<any> {
        const response = await apiClient.post('/user/profile-picture', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }
}; 