import apiClient from "@/lib/apiClient"
import { useQuery } from "@tanstack/react-query"

export function useTrackDetails(trackId: string) {
    return useQuery({
        queryKey: ["tracks", trackId],
        queryFn: async () => {
            const response = await apiClient.get(`/tracks/${trackId}`)
            return response.data
        },
        enabled: !!trackId
    })
} 