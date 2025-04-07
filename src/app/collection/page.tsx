"use client"

import { useState } from "react"
import { ChevronRight, Heart, MoreHorizontal, Play, Pause, Share2, Plus, Compass } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useLikedTracks } from "@/hooks/useTrackExplorer"
import { usePlayerStore } from "@/store/playerStore"
import { Track } from "@/types/track"
import ProfileMenu from "@/components/ProfileMenu"

export default function MusicCollection() {
    const router = useRouter()
    const [currentPage, setCurrentPage] = useState(1)

    // Get player state from store
    const {
        currentTrack,
        isPlaying,
        setCurrentTrack,
        setIsPlaying
    } = usePlayerStore()

    // Fetch user's liked tracks
    const { data: likedTracksData, isLoading, error } = useLikedTracks({
        page: currentPage,
        per_page: 12
    })

    // Handle play button click
    const handlePlayTrack = (track: Track) => {
        if (currentTrack?.id === track.id) {
            setIsPlaying(!isPlaying)
        } else {
            setCurrentTrack(track)
            setIsPlaying(true)
            router.push(`/music/player?id=${track.id}`)
        }
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
            <div className="relative z-10 max-w-5xl mx-auto">
                {/* Header with Profile Icon */}
                <div className="flex justify-between items-center mt-8">
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 tracking-wider">
                        MY COLLECTION & ENGAGEMENT
                    </h1>
                    <ProfileMenu />
                </div>

                {/* Discover Music Button */}
                <div className="mt-8">
                    <div className="bg-gradient-to-br from-cyan-600 to-fuchsia-600 rounded-lg shadow-[0_0_15px_rgba(255,44,201,0.5)] border border-fuchsia-500/50 p-6 backdrop-blur-sm">
                        <button onClick={(() => router.push('/music'))} className="w-full h-full flex flex-col items-center justify-center gap-3 text-white hover:text-cyan-100 transition-colors py-2">
                            <Compass className="h-8 w-8" />
                            <span className="font-medium text-lg">Discover Music</span>
                        </button>
                    </div>
                </div>
                {/* Main content */}
                <div className="container mx-auto px-4 py-8 relative z-10">
                    <div className="max-w-6xl mx-auto">
                        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 mb-8">
                            My Collection
                        </h1>

                        {/* Liked Tracks Section */}
                        <div className="bg-gradient-to-br from-gray-900 to-indigo-950 rounded-lg shadow-[0_0_15px_rgba(255,44,201,0.3)] border border-fuchsia-500/30 p-6 backdrop-blur-sm mb-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
                                    MY MUSIC COLLECTION
                                </h2>
                                <button className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center">
                                    View All <ChevronRight className="h-4 w-4 ml-1" />
                                </button>
                            </div>

                            {isLoading ? (
                                <div className="flex justify-center py-8">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-fuchsia-500"></div>
                                </div>
                            ) : error ? (
                                <div className="text-center text-red-400 py-8">
                                    Failed to load your collection. Please try again.
                                </div>
                            ) : !likedTracksData || likedTracksData.tracks.length === 0 ? (
                                <div className="text-center text-cyan-300 py-8">
                                    You haven't liked any tracks yet. Explore music and add tracks to your collection!
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {/* {likedTracksData.tracks.map((track: Track) => (
                                        <div key={track.id} className="bg-indigo-950/50 rounded-lg p-4 border border-indigo-800/30 hover:border-cyan-500/30 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="h-20 w-20 rounded bg-gradient-to-br from-cyan-500 to-fuchsia-500 p-0.5 shadow-[0_0_10px_rgba(255,44,201,0.3)] flex-shrink-0">
                                                    <div className="h-full w-full rounded overflow-hidden relative group">
                                                        <Image
                                                            src={track.artwork_url || "/placeholder.svg"}
                                                            alt={track.title}
                                                            width={80}
                                                            height={80}
                                                            className="h-full w-full object-cover"
                                                        />
                                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                className="h-12 w-12 rounded-full bg-cyan-500/80 flex items-center justify-center"
                                                                onClick={() => handlePlayTrack(track)}
                                                            >
                                                                {currentTrack?.id === track.id && isPlaying ? (
                                                                    <Pause className="h-6 w-6 text-white" />
                                                                ) : (
                                                                    <Play className="h-6 w-6 text-white ml-1" />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-fuchsia-400 text-lg">{track.title}</h3>
                                                    <p className="text-sm text-cyan-300/70 mb-2">{track.artist.name} • {track.genre || "No genre"}</p>
                                                    <div className="flex items-center gap-3">
                                                        <button className="p-2 rounded-full bg-indigo-900/50 hover:bg-indigo-800/50 transition-colors">
                                                            <Heart className="h-5 w-5 text-fuchsia-400" fill="currentColor" />
                                                        </button>
                                                        <button className="p-2 rounded-full bg-indigo-900/50 hover:bg-indigo-800/50 transition-colors">
                                                            <Share2 className="h-5 w-5 text-cyan-400" />
                                                        </button>
                                                        <button className="p-2 rounded-full bg-indigo-900/50 hover:bg-indigo-800/50 transition-colors">
                                                            <MoreHorizontal className="h-5 w-5 text-cyan-400" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))} */}
                                </div>
                            )}

                            {/* Pagination */}
                            {/* {likedTracksData && likedTracksData.pages > 1 && (
                                <div className="flex justify-center mt-8">
                                    <div className="flex space-x-2">
                                        {Array.from({ length: likedTracksData.pages }, (_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setCurrentPage(i + 1)}
                                                className={`w-8 h-8 rounded-full flex items-center justify-center ${likedTracksData.current_page === i + 1
                                                    ? "bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white"
                                                    : "bg-indigo-950/50 border border-fuchsia-500/30 text-cyan-300"
                                                    }`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )} */}
                        </div>

                        {/* Footer */}
                        <footer className="border-t border-indigo-800/30 pt-6 pb-8 text-center">
                            <p className="text-sm text-cyan-300/70">
                                &copy; {new Date().getFullYear()} Dreamster.io • All rights reserved
                            </p>
                        </footer>
                    </div>
                </div>
            </div>

        </div>
    )
}

