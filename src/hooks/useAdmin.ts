import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import adminService from "@/services/adminService";

// Hook for fetching admin dashboard statistics
export const useAdminDashboardStats = () => {
    return useQuery({
        queryKey: ['adminDashboard', 'stats'],
        queryFn: () => adminService.getDashboardStats(),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

// Hook for fetching monthly trends
// export const useAdminMonthlyTrends = () => {
//     return useQuery({
//         queryKey: ['adminDashboard', 'monthlyTrends'],
//         queryFn: () => adminService.(),
//         staleTime: 5 * 60 * 1000, // 5 minutes
//     });
// };
// Hook for fetching users list with filtering, sorting and pagination
export const useAdminUsersList = (params: any = {}) => {
    return useQuery({
        queryKey: ['adminUsers', params],
        queryFn: () => adminService.getUsers(params),
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};

// Store for admin dashboard state management
import { create } from 'zustand';

interface AdminDashboardState {
    // Filter state for users list
    userFilters: {
        role: string;
        search: string;
        sortBy: string;
        sortOrder: 'asc' | 'desc';
    };
    // Pagination state
    pagination: {
        page: number;
        perPage: number;
    };
    // Actions
    setUserFilters: (filters: Partial<AdminDashboardState['userFilters']>) => void;
    setPagination: (pagination: Partial<AdminDashboardState['pagination']>) => void;
    resetFilters: () => void;
}

export const useAdminStore = create<AdminDashboardState>((set) => ({
    userFilters: {
        role: 'all',
        search: '',
        sortBy: 'created_at',
        sortOrder: 'desc',
    },
    pagination: {
        page: 1,
        perPage: 20,
    },
    setUserFilters: (filters) => set((state) => ({
        userFilters: { ...state.userFilters, ...filters },
        // Reset to page 1 when filters change
        pagination: { ...state.pagination, page: 1 }
    })),
    setPagination: (pagination) => set((state) => ({
        pagination: { ...state.pagination, ...pagination }
    })),
    resetFilters: () => set({
        userFilters: {
            role: 'all',
            search: '',
            sortBy: 'created_at',
            sortOrder: 'desc',
        },
        pagination: {
            page: 1,
            perPage: 20,
        }
    })
}));

// Combined hook for admin dashboard that provides both data and state management
export const useAdminDashboard = () => {
    const filters = useAdminStore((state) => state.userFilters);
    const pagination = useAdminStore((state) => state.pagination);
    const { setUserFilters, setPagination, resetFilters } = useAdminStore();

    // Convert store state to API params
    const usersParams = {
        page: pagination.page,
        per_page: pagination.perPage,
        role: filters.role !== 'all' ? filters.role : undefined,
        search: filters.search || undefined,
        sort_by: filters.sortBy,
        sort_order: filters.sortOrder,
    };

    // Fetch data using the individual hooks
    const statsQuery = useAdminDashboardStats();
    // const trendsQuery = useAdminMonthlyTrends();
    const usersQuery = useAdminUsersList(usersParams);

    return {
        // Data queries
        stats: statsQuery,
        // trends: trendsQuery,
        users: usersQuery,

        // State management
        filters,
        pagination,
        setFilters: setUserFilters,
        setPagination,
        resetFilters,

        // Helper for checking if any query is loading
        isLoading: statsQuery.isLoading || usersQuery.isLoading,

        // Helper for checking if any query has an error
        isError: statsQuery.isError || usersQuery.isError,
    };
}; 