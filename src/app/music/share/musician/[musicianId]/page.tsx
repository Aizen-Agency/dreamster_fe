"use client"

import { useState, useEffect } from "react"
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
    CheckCircle,
} from "lucide-react"
import Image from "next/image"
import { useRouter, useParams } from "next/navigation"
import { useArtistTracks } from "@/hooks/useArtistTracks"
import { usePlayerStore } from "@/store/playerStore"
import { Track } from "@/types/track"
import { useUserProfile } from "@/hooks/useProfile"
import { useSetUserRole } from "@/hooks/useAuth"
import { useMusician } from "@/hooks/useMusician"
import { useRecordTrackShare } from "@/hooks/useSharedTrack"

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
    const params = useParams();
    const musicianId = params.musicianId as string;
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [searchQuery, setSearchQuery] = useState("")
    const [showAddAssetModal, setShowAddAssetModal] = useState(false)
    const [isPlaying, setIsPlaying] = useState<string | null>(null)

    const { currentTrack, isPlaying: playerIsPlaying, setCurrentTrack, setIsPlaying: setPlayerIsPlaying } = usePlayerStore()
    // Fetch musician data
    const { data: musicianData, isLoading: musicianLoading, error: musicianError } = useMusician(musicianId)
    // Fetch artist tracks
    const { data: artistTracksData, isLoading, error } = useArtistTracks(
        musicianId,
        {
            per_page: 12,
            sort_by: 'newest'
        }
    )

    // Filter tracks based on search query
    const filteredTracks = artistTracksData?.tracks.filter(track =>
        track.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) || []

    // Handle play button click
    const handlePlayTrack = (track: Track) => {
        if (currentTrack?.id === track.id) {
            // Toggle play/pause if it's the current track
            router.push(`/music/player?id=${track.id}`)
        } else {
            // Set new track and start playing
            setCurrentTrack(track)
            setPlayerIsPlaying(true)
        }
    }

    // User data from API
    const user = {
        id: musicianData?.id,
        name: musicianData?.username,
        email: musicianData?.email,
        avatar: musicianData?.avatar,
        role: musicianData?.role as UserRole,
        joined: musicianData?.createdAt,
        lastActive: musicianData?.lastActive,
        bio: musicianData?.bio || "Electronic music producer and DJ based in Los Angeles. Creating immersive soundscapes and rhythmic journeys since 2015.",
        followers: musicianData?.followers || 0,
        following: musicianData?.following || 0,
        website: musicianData?.website || "https://alexjohnson.music",
        socialLinks: {
            twitter: musicianData?.socialLinks?.twitter || "https://twitter.com/alexjohnson",
            instagram: musicianData?.socialLinks?.instagram || "https://instagram.com/alexjohnson",
            soundcloud: musicianData?.socialLinks?.soundcloud || "https://soundcloud.com/alexjohnson",
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

    function handleDownloadTrack(track: Track): void {
        const downloadUrl = track.audio_url;
        if (downloadUrl) {
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = `${track.title}.mp3`;
            a.click();
        }
    }

    // Add the share track mutation
    const { mutate: recordTrackShare } = useRecordTrackShare();

    // Add state for share notification
    const [shareNotification, setShareNotification] = useState<{ visible: boolean, trackTitle: string }>({
        visible: false,
        trackTitle: ""
    });

    // Add handleShareTrack function
    const handleShareTrack = (track: Track): void => {
        // Create the shareable URL for the track
        const shareUrl = `${window.location.origin}/music/share/player/${track.id}`;

        // Copy to clipboard
        navigator.clipboard.writeText(shareUrl)
            .then(() => {
                // Show success notification
                setShareNotification({
                    visible: true,
                    trackTitle: track.title
                });

                // Hide notification after 3 seconds
                setTimeout(() => {
                    setShareNotification({ visible: false, trackTitle: "" });
                }, 3000);

                // Record the share event
                try {
                    recordTrackShare({ trackId: track.id, platform: "link" });
                } catch (error) {
                    console.error("Failed to record share event:", error);
                }
            })
            .catch(err => {
                console.error("Failed to copy:", err);
            });
        window.open(shareUrl, '_blank');
    }

    if (musicianLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-black p-4 md:p-8 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-fuchsia-500"></div>
            </div>
        )
    }

    if (musicianError) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-black p-4 md:p-8 flex items-center justify-center">
                <div className="text-red-400 text-center">
                    <h2 className="text-xl font-bold mb-2">Error Loading Musician Profile</h2>
                    <p>Unable to load musician data. Please try again later.</p>
                    <button
                        onClick={() => router.push('/dashboard/musician')}
                        className="mt-4 px-4 py-2 bg-indigo-900/50 border border-cyan-500/30 rounded-md text-cyan-300 hover:bg-indigo-800/50 transition-colors"
                    >
                        Back
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-black p-4 md:p-8 relative overflow-hidden">
            {/* Share notification popup */}
            {shareNotification.visible && (
                <div className="fixed top-4 right-4 z-50 bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white px-4 py-3 rounded-md shadow-lg flex items-center gap-3 max-w-md animate-fade-in">
                    <CheckCircle className="h-5 w-5 text-white" />
                    <div className="flex-1">
                        <p className="font-medium">Link copied!</p>
                        <p className="text-sm opacity-90">Share link for "{shareNotification.trackTitle}" has been copied to clipboard</p>
                    </div>
                    <button
                        onClick={() => setShareNotification({ visible: false, trackTitle: "" })}
                        className="p-1 hover:bg-white/20 rounded-full"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

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
                <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 text-cyan-300 hover:text-cyan-100 transition-colors">
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
                                    {/* <button disabled={true} className="px-4 py-2 rounded font-medium border border-cyan-400/50 text-cyan-300 hover:bg-cyan-950/30 transition-all">
                                        Follow
                                    </button> */}
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
                        </div>
                    </div>

                    {/* Grid View */}
                    {viewMode === "grid" && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {isLoading ? (
                                <div className="col-span-full flex justify-center py-8">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-fuchsia-500"></div>
                                </div>
                            ) : error ? (
                                <div className="col-span-full text-center text-red-400 py-8">
                                    Failed to load tracks. Please try again.
                                </div>
                            ) : filteredTracks.length === 0 ? (
                                <div className="col-span-full text-center text-cyan-300 py-8">
                                    No tracks found. Try a different search or upload your first track.
                                </div>
                            ) : (
                                filteredTracks.map((track) => (
                                    <div
                                        key={track.id}
                                        className="group relative rounded-lg overflow-hidden aspect-square bg-indigo-900/30 border border-indigo-800/50 hover:border-cyan-500/50 transition-colors"
                                        onClick={() => router.push(`/dashboard/admin/track/${track.id}`)}
                                    >
                                        <div className="relative aspect-square">
                                            <Image
                                                src={track.artwork_url || "/music_icon.avif"}
                                                alt={track.title}
                                                width={300}
                                                height={300}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button
                                                    className="p-4 rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white shadow-[0_0_15px_rgba(232,121,249,0.7)] transform scale-90 group-hover:scale-100 transition-transform"
                                                    onClick={() => handleShareTrack(track)}
                                                >
                                                    {currentTrack?.id === track.id && playerIsPlaying ? (
                                                        <Pause className="h-6 w-6" />
                                                    ) : (
                                                        <Play className="h-6 w-6 ml-1" />
                                                    )}
                                                </button>
                                            </div>
                                            <div className="absolute top-2 right-2">
                                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-900/80 text-cyan-300 border border-cyan-500/30 capitalize">
                                                    {track.status}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-3 bg-indigo-950/80 backdrop-blur-sm">
                                            <h3 className="font-medium text-fuchsia-400 truncate">{track.title}</h3>
                                            <div className="flex justify-between items-center mt-2">
                                                <div className="text-xs text-cyan-300/70">
                                                    {new Date(track.created_at).toLocaleDateString()}
                                                </div>
                                                <div className="text-xs text-cyan-300/70">
                                                    {track.stream_count || 0} plays
                                                </div>
                                            </div>
                                        </div>
                                        <button onClick={() => handleShareTrack(track)} className="p-1.5 rounded-md hover:bg-indigo-800/50 transition-colors text-cyan-300">
                                            <Share2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* List View */}
                    {viewMode === "list" && (
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-indigo-800/50">
                                    <th className="py-3 px-4 text-left text-cyan-300 font-medium">Track</th>
                                    <th className="py-3 px-4 text-left text-cyan-300 font-medium">Release Date</th>
                                    <th className="py-3 px-4 text-left text-cyan-300 font-medium">Plays</th>
                                    <th className="py-3 px-4 text-right text-cyan-300 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={4} className="py-8 text-center">
                                            <div className="flex justify-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-fuchsia-500"></div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : error ? (
                                    <tr>
                                        <td colSpan={4} className="py-8 text-center text-red-400">
                                            Failed to load tracks. Please try again.
                                        </td>
                                    </tr>
                                ) : filteredTracks.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="py-8 text-center text-cyan-300">
                                            No tracks found. Try a different search or upload your first track.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredTracks.map((track) => (
                                        <tr key={track.id} className="border-b border-indigo-800/30 hover:bg-indigo-900/20 transition-colors">
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded bg-indigo-900/50 overflow-hidden">
                                                        <Image
                                                            src={track.artwork_url || "/placeholder.svg"}
                                                            alt={track.title}
                                                            width={40}
                                                            height={40}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-fuchsia-400">{track.title}</div>
                                                        <div className="text-xs text-cyan-300/70">{track.genre || "No genre"}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-cyan-300">
                                                {new Date(track.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="py-4 px-4 text-cyan-300">
                                                {track.stream_count || 0}
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        className="p-1.5 rounded-md hover:bg-indigo-800/50 transition-colors text-cyan-300"
                                                        onClick={() => handlePlayTrack(track)}
                                                    >
                                                        {currentTrack?.id === track.id && playerIsPlaying ? (
                                                            <Pause className="h-5 w-5" />
                                                        ) : (
                                                            <Play className="h-5 w-5" />
                                                        )}
                                                    </button>
                                                    {/* <button onClick={() => handleDownloadTrack(track)} className="p-1.5 rounded-md hover:bg-indigo-800/50 transition-colors text-fuchsia-400">
                                                        <Download className="h-5 w-5" />
                                                    </button> */}
                                                    <button onClick={() => handleShareTrack(track)} className="p-1.5 rounded-md hover:bg-indigo-800/50 transition-colors text-cyan-300">
                                                        <Share2 className="h-5 w-5" />
                                                    </button>
                                                    {/* <button className="p-1.5 rounded-md hover:bg-indigo-800/50 transition-colors text-cyan-300">
                                                        <MoreHorizontal className="h-5 w-5" />
                                                    </button> */}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}

                    {/* Pagination */}
                    {artistTracksData && artistTracksData.pages > 1 && (
                        <div className="flex justify-center mt-8">
                            <div className="flex space-x-2">
                                {Array.from({ length: artistTracksData.pages }, (_, i) => (
                                    <button
                                        key={i}
                                        className={`w-8 h-8 rounded-full flex items-center justify-center ${artistTracksData.current_page === i + 1
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
