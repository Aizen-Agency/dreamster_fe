"use client"

import { useState, useEffect } from "react"
import {
    DollarSign,
    Music,
    Crown,
    Search,
    Filter,
    MoreVertical,
    ArrowUpRight,
    Headphones,
    Bell,
    Settings,
    ExternalLink,
    Edit,
    Trash2,
} from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import Link from "next/link"
import ProfileMenu from "@/components/ProfileMenu"
import { useAuthStore } from "@/store/authStore"
import { useArtistTracks } from "@/hooks/useArtistTracks"
import { Track } from "@/types/track"

export default function ArtistDashboard() {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const { isLoggedIn, user } = useAuthStore()

    // Get user ID from auth store
    const userId = useAuthStore(state => state.user?.id)

    // Fetch artist tracks with pagination
    const { data: artistTracksData, isLoading, error } = useArtistTracks(
        userId || '',
        {
            page: currentPage,
            per_page: 10,
            sort_by: 'newest'
        }
    )

    // Filter tracks based on search query
    const filteredTracks = artistTracksData?.tracks.filter(track =>
        track.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) || []

    // Handle page navigation
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
        }
    }

    const handleNextPage = () => {
        if (artistTracksData && currentPage < artistTracksData.pages) {
            setCurrentPage(currentPage + 1)
        }
    }

    // Navigate to track edit page
    const handleEditTrack = (trackId: string) => {
        router.push(`/user/musician/upload/edit/${trackId}`)
    }

    // Navigate to track details page
    const handleViewTrack = (trackId: string) => {
        router.push(`/music/player?id=${trackId}`)
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
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-cyan-400 to-fuchsia-500 p-0.5 shadow-[0_0_15px_rgba(255,44,201,0.5)]">
                            <div className="h-full w-full rounded-full overflow-hidden">
                                <Image
                                    src={user?.avatar || "/placeholder.svg?height=60&width=60"}
                                    alt="Artist avatar"
                                    width={60}
                                    height={60}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 tracking-wider">
                                ARTIST DASHBOARD
                            </h1>
                            <p className="text-cyan-300 opacity-80">Welcome back, John Doe</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.push('/notification')} className="p-2 rounded-full bg-indigo-950/50 border border-cyan-500/30 text-cyan-300 hover:bg-indigo-900/50 transition-colors">
                            <Bell className="h-5 w-5" />
                        </button>
                        <button className="p-2 rounded-full bg-indigo-950/50 border border-cyan-500/30 text-cyan-300 hover:bg-indigo-900/50 transition-colors">
                            <Settings className="h-5 w-5" />
                        </button>
                        <ProfileMenu
                            showIcon={true}
                        />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full mb-8">
                    <button onClick={() => router.push('/dashboard/musician/withdraw')} className="px-6 py-2.5 rounded font-bold tracking-wider bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white shadow-[0_0_10px_rgba(232,121,249,0.5)] hover:shadow-[0_0_15px_rgba(232,121,249,0.7)] transition-all flex items-center justify-center gap-2 flex-1">
                        <DollarSign className="h-4 w-4" />
                        WITHDRAW EARNINGS
                    </button>
                    <button onClick={() => router.push('/music')} className="px-6 py-2.5 rounded font-bold tracking-wider bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-[0_0_10px_rgba(99,102,241,0.5)] hover:shadow-[0_0_15px_rgba(99,102,241,0.7)] transition-all flex items-center justify-center gap-2 flex-1">
                        <Headphones className="h-4 w-4" />
                        BROWSE MUSIC
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Total Earnings */}
                    <div className="bg-gradient-to-br from-gray-900 to-indigo-950 rounded-lg shadow-[0_0_15px_rgba(255,44,201,0.3)] border border-fuchsia-500/30 p-6 backdrop-blur-sm">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-cyan-300 font-medium">Total Earnings</span>
                            <div className="p-2 rounded-full bg-cyan-950/50 border border-cyan-500/30">
                                <DollarSign className="h-5 w-5 text-cyan-400" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 mb-2">
                            $24,500.00
                        </div>
                        <div className="flex items-center text-emerald-400 text-sm">
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                            <span>+12.5% from last month</span>
                        </div>
                    </div>

                    {/* Total Tokens Sold */}
                    <div className="bg-gradient-to-br from-gray-900 to-indigo-950 rounded-lg shadow-[0_0_15px_rgba(255,44,201,0.3)] border border-fuchsia-500/30 p-6 backdrop-blur-sm">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-cyan-300 font-medium">Total Tokens Sold</span>
                            <div className="p-2 rounded-full bg-fuchsia-950/50 border border-fuchsia-500/30">
                                <Music className="h-5 w-5 text-fuchsia-400" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 mb-2">
                            1,234
                        </div>
                        <div className="flex items-center text-emerald-400 text-sm">
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                            <span>+8.3% from last month</span>
                        </div>
                    </div>

                    {/* Royalty Earnings */}
                    <div className="bg-gradient-to-br from-gray-900 to-indigo-950 rounded-lg shadow-[0_0_15px_rgba(255,44,201,0.3)] border border-fuchsia-500/30 p-6 backdrop-blur-sm">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-cyan-300 font-medium">Royalty Earnings</span>
                            <div className="p-2 rounded-full bg-amber-950/50 border border-amber-500/30">
                                <Crown className="h-5 w-5 text-amber-400" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 mb-2">
                            $3,450.00
                        </div>
                        <div className="flex items-center text-emerald-400 text-sm">
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                            <span>+18.2% from last month</span>
                        </div>
                    </div>
                </div>

                {/* Tracks Table */}
                <div className="bg-gradient-to-br from-gray-900 to-indigo-950 rounded-lg shadow-[0_0_15px_rgba(255,44,201,0.3)] border border-fuchsia-500/30 p-6 backdrop-blur-sm">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
                            YOUR TOKENIZED TRACKS
                        </h2>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cyan-300/50" />
                                <input
                                    type="text"
                                    placeholder="Search tracks..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-indigo-950/50 border border-cyan-500/30 rounded-md py-2 pl-10 pr-4 text-cyan-100 placeholder-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                                />
                            </div>
                            <button className="p-2 bg-indigo-950/50 border border-fuchsia-500/30 rounded-md text-fuchsia-400 hover:bg-indigo-900/50 transition-colors">
                                <Filter className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

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
                                        <th className="py-3 px-4 text-left text-cyan-300 font-medium">Tokens</th>
                                        <th className="py-3 px-4 text-left text-cyan-300 font-medium">Price</th>
                                        <th className="py-3 px-4 text-left text-cyan-300 font-medium">Earnings</th>
                                        <th className="py-3 px-4 text-left text-cyan-300 font-medium">Status</th>
                                        <th className="py-3 px-4 text-right text-cyan-300 font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTracks.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="py-8 text-center text-cyan-300">
                                                No tracks found. Try a different search or upload your first track.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredTracks.map((track) => (
                                            <tr key={track.id} className="border-b border-indigo-800/30 hover:bg-indigo-900/20 transition-colors">
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded bg-gradient-to-br from-cyan-500 to-fuchsia-500 p-0.5 shadow-[0_0_10px_rgba(255,44,201,0.3)]">
                                                            <div className="h-full w-full rounded overflow-hidden">
                                                                <Image
                                                                    src={track.artwork_url || "/placeholder.svg"}
                                                                    alt={track.title}
                                                                    width={40}
                                                                    height={40}
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-fuchsia-400">{track.title}</div>
                                                            <div className="text-xs text-cyan-300/70">
                                                                Released: {new Date(track.created_at).toLocaleDateString()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 text-cyan-300">
                                                    {/* Mock data for tokens - would come from blockchain integration */}
                                                    <div className="font-medium">100</div>
                                                    <div className="text-xs text-cyan-300/70">Available: 75</div>
                                                </td>
                                                <td className="py-4 px-4 text-cyan-300">
                                                    ${track.starting_price?.toFixed(2) || "0.00"}
                                                </td>
                                                <td className="py-4 px-4 text-cyan-300">
                                                    {/* Mock data for earnings */}
                                                    <div className="font-medium">$125.50</div>
                                                    <div className="text-xs text-cyan-300/70">+$12.25 this week</div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-900/30 text-green-400 border border-green-500/30">
                                                        Active
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleViewTrack(track.id)}
                                                            className="p-1.5 rounded-md hover:bg-indigo-800/50 transition-colors text-cyan-300"
                                                            title="View Track"
                                                        >
                                                            <ExternalLink className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleEditTrack(track.id)}
                                                            className="p-1.5 rounded-md hover:bg-indigo-800/50 transition-colors text-fuchsia-400"
                                                            title="Edit Track"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            className="p-1.5 rounded-md hover:bg-indigo-800/50 transition-colors text-red-400"
                                                            title="Delete Track"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination */}
                    {artistTracksData && artistTracksData.pages > 1 && (
                        <div className="flex justify-between items-center mt-6">
                            <div className="text-sm text-cyan-300/70">
                                Showing <span className="text-cyan-300">{filteredTracks.length}</span> of{" "}
                                <span className="text-cyan-300">{artistTracksData.total}</span> tracks
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handlePreviousPage}
                                    disabled={currentPage === 1}
                                    className={`px-3 py-1.5 rounded text-sm font-medium ${currentPage === 1
                                        ? "bg-indigo-950/30 border border-cyan-500/10 text-cyan-300/50"
                                        : "bg-indigo-950/50 border border-cyan-500/30 text-cyan-300 hover:bg-indigo-900/50 transition-colors"
                                        }`}
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={handleNextPage}
                                    disabled={!artistTracksData || currentPage >= artistTracksData.pages}
                                    className={`px-3 py-1.5 rounded text-sm font-medium ${!artistTracksData || currentPage >= artistTracksData.pages
                                        ? "bg-indigo-950/30 border border-fuchsia-500/10 text-fuchsia-400/50"
                                        : "bg-indigo-950/50 border border-fuchsia-500/30 text-fuchsia-400 hover:bg-indigo-900/50 transition-colors"
                                        }`}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}


