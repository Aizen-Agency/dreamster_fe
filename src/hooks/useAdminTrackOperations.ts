import apiClient from "@/lib/apiClient"
import { useMutation, useQueryClient } from "@tanstack/react-query"


export function useAdminTrackOperations() {
    const queryClient = useQueryClient()

    const approveTrack = useMutation({
        mutationFn: async (trackId: string) => {
            const response = await apiClient.post(`/admin/tracks/${trackId}/approve`)
            return response.data
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["admin", "tracks"] })
            queryClient.invalidateQueries({ queryKey: ["admin", "tracks", "stats"] })
            queryClient.invalidateQueries({ queryKey: ["tracks"] })
        },
        onError: (error: unknown) => {
            console.error(error)
            throw error
        }
    })

    const rejectTrack = useMutation({
        mutationFn: async ({ trackId, rejectionReason }: { trackId: string; rejectionReason: string }) => {
            const response = await apiClient.post(`/admin/tracks/${trackId}/reject`, {
                rejection_reason: rejectionReason
            })
            return response.data
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["admin", "tracks"] })
            queryClient.invalidateQueries({ queryKey: ["admin", "tracks", "stats"] })
        },
        onError: (error: unknown) => {
            console.error(error)
            throw error
        }
    })

    return {
        approveTrack,
        rejectTrack
    }
} 