"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Play, Download, ExternalLink, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useUserLibrary } from "@/hooks/usePayments"
import { useAuthStore } from "@/store/authStore"

export default function UserLibrary() {
    const router = useRouter()
    const { isLoggedIn } = useAuthStore()
    const [searchQuery, setSearchQuery] = useState("")

    const { data, isLoading, error } = useUserLibrary()

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login?redirect=/user/library')
        }
    }, [isLoggedIn, router])

    const handlePlayTrack = (trackId: string) => {
        router.push(`/music/player?id=${trackId}`)
    }

    const filteredTracks = data?.library?.filter((track: any) =>
        track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.artist.toLowerCase().includes(searchQuery.toLowerCase())
    ) || []

    if (!isLoggedIn) {
        return null
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-black p-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 mb-8">
                    My NFT Music Library
                </h1>

                <div className="bg-indigo-950/80 backdrop-blur-sm rounded-xl border border-fuchsia-500/30 p-6 shadow-[0_0_30px_rgba(192,38,211,0.2)]">
                    {/* Search and filters */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="relative flex-grow">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400 h-4 w-4" />
                            <Input
                                type="text"
                                placeholder="Search your library..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-indigo-900/50 border-indigo-700 text-white focus:border-cyan-400"
                            />
                        </div>
                        <Button variant="outline" className="border-fuchsia-500 text-fuchsia-500">
                            <Filter className="h-4 w-4 mr-2" />
                            Filter
                        </Button>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-fuchsia-500"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8 text-red-400">
                            Failed to load your library. Please try again.
                        </div>
                    ) : filteredTracks.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-cyan-300 mb-2">Your library is empty</p>
                            <p className="text-fuchsia-300 text-sm mb-6">Purchase your first NFT track to start your collection</p>
                            <Button
                                onClick={() => router.push('/music/explore')}
                                className="bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white"
                            >
                                Explore Tracks
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredTracks.map((track: any) => (
                                <div
                                    key={track.id}
                                    className="bg-indigo-900/30 rounded-lg border border-indigo-700/50 overflow-hidden hover:border-fuchsia-500/50 transition-all"
                                >
                                    <div className="aspect-square relative">
                                        {track.artwork_url ? (
                                            <img
                                                src={track.artwork_url}
                                                alt={track.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-indigo-800 to-fuchsia-900 flex items-center justify-center">
                                                <span className="text-4xl text-white opacity-30">♪</span>
                                            </div>
                                        )}
                                        <Button
                                            variant="default"
                                            size="icon"
                                            onClick={() => handlePlayTrack(track.id)}
                                            className="absolute bottom-4 right-4 rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white shadow-lg"
                                        >
                                            <Play className="h-5 w-5" />
                                        </Button>
                                        {track.exclusive && (
                                            <div className="absolute top-3 left-3 bg-fuchsia-500 text-white text-xs px-2 py-1 rounded-full">
                                                Exclusive
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-white mb-1 truncate">{track.title}</h3>
                                        <p className="text-cyan-300 text-sm mb-3">{track.artist}</p>
                                        <div className="flex justify-between items-center">
                                            <div className="text-fuchsia-300 text-sm">
                                                Token ID: <span className="font-mono">{track.token_id}</span>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-cyan-400 hover:text-cyan-300"
                                                onClick={() => window.open(`https://etherscan.io/token/${process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS}?a=${track.token_id}`, '_blank')}
                                            >
                                                <ExternalLink className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
} 