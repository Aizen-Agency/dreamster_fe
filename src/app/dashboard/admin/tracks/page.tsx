"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { ArrowLeft, ExternalLink, Filter } from "lucide-react"
import Link from "next/link"
import apiClient from "@/lib/apiClient"

export default function AdminTracks() {
    const router = useRouter()
    const [currentPage, setCurrentPage] = useState(1)
    const [filter, setFilter] = useState<"pending" | "approved" | "rejected" | "all">("pending")

    const { data, isLoading, error } = useQuery({
        queryKey: ["admin", "tracks", filter, currentPage],
        queryFn: async () => {
            const response = await apiClient.get(`/admin/tracks${filter !== "all" ? `/${filter}` : ""}`, {
                params: { page: currentPage, per_page: 10 }
            })
            return response.data
        }
    })

    const { data: statsData } = useQuery({
        queryKey: ["admin", "tracks", "stats"],
        queryFn: async () => {
            const response = await apiClient.get("/admin/tracks/stats")
            return response.data
        }
    })

    const handleViewTrack = (trackId: string) => {
        router.push(`/dashboard/admin/track/${trackId}`)
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-black p-4 md:p-8 relative overflow-hidden">
            {/* Grid background */}
            <div
                className="fixed inset-0 opacity-20"
                style={{
                    backgroundImage: `linear-gradient(#ff2cc9 1px, transparent 1px), linear-gradient(90deg, #ff2cc9 1px, transparent 1px)`,
                    backgroundSize: "40px 40px",
                    backgroundPosition: "-1px -1px",
                    perspective: "500px",
                    transform: "rotateX(60deg)",
                    transformOrigin: "center top",
                }}
            />

            {/* Sun/horizon glow */}
            <div className="fixed bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-fuchsia-600 to-transparent opacity-20" />

            {/* Main content */}
            <div className="relative z-10 max-w-7xl mx-auto">
                <Link
                    href="/dashboard/admin"
                    className="inline-flex items-center text-purple-300 hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Admin Dashboard
                </Link>

                <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-8">
                    <h1 className="text-2xl font-bold text-cyan-400 mb-6">Track Management</h1>

                    {/* Stats Cards */}
                    {statsData && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <div className="bg-indigo-900/50 border border-indigo-800 rounded-lg p-4">
                                <h3 className="text-sm text-gray-400 mb-1">Pending Review</h3>
                                <p className="text-2xl font-bold text-fuchsia-400">{statsData.pending_count}</p>
                            </div>
                            <div className="bg-indigo-900/50 border border-indigo-800 rounded-lg p-4">
                                <h3 className="text-sm text-gray-400 mb-1">Approved</h3>
                                <p className="text-2xl font-bold text-emerald-400">{statsData.approved_count}</p>
                            </div>
                            <div className="bg-indigo-900/50 border border-indigo-800 rounded-lg p-4">
                                <h3 className="text-sm text-gray-400 mb-1">Rejected</h3>
                                <p className="text-2xl font-bold text-red-400">{statsData.rejected_count}</p>
                            </div>
                            <div className="bg-indigo-900/50 border border-indigo-800 rounded-lg p-4">
                                <h3 className="text-sm text-gray-400 mb-1">Approval Rate</h3>
                                <p className="text-2xl font-bold text-cyan-400">{statsData.approval_rate}%</p>
                            </div>
                        </div>
                    )}

                    {/* Filter Controls */}
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                        <div className="flex items-center text-sm text-gray-300">
                            <Filter className="w-4 h-4 mr-1" />
                            <span>Filter:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setFilter("pending")}
                                className={`px-3 py-1 rounded-full text-xs ${filter === "pending"
                                    ? "bg-fuchsia-500 text-white"
                                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                                    }`}
                            >
                                Pending
                            </button>
                            <button
                                onClick={() => setFilter("approved")}
                                className={`px-3 py-1 rounded-full text-xs ${filter === "approved"
                                    ? "bg-emerald-500 text-white"
                                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                                    }`}
                            >
                                Approved
                            </button>
                            <button
                                onClick={() => setFilter("rejected")}
                                className={`px-3 py-1 rounded-full text-xs ${filter === "rejected"
                                    ? "bg-red-500 text-white"
                                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                                    }`}
                            >
                                Rejected
                            </button>
                            <button
                                onClick={() => setFilter("all")}
                                className={`px-3 py-1 rounded-full text-xs ${filter === "all"
                                    ? "bg-cyan-500 text-white"
                                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                                    }`}
                            >
                                All Tracks
                            </button>
                        </div>
                    </div>

                    {/* Tracks Table */}
                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-fuchsia-500"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-400 py-8">
                            Failed to load tracks. Please try again.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[800px]">
                                <thead>
                                    <tr className="border-b border-indigo-800/50">
                                        <th className="py-3 px-4 text-left text-cyan-300 font-medium">Track Name</th>
                                        <th className="py-3 px-4 text-left text-cyan-300 font-medium">Artist</th>
                                        <th className="py-3 px-4 text-left text-cyan-300 font-medium">Genre</th>
                                        <th className="py-3 px-4 text-left text-cyan-300 font-medium">Submitted</th>
                                        <th className="py-3 px-4 text-left text-cyan-300 font-medium">Status</th>
                                        <th className="py-3 px-4 text-right text-cyan-300 font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.tracks?.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="py-8 text-center text-cyan-300">
                                                No tracks found with the selected filter.
                                            </td>
                                        </tr>
                                    ) : (
                                        data?.tracks?.map((track: any) => (
                                            <tr key={track.id} className="border-b border-indigo-800/30 hover:bg-indigo-900/20 transition-colors">
                                                <td className="py-3 px-4 text-left text-cyan-300">{track.title}</td>
                                                <td className="py-3 px-4 text-left text-cyan-300">{track.artist?.name || "Unknown Artist"}</td>
                                                <td className="py-3 px-4 text-left text-cyan-300">{track.genre || "Unspecified"}</td>
                                                <td className="py-3 px-4 text-left text-cyan-300">{new Date(track.created_at).toLocaleDateString()}</td>
                                                <td className="py-3 px-4 text-left text-cyan-300">{track.status === "pending" ? "Pending Review" : track.status === "approved" ? "Approved" : "Rejected"}</td>
                                                <td className="py-3 px-4 text-right text-cyan-300">
                                                    <button
                                                        onClick={() => handleViewTrack(track.id)}
                                                        className="text-cyan-300 hover:text-cyan-400"
                                                    >
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
} 