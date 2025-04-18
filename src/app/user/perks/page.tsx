"use client"

import { useState, useEffect } from "react"
import {
    MessageSquare,
    Music,
    Download,
    FileText,
    Gift,
    Layers,
    ExternalLink,
    Video,
    Star,
    Headphones,
    X,
    CheckCircle,
} from "lucide-react"
import Image from "next/image"
import { useAllPerks, usePerksByCategory, useDownloadPerk } from "@/hooks/useUserPerks"
import { UserPerk } from "@/services/userPerksService"

export default function MemberPerks() {
    // Update the tab state options
    const [activeTab, setActiveTab] = useState("tracks")

    // Add notification state
    const [notification, setNotification] = useState<{
        visible: boolean;
        title: string;
        message: string;
        type: 'success' | 'error';
    }>({
        visible: false,
        title: "",
        message: "",
        type: "success"
    })

    const getCategoryFromTab = (tab: string) => {
        switch (tab) {
            case "tracks": return "exclusive"
            case "stems": return "stem"
            case "discord": return "discord"
            case "perks": return "custom"
            default: return "exclusive"
        }
    }

    // Add loading and error states from the query
    const { data: categoryPerks, isLoading, error } = usePerksByCategory(getCategoryFromTab(activeTab))

    // Download perk mutation
    const downloadPerkMutation = useDownloadPerk()

    // Auto-hide notification after 5 seconds
    useEffect(() => {
        if (notification.visible) {
            const timer = setTimeout(() => {
                setNotification(prev => ({ ...prev, visible: false }))
            }, 5000)

            return () => clearTimeout(timer)
        }
    }, [notification.visible])

    // Handle download
    const handleDownload = async (perkId: string) => {
        try {
            const response = await downloadPerkMutation.mutateAsync(perkId)
            console.log(response)

            if (response.download_url) {
                // Show loading notification
                setNotification({
                    visible: true,
                    title: "Starting Download",
                    message: "Preparing your download...",
                    type: "success"
                })

                // Fetch the file content
                fetch(response.download_url)
                    .then(res => res.blob())
                    .then(blob => {
                        // Create a blob URL
                        const url = window.URL.createObjectURL(blob)
                        const link = document.createElement('a')
                        link.href = url
                        link.setAttribute('download', `${response.filename}${response.file_extension}`)
                        document.body.appendChild(link)
                        link.click()

                        // Clean up
                        link.parentNode?.removeChild(link)
                        window.URL.revokeObjectURL(url)

                        // Update notification
                        setNotification({
                            visible: true,
                            title: "Download Complete",
                            message: "Your file has been downloaded successfully.",
                            type: "success"
                        })
                    })
                    .catch(err => {
                        console.error("Download error:", err)
                        setNotification({
                            visible: true,
                            title: "Download Failed",
                            message: "There was an error downloading this file.",
                            type: "error"
                        })
                    })
            }
        } catch (error) {
            setNotification({
                visible: true,
                title: "Download Failed",
                message: "There was an error downloading this perk.",
                type: "error"
            })
        }
    }

    // Map API perks to UI components
    const mapPerksToTracks = (perks: UserPerk[] = []) => {
        return perks
            .filter(perk => perk.category === 'exclusive')
            .map(perk => ({
                id: perk.id,
                title: perk.title,
                artist: perk.artist_name,
                duration: "3:45",
                image: perk.artwork_url,
            }))
    }

    const tracks = activeTab === "tracks" ? mapPerksToTracks(categoryPerks) : [];
    // Use real data or fallback to mock data

    const videos = [
        {
            id: 1,
            title: "Studio Session with DJ Cyberpunk",
            duration: "12:45",
            thumbnail: "/placeholder.svg?height=120&width=200",
        },
        {
            id: 2,
            title: "Behind the Scenes: Making of 'Neon Dreams'",
            duration: "8:32",
            thumbnail: "/placeholder.svg?height=120&width=200",
        },
        {
            id: 3,
            title: "Artist Interview: RetroWave",
            duration: "15:20",
            thumbnail: "/placeholder.svg?height=120&width=200",
        },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-black p-4 relative overflow-hidden">
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

            {/* Notification popup */}
            {notification.visible && (
                <div className={`fixed top-4 right-4 z-50 ${notification.type === 'success'
                    ? 'bg-gradient-to-r from-cyan-500 to-fuchsia-500'
                    : 'bg-gradient-to-r from-red-500 to-orange-500'
                    } text-white px-4 py-3 rounded-md shadow-lg flex items-center gap-3 max-w-md animate-fade-in`}>
                    {notification.type === 'success'
                        ? <CheckCircle className="h-5 w-5 text-white" />
                        : <X className="h-5 w-5 text-white" />
                    }
                    <div className="flex-1">
                        <p className="font-medium">{notification.title}</p>
                        <p className="text-sm opacity-90">{notification.message}</p>
                    </div>
                    <button
                        onClick={() => setNotification(prev => ({ ...prev, visible: false }))}
                        className="p-1 hover:bg-white/20 rounded-full"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            <div className="max-w-6xl w-full mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 tracking-wider mb-4">
                        YOUR MEMBER BENEFITS
                    </h1>
                    <p className="text-cyan-300 text-lg max-w-2xl mx-auto opacity-80">
                        Explore all the exclusive content and perks included with your membership
                    </p>
                </div>

                {/* Content Tabs */}
                <div className="bg-gradient-to-br from-gray-900 to-indigo-950 rounded-lg shadow-[0_0_15px_rgba(255,44,201,0.4)] border border-fuchsia-500/30 backdrop-blur-sm mb-8">
                    {/* Replace the tabs section with these four tabs */}
                    <div className="flex overflow-x-auto scrollbar-hide">
                        <button
                            onClick={() => setActiveTab("tracks")}
                            className={`px-6 py-4 font-medium text-sm flex items-center whitespace-nowrap ${activeTab === "tracks"
                                ? "text-fuchsia-400 border-b-2 border-fuchsia-500"
                                : "text-cyan-300/70 hover:text-cyan-300"
                                }`}
                        >
                            <Music className="h-4 w-4 mr-2" /> Exclusive Tracks
                        </button>
                        <button
                            onClick={() => setActiveTab("stems")}
                            className={`px-6 py-4 font-medium text-sm flex items-center whitespace-nowrap ${activeTab === "stems"
                                ? "text-fuchsia-400 border-b-2 border-fuchsia-500"
                                : "text-cyan-300/70 hover:text-cyan-300"
                                }`}
                        >
                            <Layers className="h-4 w-4 mr-2" /> Stems
                        </button>
                        <button
                            onClick={() => setActiveTab("discord")}
                            className={`px-6 py-4 font-medium text-sm flex items-center whitespace-nowrap ${activeTab === "discord"
                                ? "text-fuchsia-400 border-b-2 border-fuchsia-500"
                                : "text-cyan-300/70 hover:text-cyan-300"
                                }`}
                        >
                            <MessageSquare className="h-4 w-4 mr-2" /> Discord Community
                        </button>
                        <button
                            onClick={() => setActiveTab("perks")}
                            className={`px-6 py-4 font-medium text-sm flex items-center whitespace-nowrap ${activeTab === "perks"
                                ? "text-fuchsia-400 border-b-2 border-fuchsia-500"
                                : "text-cyan-300/70 hover:text-cyan-300"
                                }`}
                        >
                            <Gift className="h-4 w-4 mr-2" /> Additional Perks
                        </button>
                    </div>

                    <div className="p-6">
                        {/* Loading state */}
                        {isLoading && (
                            <div className="flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-fuchsia-500"></div>
                            </div>
                        )}

                        {/* Error state */}
                        {error && (
                            <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4 text-center">
                                <p className="text-red-300">Failed to load perks. Please try again later.</p>
                            </div>
                        )}

                        {/* Tracks Tab Content */}
                        {activeTab === "tracks" && !isLoading && !error && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
                                        EXCLUSIVE TRACKS
                                    </h2>
                                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-fuchsia-900/30 text-fuchsia-300 border border-fuchsia-500/30">
                                        Members Only
                                    </span>
                                </div>

                                <div className="space-y-4 mb-6">
                                    {tracks.length === 0 ? (
                                        <p className="text-center text-cyan-300/70 py-8">No exclusive tracks available yet.</p>
                                    ) : (
                                        tracks.map((track) => (
                                            <div
                                                key={track.id}
                                                className="flex items-center justify-between p-4 rounded-lg bg-indigo-950/50 border border-indigo-800/30 hover:bg-indigo-900/30 transition-colors"
                                            >
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 rounded bg-gradient-to-br from-cyan-500 to-fuchsia-500 p-0.5 shadow-[0_0_10px_rgba(255,44,201,0.3)] mr-4">
                                                        <div className="h-full w-full rounded overflow-hidden">
                                                            <Image
                                                                src={track.image || "/placeholder.svg"}
                                                                alt={track.title}
                                                                width={40}
                                                                height={40}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-fuchsia-400">{track.title}</div>
                                                        <div className="text-xs text-cyan-300/70">{track.artist}</div>
                                                        <div className="text-xs text-cyan-300/70">Duration: {track.duration}</div>
                                                    </div>
                                                </div>
                                                <button
                                                    className="p-2 rounded-md bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white shadow-[0_0_10px_rgba(232,121,249,0.3)] hover:shadow-[0_0_15px_rgba(232,121,249,0.5)] transition-all"
                                                    onClick={() => handleDownload(track.id.toString())}
                                                    disabled={downloadPerkMutation.isPending}
                                                >
                                                    <Download className="h-5 w-5" />
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <div className="bg-indigo-950/50 border border-indigo-800/30 rounded-lg p-5">
                                    <h3 className="font-medium text-fuchsia-400 mb-4">New Releases</h3>
                                    <div className="flex items-center justify-between p-4 rounded-lg bg-indigo-900/30 border border-indigo-700/30">
                                        <div className="flex items-center">
                                            <div className="h-12 w-12 rounded bg-gradient-to-br from-cyan-500 to-fuchsia-500 p-0.5 shadow-[0_0_10px_rgba(255,44,201,0.3)] mr-4">
                                                <div className="h-full w-full rounded overflow-hidden">
                                                    <Image
                                                        src="/placeholder.svg?height=48&width=48"
                                                        alt="Album cover"
                                                        width={48}
                                                        height={48}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-medium text-fuchsia-400 text-lg">Synthwave Collection Vol. 3</div>
                                                <div className="text-sm text-cyan-300/70">Various Artists</div>
                                                <div className="text-xs text-cyan-300/70">10 tracks • 45:30 total</div>
                                            </div>
                                        </div>
                                        <button className="p-3 rounded-md bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white shadow-[0_0_10px_rgba(232,121,249,0.3)] hover:shadow-[0_0_15px_rgba(232,121,249,0.5)] transition-all">
                                            <Download className="h-6 w-6" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "videos" && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
                                        EXCLUSIVE MEDIA
                                    </h2>
                                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-cyan-900/30 text-cyan-300 border border-cyan-500/30">
                                        Behind the Scenes
                                    </span>
                                </div>

                                <div className="space-y-4 mb-6">
                                    {videos.map((video) => (
                                        <div
                                            key={video.id}
                                            className="flex items-center justify-between p-4 rounded-lg bg-indigo-950/50 border border-indigo-800/30 hover:bg-indigo-900/30 transition-colors"
                                        >
                                            <div className="flex items-center">
                                                <div className="p-2 rounded-full bg-cyan-950/50 border border-cyan-500/30 mr-4">
                                                    <Video className="h-5 w-5 text-cyan-400" />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-fuchsia-400">{video.title}</h3>
                                                    <p className="text-xs text-cyan-300/70">Duration: {video.duration}</p>
                                                </div>
                                            </div>
                                            <button className="p-2 rounded-md bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white shadow-[0_0_10px_rgba(232,121,249,0.3)] hover:shadow-[0_0_15px_rgba(232,121,249,0.5)] transition-all">
                                                <Download className="h-5 w-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-indigo-950/50 border border-indigo-800/30 rounded-lg p-5">
                                    <h3 className="font-medium text-fuchsia-400 mb-4">Featured Documentary</h3>
                                    <div className="flex items-center justify-between p-4 rounded-lg bg-indigo-900/30 border border-indigo-700/30">
                                        <div className="flex items-center">
                                            <div className="p-3 rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white shadow-[0_0_10px_rgba(232,121,249,0.3)] mr-4">
                                                <Video className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-fuchsia-400 text-lg">The Rise of Synthwave</h3>
                                                <p className="text-sm text-cyan-100/80">A journey through the evolution of the genre</p>
                                                <p className="text-xs text-cyan-300/70 mt-1">Duration: 45:12</p>
                                            </div>
                                        </div>
                                        <button className="p-3 rounded-md bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white shadow-[0_0_10px_rgba(232,121,249,0.3)] hover:shadow-[0_0_15px_rgba(232,121,249,0.5)] transition-all">
                                            <Download className="h-6 w-6" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Discord Community Tab */}
                        {activeTab === "discord" && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
                                        DISCORD COMMUNITY
                                    </h2>
                                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-900/30 text-indigo-300 border border-indigo-500/30">
                                        Members Only
                                    </span>
                                </div>

                                <div className="bg-gradient-to-br from-gray-900 to-indigo-950 rounded-lg shadow-[0_0_15px_rgba(255,44,201,0.4)] border border-fuchsia-500/30 p-6 backdrop-blur-sm mb-6">
                                    <div className="flex flex-col md:flex-row items-center gap-6">
                                        <div className="w-24 h-24 flex-shrink-0">
                                            <Image
                                                src="/placeholder.svg?height=96&width=96"
                                                alt="Discord Server Icon"
                                                width={96}
                                                height={96}
                                                className="w-full h-full rounded-full object-cover border-2 border-indigo-500/50"
                                            />
                                        </div>
                                        <div className="flex-1 text-center md:text-left">
                                            <h3 className="text-xl font-bold text-fuchsia-400 mb-2">Dreamster Community</h3>
                                            <p className="text-cyan-100/80 mb-4">
                                                Join our exclusive Discord server where you can connect directly with artists, participate in
                                                private listening sessions, and engage with a community of passionate music lovers.
                                            </p>
                                            <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                                                <span className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-900/50 text-cyan-300 border border-cyan-500/30">
                                                    5,200+ Members
                                                </span>
                                                <span className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-900/50 text-cyan-300 border border-cyan-500/30">
                                                    20+ Artist Channels
                                                </span>
                                                <span className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-900/50 text-cyan-300 border border-cyan-500/30">
                                                    Weekly Events
                                                </span>
                                            </div>
                                            <a
                                                href="#"
                                                className="inline-flex items-center justify-center px-6 py-2.5 rounded font-bold tracking-wider bg-indigo-600 text-white shadow-[0_0_10px_rgba(99,102,241,0.5)] hover:shadow-[0_0_15px_rgba(99,102,241,0.7)] transition-all gap-2"
                                            >
                                                <MessageSquare className="h-5 w-5" />
                                                JOIN OUR DISCORD
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-indigo-950/50 border border-indigo-800/30 rounded-lg p-5">
                                        <h3 className="font-medium text-fuchsia-400 mb-4 flex items-center">
                                            <Star className="h-5 w-5 mr-2" /> Featured Channels
                                        </h3>
                                        <ul className="space-y-3">
                                            <li className="flex items-center text-cyan-100">
                                                <MessageSquare className="h-4 w-4 text-cyan-400 mr-3 flex-shrink-0" />
                                                <span className="flex-1">general-chat - Main discussion channel for all members</span>
                                            </li>
                                            <li className="flex items-center text-cyan-100">
                                                <MessageSquare className="h-4 w-4 text-fuchsia-400 mr-3 flex-shrink-0" />
                                                <span className="flex-1">music-discussion - Talk about your favorite tracks and artists</span>
                                            </li>
                                            <li className="flex items-center text-cyan-100">
                                                <MessageSquare className="h-4 w-4 text-amber-400 mr-3 flex-shrink-0" />
                                                <span className="flex-1">artist-showcase - Where artists share their latest work</span>
                                            </li>
                                            <li className="flex items-center text-cyan-100">
                                                <MessageSquare className="h-4 w-4 text-emerald-400 mr-3 flex-shrink-0" />
                                                <span className="flex-1">production-tips - Learn music production from the pros</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="bg-indigo-950/50 border border-indigo-800/30 rounded-lg p-5">
                                        <h3 className="font-medium text-fuchsia-400 mb-4 flex items-center">
                                            <Headphones className="h-5 w-5 mr-2" /> Upcoming Discord Events
                                        </h3>
                                        <ul className="space-y-3">
                                            <li className="p-3 rounded bg-indigo-900/30 border border-indigo-700/30">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="font-medium text-cyan-300">Artist Q&A: RetroWave</span>
                                                    <span className="px-1.5 py-0.5 text-xs rounded bg-cyan-900/50 text-cyan-300">Friday 8PM</span>
                                                </div>
                                                <p className="text-xs text-cyan-100/70">
                                                    Live Q&A session with RetroWave about their new album
                                                </p>
                                            </li>
                                            <li className="p-3 rounded bg-indigo-900/30 border border-indigo-700/30">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="font-medium text-cyan-300">Listening Party</span>
                                                    <span className="px-1.5 py-0.5 text-xs rounded bg-cyan-900/50 text-cyan-300">
                                                        Saturday 9PM
                                                    </span>
                                                </div>
                                                <p className="text-xs text-cyan-100/70">
                                                    Group listening session for the new Synthwave Collective album
                                                </p>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Upcoming Events Tab */}
                        {activeTab === "events" && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
                                        UPCOMING EVENTS
                                    </h2>
                                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-amber-900/30 text-amber-300 border border-amber-500/30">
                                        Members Only
                                    </span>
                                </div>

                                <div className="space-y-4 mb-6">
                                    {/* Featured Event */}
                                    <div className="bg-gradient-to-br from-indigo-900/50 to-fuchsia-900/30 rounded-lg overflow-hidden border border-fuchsia-500/30">
                                        <div className="relative">
                                            <Image
                                                src="/placeholder.svg?height=200&width=800"
                                                alt="Virtual Concert"
                                                width={800}
                                                height={200}
                                                className="w-full h-40 object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-indigo-900 to-transparent"></div>
                                            <div className="absolute bottom-4 left-4">
                                                <span className="px-3 py-1 text-xs font-medium rounded-full bg-fuchsia-900/50 text-fuchsia-300 border border-fuchsia-500/30 mb-2 inline-block">
                                                    FEATURED EVENT
                                                </span>
                                                <h3 className="text-xl font-bold text-white">Synthwave Summer Festival</h3>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <div className="flex flex-wrap gap-4 mb-4">
                                                <div className="flex items-center text-cyan-300">
                                                    <Star className="h-4 w-4 mr-1" />
                                                    <span>Saturday, July 15</span>
                                                </div>
                                                <div className="flex items-center text-cyan-300">
                                                    <Headphones className="h-4 w-4 mr-1" />
                                                    <span>8:00 PM EST</span>
                                                </div>
                                                <div className="flex items-center text-cyan-300">
                                                    <MessageSquare className="h-4 w-4 mr-1" />
                                                    <span>Virtual Event</span>
                                                </div>
                                            </div>
                                            <p className="text-cyan-100/80 mb-4">
                                                Join us for our biggest virtual concert of the year featuring top synthwave artists including
                                                RetroWave, CyberSynth, and Dreamster. Exclusive to members with live Q&A after the performances.
                                            </p>
                                            <div className="flex flex-wrap gap-3">
                                                <button className="px-4 py-2 rounded font-medium bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white shadow-[0_0_10px_rgba(232,121,249,0.5)] hover:shadow-[0_0_15px_rgba(232,121,249,0.7)] transition-all">
                                                    RSVP NOW
                                                </button>
                                                <button className="px-4 py-2 rounded font-medium border border-cyan-400/50 text-cyan-300 hover:bg-cyan-950/30 transition-all">
                                                    ADD TO CALENDAR
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Other Events */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-indigo-950/50 border border-indigo-800/30 rounded-lg p-4">
                                            <div className="flex justify-between items-start mb-3">
                                                <h3 className="font-bold text-fuchsia-400">Artist Q&A: RetroWave</h3>
                                                <span className="px-2 py-1 text-xs font-medium rounded bg-indigo-900/50 text-cyan-300">
                                                    July 10, 7PM EST
                                                </span>
                                            </div>
                                            <p className="text-cyan-100/80 text-sm mb-3">
                                                Live Q&A session with RetroWave about their creative process and upcoming projects.
                                            </p>
                                            <button className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm font-medium">
                                                Set Reminder
                                            </button>
                                        </div>

                                        <div className="bg-indigo-950/50 border border-indigo-800/30 rounded-lg p-4">
                                            <div className="flex justify-between items-start mb-3">
                                                <h3 className="font-bold text-fuchsia-400">Production Workshop</h3>
                                                <span className="px-2 py-1 text-xs font-medium rounded bg-indigo-900/50 text-cyan-300">
                                                    July 20, 6PM EST
                                                </span>
                                            </div>
                                            <p className="text-cyan-100/80 text-sm mb-3">
                                                Learn production techniques from top synthwave producers in this interactive workshop.
                                            </p>
                                            <button className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm font-medium">
                                                Set Reminder
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-indigo-950/50 border border-indigo-800/30 rounded-lg p-4">
                                    <h3 className="font-medium text-fuchsia-400 mb-4">Your Event Calendar</h3>
                                    <div className="grid grid-cols-7 gap-1 mb-4">
                                        {Array.from({ length: 31 }, (_, i) => (
                                            <div
                                                key={i}
                                                className={`aspect-square flex items-center justify-center rounded text-sm ${i === 14
                                                    ? "bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white font-medium"
                                                    : i === 9 || i === 19
                                                        ? "bg-indigo-900/50 text-cyan-300 border border-cyan-500/30"
                                                        : "text-cyan-300/70 hover:bg-indigo-900/30 hover:text-cyan-300"
                                                    }`}
                                            >
                                                {i + 1}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-cyan-300/70">July 2023</span>
                                        <div className="flex gap-2">
                                            <button className="px-3 py-1 text-sm rounded border border-indigo-700/50 text-cyan-300 hover:bg-indigo-900/30">
                                                Previous
                                            </button>
                                            <button className="px-3 py-1 text-sm rounded border border-indigo-700/50 text-cyan-300 hover:bg-indigo-900/30">
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Exclusive Merch Tab */}
                        {activeTab === "merch" && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
                                        EXCLUSIVE MERCHANDISE
                                    </h2>
                                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-emerald-900/30 text-emerald-300 border border-emerald-500/30">
                                        Member Discount: 15% Off
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                                    {/* Merch Item 1 */}
                                    <div className="bg-indigo-950/50 border border-indigo-800/30 rounded-lg overflow-hidden group">
                                        <div className="relative aspect-square bg-gradient-to-br from-indigo-900/50 to-fuchsia-900/30">
                                            <Image
                                                src="/placeholder.svg?height=300&width=300"
                                                alt="Limited Edition T-Shirt"
                                                width={300}
                                                height={300}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute top-2 left-2">
                                                <span className="px-2 py-1 text-xs font-medium rounded bg-fuchsia-900/50 text-fuchsia-300 border border-fuchsia-500/30">
                                                    Limited Edition
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-bold text-fuchsia-400 mb-1">Synthwave Sunset T-Shirt</h3>
                                            <p className="text-cyan-100/80 text-sm mb-3">
                                                Limited edition t-shirt with exclusive synthwave design
                                            </p>
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <span className="text-cyan-300 font-medium">$29.99</span>
                                                    <span className="text-cyan-300/50 text-sm line-through ml-2">$34.99</span>
                                                </div>
                                                <button className="px-3 py-1.5 rounded text-sm font-medium bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white shadow-[0_0_10px_rgba(232,121,249,0.3)] hover:shadow-[0_0_15px_rgba(232,121,249,0.5)] transition-all">
                                                    View Item
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Merch Item 2 */}
                                    <div className="bg-indigo-950/50 border border-indigo-800/30 rounded-lg overflow-hidden group">
                                        <div className="relative aspect-square bg-gradient-to-br from-indigo-900/50 to-fuchsia-900/30">
                                            <Image
                                                src="/placeholder.svg?height=300&width=300"
                                                alt="Vinyl Record"
                                                width={300}
                                                height={300}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute top-2 left-2">
                                                <span className="px-2 py-1 text-xs font-medium rounded bg-cyan-900/50 text-cyan-300 border border-cyan-500/30">
                                                    Members Only
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-bold text-fuchsia-400 mb-1">Neon Dreams Vinyl</h3>
                                            <p className="text-cyan-100/80 text-sm mb-3">
                                                Special edition vinyl with exclusive tracks and glow-in-the-dark design
                                            </p>
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <span className="text-cyan-300 font-medium">$49.99</span>
                                                    <span className="text-cyan-300/50 text-sm line-through ml-2">$59.99</span>
                                                </div>
                                                <button className="px-3 py-1.5 rounded text-sm font-medium bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white shadow-[0_0_10px_rgba(232,121,249,0.3)] hover:shadow-[0_0_15px_rgba(232,121,249,0.5)] transition-all">
                                                    View Item
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Merch Item 3 */}
                                    <div className="bg-indigo-950/50 border border-indigo-800/30 rounded-lg overflow-hidden group">
                                        <div className="relative aspect-square bg-gradient-to-br from-indigo-900/50 to-fuchsia-900/30">
                                            <Image
                                                src="/placeholder.svg?height=300&width=300"
                                                alt="Digital Art Print"
                                                width={300}
                                                height={300}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute top-2 left-2">
                                                <span className="px-2 py-1 text-xs font-medium rounded bg-amber-900/50 text-amber-300 border border-amber-500/30">
                                                    New Arrival
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-bold text-fuchsia-400 mb-1">Digital Horizon Art Print</h3>
                                            <p className="text-cyan-100/80 text-sm mb-3">High-quality art print signed by the artist</p>
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <span className="text-cyan-300 font-medium">$24.99</span>
                                                    <span className="text-cyan-300/50 text-sm line-through ml-2">$29.99</span>
                                                </div>
                                                <button className="px-3 py-1.5 rounded text-sm font-medium bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white shadow-[0_0_10px_rgba(232,121,249,0.3)] hover:shadow-[0_0_15px_rgba(232,121,249,0.5)] transition-all">
                                                    View Item
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-center">
                                    <button className="px-6 py-2.5 rounded font-bold tracking-wider bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-[0_0_10px_rgba(16,185,129,0.5)] hover:shadow-[0_0_15px_rgba(16,185,129,0.7)] transition-all flex items-center justify-center gap-2">
                                        BROWSE ALL MERCHANDISE
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Add the stems tab content */}
                        {activeTab === "stems" && !isLoading && !error && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
                                        TRACK STEMS
                                    </h2>
                                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-cyan-900/30 text-cyan-300 border border-cyan-500/30">
                                        Producer Tools
                                    </span>
                                </div>

                                <div className="space-y-4 mb-6">
                                    {categoryPerks && categoryPerks.length > 0 ? (
                                        categoryPerks.map((perk) => (
                                            <div
                                                key={perk.id}
                                                className="flex items-center justify-between p-4 rounded-lg bg-indigo-950/50 border border-indigo-800/30 hover:bg-indigo-900/30 transition-colors"
                                            >
                                                <div className="flex items-center">
                                                    <div className="p-2 rounded-full bg-cyan-950/50 border border-cyan-500/30 mr-4">
                                                        <Layers className="h-5 w-5 text-cyan-400" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium text-fuchsia-400">{perk.title}</h3>
                                                        <p className="text-xs text-cyan-300/70">{perk.description}</p>
                                                        <p className="text-xs text-cyan-300/70">Track: {perk.track_title}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    className="p-2 rounded-md bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white shadow-[0_0_10px_rgba(232,121,249,0.3)] hover:shadow-[0_0_15px_rgba(232,121,249,0.5)] transition-all"
                                                    onClick={() => handleDownload(perk.id)}
                                                    disabled={downloadPerkMutation.isPending}
                                                >
                                                    <Download className="h-5 w-5" />
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-center text-cyan-300/70 py-8">No stem files available yet.</p>
                                    )}
                                </div>

                                <div className="bg-indigo-950/50 border border-indigo-800/30 rounded-lg p-5">
                                    <h3 className="font-medium text-fuchsia-400 mb-4">Remix Competition</h3>
                                    <div className="flex items-center justify-between p-4 rounded-lg bg-indigo-900/30 border border-indigo-700/30">
                                        <div className="flex items-center">
                                            <div className="p-3 rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white shadow-[0_0_10px_rgba(232,121,249,0.3)] mr-4">
                                                <Layers className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-fuchsia-400 text-lg">Synthwave Collection Vol. 3 - Remix Pack</h3>
                                                <p className="text-sm text-cyan-100/80">Complete stem collection for remix competition</p>
                                                <p className="text-xs text-cyan-300/70 mt-1">10 tracks • WAV format • 1.2 GB</p>
                                            </div>
                                        </div>
                                        <button className="p-3 rounded-md bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white shadow-[0_0_10px_rgba(232,121,249,0.3)] hover:shadow-[0_0_15px_rgba(232,121,249,0.5)] transition-all">
                                            <Download className="h-6 w-6" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Add the additional perks tab content */}
                        {activeTab === "perks" && !isLoading && !error && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
                                        ADDITIONAL PERKS
                                    </h2>
                                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-amber-900/30 text-amber-300 border border-amber-500/30">
                                        Member Exclusives
                                    </span>
                                </div>

                                <div className="space-y-4 mb-6">
                                    {categoryPerks && categoryPerks.length > 0 ? (
                                        categoryPerks.map((perk) => {
                                            // Determine icon based on perk type
                                            let Icon = FileText
                                            if (perk.perk_type === 'url') Icon = ExternalLink
                                            if (perk.perk_type === 'audio') Icon = Music
                                            if (perk.perk_type === 'video') Icon = Video

                                            return (
                                                <div
                                                    key={perk.id}
                                                    className="flex items-center justify-between p-4 rounded-lg bg-indigo-950/50 border border-indigo-800/30 hover:bg-indigo-900/30 transition-colors"
                                                >
                                                    <div className="flex items-center">
                                                        <div className="p-2 rounded-full bg-amber-950/50 border border-amber-500/30 mr-4">
                                                            <Icon className="h-5 w-5 text-amber-400" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-medium text-fuchsia-400">{perk.title}</h3>
                                                            <p className="text-xs text-cyan-300/70">{perk.description}</p>
                                                            <p className="text-xs text-cyan-300/70">From: {perk.artist_name}</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        className="p-2 rounded-md bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white shadow-[0_0_10px_rgba(232,121,249,0.3)] hover:shadow-[0_0_15px_rgba(232,121,249,0.5)] transition-all"
                                                        onClick={() => handleDownload(perk.id)}
                                                        disabled={downloadPerkMutation.isPending}
                                                    >
                                                        <Download className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            )
                                        })
                                    ) : (
                                        <p className="text-center text-cyan-300/70 py-8">No additional perks available yet.</p>
                                    )}
                                </div>

                                <div className="bg-indigo-950/50 border border-indigo-800/30 rounded-lg p-5">
                                    <h3 className="font-medium text-fuchsia-400 mb-4">Featured Resource</h3>
                                    <div className="flex items-center justify-between p-4 rounded-lg bg-indigo-900/30 border border-indigo-700/30">
                                        <div className="flex items-center">
                                            <div className="p-3 rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white shadow-[0_0_10px_rgba(232,121,249,0.3)] mr-4">
                                                <FileText className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-fuchsia-400 text-lg">The Complete Synthwave Sample Pack</h3>
                                                <p className="text-sm text-cyan-100/80">Over 500 royalty-free samples and loops</p>
                                                <p className="text-xs text-cyan-300/70 mt-1">WAV format • 24-bit/48kHz • 2.5 GB</p>
                                            </div>
                                        </div>
                                        <button className="p-3 rounded-md bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white shadow-[0_0_10px_rgba(232,121,249,0.3)] hover:shadow-[0_0_15px_rgba(232,121,249,0.5)] transition-all">
                                            <Download className="h-6 w-6" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 tracking-wider mb-6">
                        ENJOY YOUR MEMBERSHIP
                    </h2>
                    <p className="text-cyan-300 text-lg max-w-2xl mx-auto mb-8 opacity-80">
                        Your premium membership unlocks all these exclusive benefits and more
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="px-8 py-3 rounded font-bold tracking-wider bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white shadow-[0_0_10px_rgba(232,121,249,0.5)] hover:shadow-[0_0_15px_rgba(232,121,249,0.7)] transition-all">
                            EXPLORE MORE
                        </button>
                        <button className="px-8 py-3 rounded font-bold tracking-wider border border-cyan-400/50 text-cyan-300 hover:bg-cyan-950/30 transition-all">
                            ACCOUNT SETTINGS
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

