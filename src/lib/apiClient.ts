import axios from 'axios';
import Cookies from 'js-cookie';
import { useAuthStore } from '@/store/authStore';

// Create base axios instance
const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the auth token
apiClient.interceptors.request.use(
    (config) => {
        // Skip authentication for login and register endpoints
        const isAuthEndpoint =
            config.url?.includes('/auth/login') ||
            config.url?.includes('/auth/register');

        if (!isAuthEndpoint) {
            // Try to get token from store first, then from cookies as fallback
            const token = useAuthStore.getState().token || Cookies.get('token');

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle auth errors
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 Unauthorized errors
        if (error.response && error.response.status === 401) {
            // Clear auth state
            useAuthStore.getState().logout();

            // Redirect to login page if we're in the browser
            if (typeof window !== 'undefined') {
                window.location.href = '/auth/login/email';
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient; 