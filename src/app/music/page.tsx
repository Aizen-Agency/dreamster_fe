"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import {
    Search,
    Filter,
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Volume2,
    VolumeX,
    Heart,
    Plus,
    Music,
    Disc,
    Mic,
    Radio,
    Sparkles,
    ChevronRight,
    MoreHorizontal,
    CheckCircle,
    X,
    Share2,
} from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useTracksList, useTrackLikes } from "@/hooks/useTrackExplorer"
import { usePlayerStore } from "@/store/playerStore"
import { Track } from "@/types/track"
import { useRecordTrackShare } from "@/hooks/useSharedTrack"

export default function BrowseMusic() {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")
    const [activeGenre, setActiveGenre] = useState("all")
    const [sortOption, setSortOption] = useState<'newest' | 'popular' | 'created_at'>('newest')
    const audioRef = useRef<HTMLAudioElement>(null)
    const [volume, setVolume] = useState(0.7)

    // Get player state from store
    const {
        currentTrack,
        isPlaying,
        setCurrentTrack,
        setIsPlaying,
        currentTime,
        setCurrentTime,
        duration,
        setDuration,
        streamUrl,
        playNext,
        playPrevious
    } = usePlayerStore()

    // Fetch tracks with our hook
    const { data: tracksData, isLoading, error } = useTracksList({
        genre: activeGenre !== 'all' ? activeGenre : undefined,
        sort_by: sortOption,
        per_page: 12
    })

    // Track likes functionality
    const { likeTrack, unlikeTrack } = useTrackLikes()

    // Add the share track mutation
    const { mutate: recordTrackShare } = useRecordTrackShare()

    // Add state for share notification
    const [shareNotification, setShareNotification] = useState<{ visible: boolean, trackTitle: string }>({
        visible: false,
        trackTitle: ""
    })

    // Add handleShareTrack function
    const handleShareTrack = (track: Track): void => {
        // Create the shareable URL for the track
        const shareUrl = `${window.location.origin}/music/share/player/${track.id}`

        // Copy to clipboard
        navigator.clipboard.writeText(shareUrl)
            .then(() => {
                // Show success notification
                setShareNotification({
                    visible: true,
                    trackTitle: track.title
                })

                // Hide notification after 3 seconds
                setTimeout(() => {
                    setShareNotification({ visible: false, trackTitle: "" })
                }, 3000)

                // Record the share event
                try {
                    recordTrackShare({ trackId: track.id, platform: "link" })
                } catch (error) {
                    console.error("Failed to record share event:", error)
                }
            })
            .catch(err => {
                console.error("Failed to copy:", err)
            })
    }

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

    // Setup audio element and event listeners
    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return

        // Update time display
        const updateTime = () => {
            setCurrentTime(audio.currentTime)
        }

        // Set duration when metadata is loaded
        const handleLoadedMetadata = () => {
            setDuration(audio.duration)
        }

        // Handle playback ended
        const handleEnded = () => {
            setIsPlaying(false)
            setCurrentTime(0)
            // Optionally play next track
            // playNext()
        }

        // Add event listeners
        audio.addEventListener('timeupdate', updateTime)
        audio.addEventListener('loadedmetadata', handleLoadedMetadata)
        audio.addEventListener('ended', handleEnded)

        // Set volume
        audio.volume = volume

        return () => {
            // Clean up event listeners
            audio.removeEventListener('timeupdate', updateTime)
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
            audio.removeEventListener('ended', handleEnded)
        }
    }, [setCurrentTime, setDuration, setIsPlaying, volume])

    // Handle play/pause
    useEffect(() => {
        if (!audioRef.current || !streamUrl) return

        if (isPlaying) {
            audioRef.current.src = streamUrl
            audioRef.current.play().catch(err => {
                console.error("Playback failed:", err)
                setIsPlaying(false)
            })
        } else if (audioRef.current) {
            audioRef.current.pause()
        }
    }, [isPlaying, streamUrl, setIsPlaying])

    // Handle volume change
    const handleVolumeChange = (newVolume: number) => {
        setVolume(newVolume)
        if (audioRef.current) {
            audioRef.current.volume = newVolume
        }
    }

    // Toggle play/pause
    const togglePlayPause = () => {
        setIsPlaying(!isPlaying)
    }

    // Format time for display (mm:ss)
    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
    }

    // Calculate progress percentage
    const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0

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

            {/* Hidden audio element */}
            <audio ref={audioRef} />

            {/* Main content */}
            <div className="relative z-10 max-w-7xl mx-auto p-4 md:p-8 pb-24">
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
                {/* New Releases Section */}
                <div className="mb-24">
                    <div className="bg-gradient-to-br from-gray-900 to-indigo-950 rounded-lg shadow-[0_0_15px_rgba(255,44,201,0.3)] border border-fuchsia-500/30 p-6 backdrop-blur-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
                                NEW RELEASES
                            </h2>
                            <div className="flex items-center gap-4">
                                <select
                                    className="bg-indigo-950/50 border border-cyan-500/30 rounded-md py-1 px-3 text-cyan-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                                    onChange={(e) => setSortOption(e.target.value as 'newest' | 'popular' | 'created_at')}
                                    value={sortOption}
                                >
                                    <option value="newest">Newest</option>
                                    <option value="popular">Most Popular</option>
                                    <option value="created_at">Recently Added</option>
                                </select>
                                <button className="text-cyan-300 text-sm flex items-center hover:text-cyan-100 transition-colors">
                                    View All <ChevronRight className="h-4 w-4 ml-1" />
                                </button>
                            </div>
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
                                        <Image
                                            src={track.artwork_url || "/placeholder.svg"}
                                            alt={track.title}
                                            width={200}
                                            height={200}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-indigo-950 via-indigo-950/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                                            <h3 className="font-medium text-fuchsia-400 truncate">{track.title}</h3>
                                            <p className="text-sm text-cyan-300 truncate">{track.artist.name}</p>
                                            <div className="flex justify-between items-center mt-2">
                                                <button
                                                    className="p-2 rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white shadow-[0_0_10px_rgba(232,121,249,0.5)]"
                                                    onClick={() => handlePlayTrack(track)}
                                                >
                                                    {currentTrack?.id === track.id && isPlaying ? (
                                                        <Pause className="h-4 w-4" />
                                                    ) : (
                                                        <Play className="h-4 w-4" />
                                                    )}
                                                </button>
                                                <div className="flex gap-2">
                                                    <button
                                                        className="p-2 rounded-full bg-indigo-900/70 text-cyan-300 hover:text-cyan-100"
                                                        onClick={() => track.likes ? unlikeTrack(track.id) : likeTrack(track.id)}
                                                    >
                                                        <Heart className="h-4 w-4" fill={track.likes ? "currentColor" : "none"} />
                                                    </button>
                                                    <button
                                                        className="p-2 rounded-full bg-indigo-900/70 text-cyan-300 hover:text-cyan-100"
                                                        onClick={() => handleShareTrack(track)}
                                                    >
                                                        <Share2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Music Player Footer - Only visible when a track is playing */}
            {currentTrack && (
                <div className="fixed bottom-0 left-0 right-0 z-20">
                    <div className="bg-gradient-to-r from-gray-900 to-indigo-950 border-t border-fuchsia-500/30 shadow-[0_-5px_15px_rgba(255,44,201,0.3)] backdrop-blur-sm p-3">
                        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center gap-4">
                            {/* Track Info */}
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <div className="h-12 w-12 rounded bg-gradient-to-br from-cyan-500 to-fuchsia-500 p-0.5 shadow-[0_0_10px_rgba(255,44,201,0.3)]">
                                    <Image
                                        src={currentTrack.artwork_url || "/placeholder.svg"}
                                        alt={currentTrack.title}
                                        width={60}
                                        height={60}
                                        className="h-full w-full rounded object-cover"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-medium text-fuchsia-400">{currentTrack.title}</h3>
                                    <p className="text-sm text-cyan-300">{currentTrack.artist?.name}</p>
                                </div>
                                <button
                                    className="ml-2 text-cyan-300 hover:text-cyan-100 transition-colors"
                                    onClick={() => currentTrack.likes ? unlikeTrack(currentTrack.id) : likeTrack(currentTrack.id)}
                                >
                                    <Heart className="h-5 w-5" fill={currentTrack.likes ? "currentColor" : "none"} />
                                </button>
                            </div>

                            {/* Player Controls */}
                            <div className="flex flex-col items-center flex-1 w-full sm:w-auto">
                                <div className="flex items-center gap-4 mb-1">
                                    <button
                                        className="text-cyan-300 hover:text-cyan-100 transition-colors"
                                        onClick={playPrevious}
                                    >
                                        <SkipBack className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={togglePlayPause}
                                        className="p-3 rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white shadow-[0_0_10px_rgba(232,121,249,0.5)] hover:shadow-[0_0_15px_rgba(232,121,249,0.7)] transition-all"
                                    >
                                        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                                    </button>
                                    <button
                                        className="text-cyan-300 hover:text-cyan-100 transition-colors"
                                        onClick={playNext}
                                    >
                                        <SkipForward className="h-5 w-5" />
                                    </button>
                                </div>
                                <div className="flex items-center gap-3 w-full max-w-xl">
                                    <span className="text-xs text-cyan-300 min-w-[40px] text-right">
                                        {formatTime(currentTime)}
                                    </span>
                                    <div className="h-1.5 bg-indigo-900/50 rounded-full flex-1 overflow-hidden cursor-pointer"
                                        onClick={(e) => {
                                            if (!audioRef.current || !duration) return;
                                            const progressBar = e.currentTarget;
                                            const rect = progressBar.getBoundingClientRect();
                                            const clickPosition = (e.clientX - rect.left) / rect.width;
                                            const seekTime = clickPosition * duration;
                                            audioRef.current.currentTime = seekTime;
                                            setCurrentTime(seekTime);
                                        }}
                                    >
                                        <div
                                            className="h-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-full"
                                            style={{ width: `${progressPercentage}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-xs text-cyan-300 min-w-[40px]">
                                        {formatTime(duration || 0)}
                                    </span>
                                </div>
                            </div>

                            {/* Volume Control */}
                            <div className="flex items-center gap-2 w-full sm:w-auto max-w-[150px]">
                                <button
                                    className="text-cyan-300 hover:text-cyan-100 transition-colors"
                                    onClick={() => handleVolumeChange(volume === 0 ? 0.7 : 0)}
                                >
                                    {volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                                </button>
                                <div
                                    className="h-1.5 bg-indigo-900/50 rounded-full flex-1 overflow-hidden cursor-pointer"
                                    onClick={(e) => {
                                        const volumeBar = e.currentTarget;
                                        const rect = volumeBar.getBoundingClientRect();
                                        const clickPosition = (e.clientX - rect.left) / rect.width;
                                        handleVolumeChange(Math.max(0, Math.min(1, clickPosition)));
                                    }}
                                >
                                    <div
                                        className="h-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-full"
                                        style={{ width: `${volume * 100}%` }}
                                    ></div>
                                </div>
                                <button
                                    className="text-cyan-300 hover:text-cyan-100 transition-colors"
                                    onClick={() => router.push(`/music/player?id=${currentTrack.id}`)}
                                >
                                    <MoreHorizontal className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
        </div>
    )
}