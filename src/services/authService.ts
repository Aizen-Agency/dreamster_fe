import apiClient from '@/lib/apiClient';
import Cookies from 'js-cookie';

export interface RegisterData {
    username: string;
    email: string;
    password: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user: {
        id: string;
        username: string;
        email: string;
    };
}

export const authService = {
    async register(data: RegisterData): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/auth/register', data);
        return response.data;
    },

    async login(data: LoginData): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/auth/login', data);

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
        } catch (error) {
            console.error('Logout API error:', error);
        } finally {
            // Always clear cookies even if the API call fails
            Cookies.remove('token');
            Cookies.remove('isLoggedIn');
            Cookies.remove('username');
        }
    },

    async getUserProfile(): Promise<any> {
        const response = await apiClient.get('/user/profile');
        return response.data;
    }
}; 