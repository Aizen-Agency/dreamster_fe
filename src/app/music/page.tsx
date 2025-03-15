"use client"

import { useState, useMemo } from "react"
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

export default function BrowseMusic() {
    const [isPlaying, setIsPlaying] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [activeGenre, setActiveGenre] = useState("all")

    const [sortOption, setSortOption] = useState("newest")

    const [newReleases, setNewReleases] = useState([
        {
            id: 1,
            title: "Cyber Dreams",
            artist: "Neon Pulse",
            cover: "/placeholder.svg?height=200&width=200",
            releaseDate: new Date("2025-03-01"),
            views: 150000,
        },
        {
            id: 2,
            title: "Digital Horizon",
            artist: "Pixel Wave",
            cover: "/placeholder.svg?height=200&width=200",
            releaseDate: new Date("2025-02-15"),
            views: 120000,
        },
        {
            id: 3,
            title: "Synthwave Vibes",
            artist: "Retrowave",
            cover: "/placeholder.svg?height=200&width=200",
            releaseDate: new Date("2025-02-01"),
            views: 180000,
        },
        {
            id: 4,
            title: "Neon Lights",
            artist: "Cyber Echo",
            cover: "/placeholder.svg?height=200&width=200",
            releaseDate: new Date("2025-01-20"),
            views: 90000,
        },
        {
            id: 5,
            title: "Electric Soul",
            artist: "Neon Pulse",
            cover: "/placeholder.svg?height=200&width=200",
            releaseDate: new Date("2025-01-10"),
            views: 110000,
        },
        {
            id: 6,
            title: "Future Retro",
            artist: "Pixel Wave",
            cover: "/placeholder.svg?height=200&width=200",
            releaseDate: new Date("2024-12-25"),
            views: 130000,
        },
        {
            id: 7,
            title: "Midnight Drive",
            artist: "Retrowave",
            cover: "/placeholder.svg?height=200&width=200",
            releaseDate: new Date("2024-12-15"),
            views: 95000,
        },
        {
            id: 8,
            title: "Cyber Punk",
            artist: "Neon Pulse",
            cover: "/placeholder.svg?height=200&width=200",
            releaseDate: new Date("2024-12-01"),
            views: 140000,
        },
        {
            id: 9,
            title: "Retro Future",
            artist: "Cyber Echo",
            cover: "/placeholder.svg?height=200&width=200",
            releaseDate: new Date("2024-11-20"),
            views: 105000,
        },
        {
            id: 10,
            title: "Neon Dreams",
            artist: "Pixel Wave",
            cover: "/placeholder.svg?height=200&width=200",
            releaseDate: new Date("2024-11-10"),
            views: 125000,
        },
        {
            id: 11,
            title: "Synth City",
            artist: "Retrowave",
            cover: "/placeholder.svg?height=200&width=200",
            releaseDate: new Date("2024-11-01"),
            views: 115000,
        },
        {
            id: 12,
            title: "Digital Love",
            artist: "Neon Pulse",
            cover: "/placeholder.svg?height=200&width=200",
            releaseDate: new Date("2024-10-25"),
            views: 135000,
        },
    ])

    // Sample data
    const featuredAlbums = [
        {
            id: 2,
            title: "Digital Sunset",
            artist: "Pixel Wave",
            cover: "/placeholder.svg?height=300&width=300",
            tracks: 10,
            duration: "42 min",
        },
        {
            id: 3,
            title: "Synthwave Nights",
            artist: "Retrowave",
            cover: "/placeholder.svg?height=300&width=300",
            tracks: 8,
            duration: "36 min",
        },
        {
            id: 4,
            title: "Future Nostalgia",
            artist: "Neon Pulse",
            cover: "/placeholder.svg?height=300&width=300",
            tracks: 14,
            duration: "52 min",
        },
    ]

    const sortedReleases = useMemo(() => {
        return [...newReleases].sort((a, b) => {
            if (sortOption === "newest") {
                return b.releaseDate.getTime() - a.releaseDate.getTime()
            } else if (sortOption === "oldest") {
                return a.releaseDate.getTime() - b.releaseDate.getTime()
            } else if (sortOption === "views") {
                return b.views - a.views
            }
            return 0
        })
    }, [sortOption, newReleases])

    const genres = [
        { id: "all", name: "All Genres", icon: Music },
        { id: "synthwave", name: "Synthwave", icon: Radio },
        { id: "electronic", name: "Electronic", icon: Disc },
        { id: "lofi", name: "Lo-Fi", icon: Mic },
        { id: "ambient", name: "Ambient", icon: Sparkles },
    ]

    const togglePlayPause = () => {
        setIsPlaying(!isPlaying)
    }

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
                <div className="mb-8 overflow-x-auto">
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

                {/* Featured Albums */}
                <div className="mb-12">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
                            FEATURED ALBUMS
                        </h2>
                        <button className="text-cyan-300 text-sm flex items-center hover:text-cyan-100 transition-colors">
                            View All <ChevronRight className="h-4 w-4 ml-1" />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredAlbums.map((album) => (
                            <div
                                key={album.id}
                                className="bg-gradient-to-br from-gray-900 to-indigo-950 rounded-lg shadow-[0_0_15px_rgba(255,44,201,0.3)] border border-fuchsia-500/30 overflow-hidden group hover:shadow-[0_0_20px_rgba(255,44,201,0.5)] transition-all"
                            >
                                <div className="relative aspect-square">
                                    <Image
                                        src={album.cover || "/placeholder.svg"}
                                        alt={album.title}
                                        width={300}
                                        height={300}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-950 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button className="p-4 rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white shadow-[0_0_15px_rgba(232,121,249,0.7)] transform scale-0 group-hover:scale-100 transition-transform">
                                            <Play className="h-6 w-6" />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-fuchsia-400 truncate">{album.title}</h3>
                                    <p className="text-cyan-300 text-sm truncate">{album.artist}</p>
                                    <div className="flex justify-between items-center mt-2 text-xs text-cyan-300/70">
                                        <span>{album.tracks} tracks</span>
                                        <span>{album.duration}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* New Releases */}
                <div className="mb-24">
                    <div className="bg-gradient-to-br from-gray-900 to-indigo-950 rounded-lg shadow-[0_0_15px_rgba(255,44,201,0.3)] border border-fuchsia-500/30 p-6 backdrop-blur-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
                                NEW RELEASES
                            </h2>
                            <div className="flex items-center gap-4">
                                <select
                                    className="bg-indigo-950/50 border border-cyan-500/30 rounded-md py-1 px-3 text-cyan-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                                    onChange={(e) => setSortOption(e.target.value)}
                                >
                                    <option value="newest">Newest</option>
                                    <option value="oldest">Oldest</option>
                                    <option value="views">Most Viewed</option>
                                </select>
                                <button className="text-cyan-300 text-sm flex items-center hover:text-cyan-100 transition-colors">
                                    View All <ChevronRight className="h-4 w-4 ml-1" />
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {sortedReleases.map((release) => (
                                <div key={release.id} className="group relative rounded-lg overflow-hidden aspect-square">
                                    <Image
                                        src={release.cover || "/placeholder.svg"}
                                        alt={release.title}
                                        width={200}
                                        height={200}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-950 via-indigo-950/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                                        <h3 className="font-medium text-fuchsia-400 truncate">{release.title}</h3>
                                        <p className="text-sm text-cyan-300 truncate">{release.artist}</p>
                                        <div className="flex justify-between items-center mt-2">
                                            <button className="p-2 rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white shadow-[0_0_10px_rgba(232,121,249,0.5)]">
                                                <Play className="h-4 w-4" />
                                            </button>
                                            <div className="flex gap-2">
                                                <button className="p-2 rounded-full bg-indigo-900/70 text-cyan-300 hover:text-cyan-100">
                                                    <Heart className="h-4 w-4" />
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
                    </div>
                </div>

                {/* Music Player */}
                <div className="fixed bottom-0 left-0 right-0 z-20">
                    <div className="bg-gradient-to-r from-gray-900 to-indigo-950 border-t border-fuchsia-500/30 shadow-[0_-5px_15px_rgba(255,44,201,0.3)] backdrop-blur-sm p-3">
                        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center gap-4">
                            {/* Track Info */}
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <div className="h-12 w-12 rounded bg-gradient-to-br from-cyan-500 to-fuchsia-500 p-0.5 shadow-[0_0_10px_rgba(255,44,201,0.3)]">
                                    <Image
                                        src="/placeholder.svg?height=60&width=60"
                                        alt="Now playing"
                                        width={60}
                                        height={60}
                                        className="h-full w-full rounded object-cover"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-medium text-fuchsia-400">Electric Dreams</h3>
                                    <p className="text-sm text-cyan-300">Cyber Echo</p>
                                </div>
                                <button className="ml-2 text-cyan-300 hover:text-cyan-100 transition-colors">
                                    <Heart className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Player Controls */}
                            <div className="flex flex-col items-center flex-1 w-full sm:w-auto">
                                <div className="flex items-center gap-4 mb-1">
                                    <button className="text-cyan-300 hover:text-cyan-100 transition-colors">
                                        <SkipBack className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={togglePlayPause}
                                        className="p-3 rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white shadow-[0_0_10px_rgba(232,121,249,0.5)] hover:shadow-[0_0_15px_rgba(232,121,249,0.7)] transition-all"
                                    >
                                        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                                    </button>
                                    <button className="text-cyan-300 hover:text-cyan-100 transition-colors">
                                        <SkipForward className="h-5 w-5" />
                                    </button>
                                </div>
                                <div className="flex items-center gap-3 w-full max-w-xl">
                                    <span className="text-xs text-cyan-300 min-w-[40px] text-right">1:45</span>
                                    <div className="h-1.5 bg-indigo-900/50 rounded-full flex-1 overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-full"
                                            style={{ width: "40%" }}
                                        ></div>
                                    </div>
                                    <span className="text-xs text-cyan-300 min-w-[40px]">3:45</span>
                                </div>
                            </div>

                            {/* Volume Control */}
                            <div className="flex items-center gap-2 w-full sm:w-auto max-w-[150px]">
                                <Volume2 className="h-5 w-5 text-cyan-300" />
                                <div className="h-1.5 bg-indigo-900/50 rounded-full flex-1 overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-full"
                                        style={{ width: "70%" }}
                                    ></div>
                                </div>
                                <button className="text-cyan-300 hover:text-cyan-100 transition-colors">
                                    <MoreHorizontal className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}