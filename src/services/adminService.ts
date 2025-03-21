import apiClient from '@/lib/apiClient';
import { useAuthStore } from '@/store/authStore';

export interface AdminStats {
    total_users: {
        count: number;
        growth: number;
    };
    new_signups: {
        count: number;
        growth: number;
    };
    musicians: {
        total: {
            count: number;
            growth: number;
        };
        active: {
            count: number;
            growth: number;
        };
        inactive: {
            count: number;
            growth: number;
        };
    };
    admins: {
        count: number;
        growth: number;
    };
    tracks: {
        total: {
            count: number;
            growth: number;
        };
        new: {
            count: number;
            growth: number;
        };
    };
    time_period: {
        current_month: string;
        previous_month: string;
    };
}

export interface UserDistribution {
    musicians: {
        count: number;
        percentage: number;
        growth: number;
    };
    fans: {
        count: number;
        percentage: number;
        growth: number;
    };
    admins: {
        count: number;
        percentage: number;
        growth: number;
    };
}

const getAuthHeaders = () => {
    const token = useAuthStore.getState().token;
    return {
        headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json"
        }
    };
};

const adminService = {
    // Get dashboard statistics
    getDashboardStats: async (): Promise<AdminStats> => {
        const response = await apiClient.get('/admin/dashboard', getAuthHeaders());
        return response.data;
    },

    // Get user distribution data
    getUserDistribution: async (): Promise<UserDistribution> => {
        const response = await apiClient.get('/admin/user-distribution', getAuthHeaders());
        return response.data;
    },

    // Get all users with pagination
    getUsers: async (page = 1, limit = 10, search = '', role = 'all') => {
        const response = await apiClient.get('/admin/users', {
            params: { page, limit, search },
            ...getAuthHeaders()
        });

        if (role && role !== 'all') {
            const filteredUsers = response.data.users.filter((user: any) => user.role === role);
            return {
                ...response.data,
                users: filteredUsers,
                totalUsers: filteredUsers.length,
                totalPages: Math.ceil(filteredUsers.length / limit)
            };
        }

        return response.data;
    },

    // Get user details
    getUserDetails: async (userId: string) => {
        const response = await apiClient.get(`/admin/users/${userId}`, getAuthHeaders());
        return response.data;
    },

    // Update user
    updateUser: async (userId: string, userData: any) => {
        const response = await apiClient.put(`/admin/users/${userId}`, userData, getAuthHeaders());
        return response.data;
    },

    // Delete user
    deleteUser: async (userId: string) => {
        const response = await apiClient.delete(`/admin/users/${userId}`, getAuthHeaders());
        return response.data;
    },

    // Create new user
    createUser: async (userData: any) => {
        const response = await apiClient.post('/admin/users', userData, getAuthHeaders());
        return response.data;
    }
};

export default adminService;

