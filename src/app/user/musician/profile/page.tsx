"use client"

import { useState } from "react"
import {
    Music,
    Headphones,
    Shield,
    Search,
    Grid,
    List,
    Plus,
    ArrowLeft,
    Play,
    Pause,
    Download,
    Share2,
    MoreHorizontal,
    Calendar,
    Clock,
    X,
    FileMusic,
    ImageIcon,
} from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

type UserRole = "musician" | "fan" | "admin"

interface MusicAsset {
    id: string
    title: string
    type: "track" | "album" | "sample"
    cover: string
    releaseDate: string
    duration?: string
    plays?: number
    downloads?: number
}

export default function UserProfile() {
    const router = useRouter();
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [searchQuery, setSearchQuery] = useState("")
    const [showAddAssetModal, setShowAddAssetModal] = useState(false)
    const [isPlaying, setIsPlaying] = useState<string | null>(null)

    // Mock user data
    const user = {
        id: "USR001",
        name: "Alex Johnson",
        email: "alex@example.com",
        avatar: "/placeholder.svg?height=120&width=120",
        role: "musician" as UserRole,
        joined: "Jun 15, 2023",
        lastActive: "2 hours ago",
        bio: "Electronic music producer and DJ based in Los Angeles. Creating immersive soundscapes and rhythmic journeys since 2015.",
        followers: 1240,
        following: 352,
        website: "https://alexjohnson.music",
        socialLinks: {
            twitter: "https://twitter.com/alexjohnson",
            instagram: "https://instagram.com/alexjohnson",
            soundcloud: "https://soundcloud.com/alexjohnson",
        },
    }

    // Mock music assets
    const musicAssets: MusicAsset[] = [
        {
            id: "TRK001",
            title: "Neon Dreams",
            type: "track",
            cover: "/placeholder.svg?height=300&width=300",
            releaseDate: "Jun 15, 2023",
            duration: "3:45",
            plays: 12500,
            downloads: 450,
        },
        {
            id: "TRK002",
            title: "Midnight Run",
            type: "track",
            cover: "/placeholder.svg?height=300&width=300",
            releaseDate: "Jul 22, 2023",
            duration: "4:12",
            plays: 8300,
            downloads: 320,
        },
        {
            id: "ALB001",
            title: "Synthwave Journeys",
            type: "album",
            cover: "/placeholder.svg?height=300&width=300",
            releaseDate: "Aug 10, 2023",
            plays: 45000,
            downloads: 1200,
        },
        {
            id: "SMP001",
            title: "Retro Drum Kit",
            type: "sample",
            cover: "/placeholder.svg?height=300&width=300",
            releaseDate: "Sep 05, 2023",
            downloads: 2300,
        },
        {
            id: "TRK003",
            title: "Cyber Sunset",
            type: "track",
            cover: "/placeholder.svg?height=300&width=300",
            releaseDate: "Oct 18, 2023",
            duration: "5:30",
            plays: 6200,
            downloads: 280,
        },
    ]

    // Filter assets based on search query
    const filteredAssets = musicAssets.filter((asset) => asset.title.toLowerCase().includes(searchQuery.toLowerCase()))

    const getRoleIcon = (role: UserRole) => {
        switch (role) {
            case "admin":
                return <Shield className="h-5 w-5 text-amber-400" />
            case "musician":
                return <Music className="h-5 w-5 text-fuchsia-400" />
            case "fan":
                return <Headphones className="h-5 w-5 text-cyan-400" />
        }
    }

    const getRoleColor = (role: UserRole) => {
        switch (role) {
            case "admin":
                return "text-amber-400"
            case "musician":
                return "text-fuchsia-400"
            case "fan":
                return "text-cyan-400"
        }
    }

    const getAssetTypeIcon = (type: MusicAsset["type"]) => {
        switch (type) {
            case "track":
                return <Music className="h-4 w-4" />
            case "album":
                return <FileMusic className="h-4 w-4" />
            case "sample":
                return <Download className="h-4 w-4" />
        }
    }

    const togglePlay = (id: string) => {
        if (isPlaying === id) {
            setIsPlaying(null)
        } else {
            setIsPlaying(id)
        }
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
                {/* Back button */}
                <button onClick={() => router.push('/dashboard/musician')} className="mb-6 flex items-center gap-2 text-cyan-300 hover:text-cyan-100 transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Dashboard</span>
                </button>

                {/* User Profile Section */}
                <div className="bg-gradient-to-br from-gray-900 to-indigo-950 rounded-lg shadow-[0_0_15px_rgba(255,44,201,0.3)] border border-fuchsia-500/30 p-6 backdrop-blur-sm mb-8">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Avatar and basic info */}
                        <div className="flex flex-col items-center md:items-start">
                            <div className="h-32 w-32 rounded-full bg-gradient-to-br from-cyan-400 to-fuchsia-500 p-0.5 shadow-[0_0_15px_rgba(255,44,201,0.5)] mb-4">
                                <div className="h-full w-full rounded-full overflow-hidden">
                                    <Image
                                        src={user.avatar || "/placeholder.svg"}
                                        alt={user.name}
                                        width={120}
                                        height={120}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                                {getRoleIcon(user.role)}
                                <span className={`${getRoleColor(user.role)} capitalize`}>{user.role}</span>
                            </div>
                            <div className="text-sm text-cyan-300/70 flex items-center gap-2 mb-4">
                                <Calendar className="h-4 w-4" />
                                <span>Joined {user.joined}</span>
                            </div>
                            <div className="flex gap-4 text-sm">
                                <div className="text-center">
                                    <div className="text-fuchsia-400 font-bold">{user.followers.toLocaleString()}</div>
                                    <div className="text-cyan-300/70">Followers</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-fuchsia-400 font-bold">{user.following.toLocaleString()}</div>
                                    <div className="text-cyan-300/70">Following</div>
                                </div>
                            </div>
                        </div>

                        {/* User details */}
                        <div className="flex-1">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                                <div>
                                    <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 tracking-wider">
                                        {user.name}
                                    </h1>
                                    <p className="text-cyan-300 opacity-80">{user.email}</p>
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={() => router.push('/user/profile')} className="px-4 py-2 rounded font-medium bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white shadow-[0_0_10px_rgba(232,121,249,0.5)] hover:shadow-[0_0_15px_rgba(232,121,249,0.7)] transition-all">
                                        Edit Profile
                                    </button>
                                    <button className="px-4 py-2 rounded font-medium border border-cyan-400/50 text-cyan-300 hover:bg-cyan-950/30 transition-all">
                                        Follow
                                    </button>
                                </div>
                            </div>
                            <div className="mb-6">
                                <h3 className="text-fuchsia-400 font-medium mb-2">Bio</h3>
                                <p className="text-cyan-100">{user.bio}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-fuchsia-400 font-medium mb-2">Contact</h3>
                                    <div className="text-cyan-100">
                                        <p className="mb-1">
                                            <span className="text-cyan-300/70">Website:</span>{" "}
                                            <a href={user.website} className="hover:text-cyan-300 transition-colors">
                                                {user.website.replace("https://", "")}
                                            </a>
                                        </p>
                                        <div className="flex gap-3 mt-2">
                                            <a
                                                href={user.socialLinks.twitter}
                                                className="p-2 rounded-full bg-indigo-950/50 border border-cyan-500/30 text-cyan-300 hover:bg-indigo-900/50 transition-colors"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                                                </svg>
                                            </a>
                                            <a
                                                href={user.socialLinks.instagram}
                                                className="p-2 rounded-full bg-indigo-950/50 border border-fuchsia-500/30 text-fuchsia-400 hover:bg-indigo-900/50 transition-colors"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                                                </svg>
                                            </a>
                                            <a
                                                href={user.socialLinks.soundcloud}
                                                className="p-2 rounded-full bg-indigo-950/50 border border-amber-500/30 text-amber-400 hover:bg-indigo-900/50 transition-colors"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="M2 12h1" />
                                                    <path d="M6 12h1" />
                                                    <path d="M10 12h1" />
                                                    <path d="M14 12h1" />
                                                    <path d="M18 12h1" />
                                                    <path d="M22 12h1" />
                                                    <path d="M2 16h1" />
                                                    <path d="M6 16h1" />
                                                    <path d="M10 16h1" />
                                                    <path d="M14 16h1" />
                                                    <path d="M18 16h1" />
                                                    <path d="M22 16h1" />
                                                    <path d="M2 20h1" />
                                                    <path d="M6 20h1" />
                                                    <path d="M10 20h1" />
                                                    <path d="M14 20h1" />
                                                    <path d="M18 20h1" />
                                                    <path d="M22 20h1" />
                                                    <path d="M2 8h1" />
                                                    <path d="M6 8h1" />
                                                    <path d="M10 8h1" />
                                                    <path d="M14 8h1" />
                                                    <path d="M18 8h1" />
                                                    <path d="M22 8h1" />
                                                    <path d="M2 4h1" />
                                                    <path d="M6 4h1" />
                                                    <path d="M10 4h1" />
                                                    <path d="M14 4h1" />
                                                    <path d="M18 4h1" />
                                                    <path d="M22 4h1" />
                                                </svg>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-fuchsia-400 font-medium mb-2">Activity</h3>
                                    <div className="text-cyan-100">
                                        <p className="mb-1">
                                            <span className="text-cyan-300/70">Last active:</span> {user.lastActive}
                                        </p>
                                        <p className="mb-1">
                                            <span className="text-cyan-300/70">Total plays:</span>{" "}
                                            {musicAssets.reduce((sum, asset) => sum + (asset.plays || 0), 0).toLocaleString()}
                                        </p>
                                        <p>
                                            <span className="text-cyan-300/70">Total downloads:</span>{" "}
                                            {musicAssets.reduce((sum, asset) => sum + (asset.downloads || 0), 0).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Music Assets Section */}
                <div className="bg-gradient-to-br from-gray-900 to-indigo-950 rounded-lg shadow-[0_0_15px_rgba(255,44,201,0.3)] border border-fuchsia-500/30 p-6 backdrop-blur-sm">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
                            MUSIC ASSETS
                        </h2>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cyan-300/50" />
                                <input
                                    type="text"
                                    placeholder="Search assets..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-indigo-950/50 border border-cyan-500/30 rounded-md py-2 pl-10 pr-4 text-cyan-100 placeholder-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                                />
                            </div>
                            <div className="flex rounded-md overflow-hidden">
                                <button
                                    className={`p-2 ${viewMode === "grid" ? "bg-fuchsia-600 text-white" : "bg-indigo-950/50 text-fuchsia-400"
                                        } transition-colors`}
                                    onClick={() => setViewMode("grid")}
                                >
                                    <Grid className="h-5 w-5" />
                                </button>
                                <button
                                    className={`p-2 ${viewMode === "list" ? "bg-fuchsia-600 text-white" : "bg-indigo-950/50 text-fuchsia-400"
                                        } transition-colors`}
                                    onClick={() => setViewMode("list")}
                                >
                                    <List className="h-5 w-5" />
                                </button>
                            </div>
                            <button
                                className="px-4 py-2 rounded font-medium bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white shadow-[0_0_10px_rgba(232,121,249,0.5)] hover:shadow-[0_0_15px_rgba(232,121,249,0.7)] transition-all flex items-center gap-2"
                                onClick={() => router.push('/vsl')}
                            >
                                <Plus className="h-4 w-4" />
                                <span>Add Asset</span>
                            </button>
                        </div>
                    </div>

                    {/* Grid View */}
                    {viewMode === "grid" && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredAssets.map((asset) => (
                                <div
                                    key={asset.id}
                                    className="bg-indigo-950/50 rounded-lg overflow-hidden border border-fuchsia-500/30 hover:shadow-[0_0_10px_rgba(255,44,201,0.4)] transition-all"
                                >
                                    <div className="aspect-square relative group">
                                        <Image
                                            src={asset.cover || "/placeholder.svg"}
                                            alt={asset.title}
                                            width={300}
                                            height={300}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            {asset.type === "track" && (
                                                <button
                                                    className="p-4 rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white shadow-[0_0_15px_rgba(232,121,249,0.7)] transform scale-90 group-hover:scale-100 transition-transform"
                                                    onClick={() => togglePlay(asset.id)}
                                                >
                                                    {isPlaying === asset.id ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
                                                </button>
                                            )}
                                        </div>
                                        <div className="absolute top-2 right-2">
                                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-900/80 text-cyan-300 border border-cyan-500/30 capitalize">
                                                {asset.type}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold text-fuchsia-400 mb-1">{asset.title}</h3>
                                        <div className="flex items-center gap-2 text-xs text-cyan-300/70 mb-3">
                                            <Calendar className="h-3 w-3" />
                                            <span>{asset.releaseDate}</span>
                                            {asset.duration && (
                                                <>
                                                    <span>•</span>
                                                    <Clock className="h-3 w-3" />
                                                    <span>{asset.duration}</span>
                                                </>
                                            )}
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div className="flex gap-4">
                                                {asset.plays !== undefined && (
                                                    <div className="flex items-center gap-1 text-cyan-300">
                                                        <Play className="h-3 w-3" />
                                                        <span>{asset.plays.toLocaleString()}</span>
                                                    </div>
                                                )}
                                                {asset.downloads !== undefined && (
                                                    <div className="flex items-center gap-1 text-cyan-300">
                                                        <Download className="h-3 w-3" />
                                                        <span>{asset.downloads.toLocaleString()}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex gap-1">
                                                <button className="p-1.5 rounded-md hover:bg-indigo-800/50 transition-colors text-cyan-300">
                                                    <Share2 className="h-4 w-4" />
                                                </button>
                                                <button className="p-1.5 rounded-md hover:bg-indigo-800/50 transition-colors text-cyan-300">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* List View */}
                    {viewMode === "list" && (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[800px]">
                                <thead>
                                    <tr className="border-b border-indigo-800/50">
                                        <th className="py-3 px-4 text-left text-cyan-300 font-medium">Asset</th>
                                        <th className="py-3 px-4 text-left text-cyan-300 font-medium">Type</th>
                                        <th className="py-3 px-4 text-left text-cyan-300 font-medium">Release Date</th>
                                        <th className="py-3 px-4 text-left text-cyan-300 font-medium">Duration</th>
                                        <th className="py-3 px-4 text-left text-cyan-300 font-medium">Plays</th>
                                        <th className="py-3 px-4 text-left text-cyan-300 font-medium">Downloads</th>
                                        <th className="py-3 px-4 text-right text-cyan-300 font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredAssets.map((asset) => (
                                        <tr
                                            key={asset.id}
                                            className="border-b border-indigo-800/30 hover:bg-indigo-900/20 transition-colors"
                                        >
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded bg-gradient-to-br from-cyan-500 to-fuchsia-500 p-0.5 shadow-[0_0_10px_rgba(255,44,201,0.3)]">
                                                        <div className="h-full w-full rounded overflow-hidden">
                                                            <Image
                                                                src={asset.cover || "/placeholder.svg"}
                                                                alt={asset.title}
                                                                width={40}
                                                                height={40}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="font-medium text-fuchsia-400">{asset.title}</div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-1.5">
                                                    {getAssetTypeIcon(asset.type)}
                                                    <span className="text-cyan-100 capitalize">{asset.type}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-cyan-100">{asset.releaseDate}</td>
                                            <td className="py-4 px-4 text-cyan-100">{asset.duration || "-"}</td>
                                            <td className="py-4 px-4 text-cyan-100">{asset.plays?.toLocaleString() || "-"}</td>
                                            <td className="py-4 px-4 text-cyan-100">{asset.downloads?.toLocaleString() || "-"}</td>
                                            <td className="py-4 px-4">
                                                <div className="flex justify-end gap-2">
                                                    {asset.type === "track" && (
                                                        <button
                                                            className="p-1.5 rounded-md hover:bg-indigo-800/50 transition-colors text-cyan-300"
                                                            onClick={() => togglePlay(asset.id)}
                                                        >
                                                            {isPlaying === asset.id ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                                                        </button>
                                                    )}
                                                    <button className="p-1.5 rounded-md hover:bg-indigo-800/50 transition-colors text-fuchsia-400">
                                                        <Download className="h-5 w-5" />
                                                    </button>
                                                    <button className="p-1.5 rounded-md hover:bg-indigo-800/50 transition-colors text-cyan-300">
                                                        <Share2 className="h-5 w-5" />
                                                    </button>
                                                    <button className="p-1.5 rounded-md hover:bg-indigo-800/50 transition-colors text-cyan-300">
                                                        <MoreHorizontal className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination */}
                    <div className="flex justify-between items-center mt-6">
                        <div className="text-sm text-cyan-300/70">
                            Showing <span className="text-cyan-300">{filteredAssets.length}</span> of{" "}
                            <span className="text-cyan-300">{musicAssets.length}</span> assets
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="px-3 py-1.5 rounded text-sm font-medium bg-indigo-950/50 border border-cyan-500/30 text-cyan-300 hover:bg-indigo-900/50 transition-colors">
                                Previous
                            </button>
                            <button className="px-3 py-1.5 rounded text-sm font-medium bg-indigo-950/50 border border-fuchsia-500/30 text-fuchsia-400 hover:bg-indigo-900/50 transition-colors">
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
