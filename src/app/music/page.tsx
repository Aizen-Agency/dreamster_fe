"use client"

import { useState, useMemo, useEffect } from "react"
import {
    Search,
    Filter,
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Volume2,
    Heart,
    Plus,
    Music,
    Disc,
    Mic,
    Radio,
    Sparkles,
    ChevronRight,
    MoreHorizontal,
} from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useTracksList, useTrackLikes } from "@/hooks/useTrackExplorer"
import { usePlayerStore } from "@/store/playerStore"
import { Track } from "@/types/track"

export default function BrowseMusic() {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")
    const [activeGenre, setActiveGenre] = useState("all")
    const [sortOption, setSortOption] = useState<'newest' | 'popular' | 'created_at'>('newest')

    // Get player state from store
    const {
        currentTrack,
        isPlaying,
        setCurrentTrack,
        setIsPlaying
    } = usePlayerStore()

    // Fetch tracks with our hook
    const { data: tracksData, isLoading, error } = useTracksList({
        genre: activeGenre !== 'all' ? activeGenre : undefined,
        sort_by: sortOption,
        per_page: 12
    })

    // Track likes functionality
    const { likeTrack, unlikeTrack } = useTrackLikes()

    // Handle play button click
    const handlePlayTrack = (track: Track) => {
        if (currentTrack?.id === track.id) {
            // Toggle play/pause if it's the current track
            setIsPlaying(!isPlaying)
        } else {
            // Set new track and start playing
            setCurrentTrack(track)
            setIsPlaying(true)

            // Navigate to player page
            router.push(`/music/player?id=${track.id}`)
        }
    }

    // Filter tracks based on search query
    const filteredTracks = useMemo(() => {
        if (!tracksData?.tracks) return []

        return tracksData.tracks.filter(track =>
            track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            track.artist.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [tracksData, searchQuery])

    const genres = [
        { id: "all", name: "All Genres", icon: Music },
        { id: "synthwave", name: "Synthwave", icon: Radio },
        { id: "electronic", name: "Electronic", icon: Disc },
        { id: "lofi", name: "Lo-Fi", icon: Mic },
        { id: "ambient", name: "Ambient", icon: Sparkles },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-black relative overflow-hidden">
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
            <div className="relative z-10 max-w-7xl mx-auto p-4 md:p-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 tracking-wider">
                            BROWSE MUSIC
                        </h1>
                        <p className="text-cyan-300 opacity-80">Discover new tracks and artists</p>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cyan-300/50" />
                            <input
                                type="text"
                                placeholder="Search artists, songs, albums..."
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

                {/* Genre Filter */}
                <div className="overflow-x-auto pb-4 mb-8">
                    <div className="flex space-x-4 min-w-max">
                        {genres.map((genre) => (
                            <button
                                key={genre.id}
                                onClick={() => setActiveGenre(genre.id)}
                                className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all ${activeGenre === genre.id
                                        ? "bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white shadow-[0_0_10px_rgba(232,121,249,0.5)]"
                                        : "bg-indigo-950/50 border border-fuchsia-500/30 text-cyan-300 hover:border-fuchsia-400"
                                    }`}
                            >
                                <genre.icon className="h-4 w-4" />
                                <span>{genre.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Sort options */}
                <div className="flex justify-end mb-6">
                    <div className="flex items-center gap-4 text-sm">
                        <span className="text-cyan-300">Sort by:</span>
                        <button
                            onClick={() => setSortOption('newest')}
                            className={`${sortOption === 'newest'
                                    ? 'text-fuchsia-400 font-medium'
                                    : 'text-cyan-300/70 hover:text-cyan-300'
                                }`}
                        >
                            Newest
                        </button>
                        <button
                            onClick={() => setSortOption('popular')}
                            className={`${sortOption === 'popular'
                                    ? 'text-fuchsia-400 font-medium'
                                    : 'text-cyan-300/70 hover:text-cyan-300'
                                }`}
                        >
                            Most Popular
                        </button>
                    </div>
                </div>

                {/* Tracks Grid */}
                <div className="mb-16">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
                            {activeGenre === 'all' ? 'ALL TRACKS' : genres.find(g => g.id === activeGenre)?.name.toUpperCase()}
                        </h2>
                        <button className="flex items-center text-sm text-cyan-300 hover:text-fuchsia-400 transition-colors">
                            View All <ChevronRight className="h-4 w-4 ml-1" />
                        </button>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-fuchsia-500"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-400 py-8">
                            Failed to load tracks. Please try again.
                        </div>
                    ) : filteredTracks.length === 0 ? (
                        <div className="text-center text-cyan-300 py-8">
                            No tracks found. Try a different search or genre.
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {filteredTracks.map((track) => (
                                <div key={track.id} className="group relative rounded-lg overflow-hidden aspect-square">
                                    <div className="relative aspect-square">
                                        <Image
                                            src={track.artwork_url || "/placeholder.svg"}
                                            alt={track.title}
                                            width={300}
                                            height={300}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-indigo-950 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button
                                                onClick={() => handlePlayTrack(track)}
                                                className="p-4 rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white shadow-[0_0_15px_rgba(232,121,249,0.7)] transform scale-0 group-hover:scale-100 transition-transform"
                                            >
                                                <Play className="h-6 w-6" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-3 bg-indigo-950/80 backdrop-blur-sm">
                                        <h3 className="font-medium text-fuchsia-400 truncate">{track.title}</h3>
                                        <p className="text-sm text-cyan-300 truncate">{track.artist.name}</p>
                                        <div className="flex justify-between items-center mt-2">
                                            <button
                                                onClick={() => handlePlayTrack(track)}
                                                className="p-2 rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white shadow-[0_0_10px_rgba(232,121,249,0.5)]"
                                            >
                                                <Play className="h-4 w-4" />
                                            </button>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => likeTrack(track.id)}
                                                    className="p-2 rounded-full bg-indigo-900/70 text-cyan-300 hover:text-cyan-100"
                                                >
                                                    <Heart className="h-4 w-4" fill={track.likes ? "currentColor" : "none"} />
                                                </button>
                                                <button className="p-2 rounded-full bg-indigo-900/70 text-cyan-300 hover:text-cyan-100">
                                                    <Plus className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {tracksData && tracksData.pages > 1 && (
                        <div className="flex justify-center mt-8">
                            <div className="flex space-x-2">
                                {Array.from({ length: tracksData.pages }, (_, i) => (
                                    <button
                                        key={i}
                                        className={`w-8 h-8 rounded-full flex items-center justify-center ${tracksData.current_page === i + 1
                                                ? "bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white"
                                                : "bg-indigo-950/50 border border-fuchsia-500/30 text-cyan-300"
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}