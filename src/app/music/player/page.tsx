"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Heart, Share2, Download, ShoppingCart } from "lucide-react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { usePlayerStore } from "@/store/playerStore"
import { Progress } from "@/components/ui/progress"
import { useTrackDetails, useTrackStream } from "@/hooks/useTrackExplorer"
import { Button } from "@/components/ui/button"
import * as Slider from "@radix-ui/react-slider"

export default function MusicPlayer() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const trackId = searchParams.get('id')
    const audioRef = useRef<HTMLAudioElement>(null)

    // Fetch track details and stream URL
    const { data: trackData, isLoading: isLoadingTrack } = useTrackDetails(trackId)
    const { data: streamData, isLoading: isLoadingStream } = useTrackStream(trackId)

    // Player state from store
    const {
        currentTrack,
        isPlaying,
        setIsPlaying,
        currentTime,
        setCurrentTime,
        duration,
        setDuration,
        setCurrentTrack,
        setStreamUrl
    } = usePlayerStore()

    const [volume, setVolume] = useState(1)
    const [isLiked, setIsLiked] = useState(false)
    const [loadingProgress, setLoadingProgress] = useState(0)
    const [isBuffering, setIsBuffering] = useState(false)

    // Set track and stream URL when data is loaded
    useEffect(() => {
        if (trackData && !currentTrack) {
            setCurrentTrack(trackData)
        }
    }, [trackData, currentTrack, setCurrentTrack])

    // Set stream URL when available
    useEffect(() => {
        if (streamData?.stream_url) {
            setStreamUrl(streamData.stream_url)

            // Set duration from stream data if available
            if (streamData.duration) {
                setDuration(streamData.duration)
            }
        }
    }, [streamData, setStreamUrl, setDuration])

    // Toggle play/pause
    const togglePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause()
            } else {
                audioRef.current.play().catch(err => {
                    console.error("Playback failed:", err)
                })
            }
            setIsPlaying(!isPlaying)
        }
    }

    // Format time for display (mm:ss)
    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
    }

    // Handle seeking
    const handleSeek = (value: number[]) => {
        if (!audioRef.current || !duration) return

        const seekTime = value[0]
        audioRef.current.currentTime = seekTime
        setCurrentTime(seekTime)
    }

    // Handle progress bar click for seeking
    const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!audioRef.current || !duration) return

        const progressBar = e.currentTarget
        const rect = progressBar.getBoundingClientRect()
        const clickPosition = (e.clientX - rect.left) / rect.width
        const seekTime = clickPosition * duration

        audioRef.current.currentTime = seekTime
        setCurrentTime(seekTime)
    }

    // Handle volume change
    const handleVolumeChange = (value: number[]) => {
        if (!audioRef.current) return

        const newVolume = value[0]
        setVolume(newVolume)
        audioRef.current.volume = newVolume
    }

    // Toggle like function
    const toggleLike = () => {
        setIsLiked(!isLiked)
    }

    // Handle purchase function
    const handlePurchase = () => {
        router.push(`/checkout?trackId=${trackId}`)
    }

    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return

        const updateProgress = () => setCurrentTime(audio.currentTime)
        const handleDurationChange = () => {
            if (audio.duration && !isNaN(audio.duration)) {
                setDuration(audio.duration)
            }
        }
        const handleEnded = () => {
            setIsPlaying(false)
            setCurrentTime(0)
        }
        const handleWaiting = () => setIsBuffering(true)
        const handlePlaying = () => setIsBuffering(false)
        const handleLoadStart = () => setLoadingProgress(0)
        const handleProgress = () => {
            if (audio.buffered.length > 0) {
                const bufferedEnd = audio.buffered.end(audio.buffered.length - 1)
                const duration = audio.duration
                if (duration > 0) {
                    setLoadingProgress((bufferedEnd / duration) * 100)
                }
            }
        }

        audio.addEventListener("timeupdate", updateProgress)
        audio.addEventListener("durationchange", handleDurationChange)
        audio.addEventListener("ended", handleEnded)
        audio.addEventListener("waiting", handleWaiting)
        audio.addEventListener("playing", handlePlaying)
        audio.addEventListener("loadstart", handleLoadStart)
        audio.addEventListener("progress", handleProgress)

        return () => {
            audio.removeEventListener("timeupdate", updateProgress)
            audio.removeEventListener("durationchange", handleDurationChange)
            audio.removeEventListener("ended", handleEnded)
            audio.removeEventListener("waiting", handleWaiting)
            audio.removeEventListener("playing", handlePlaying)
            audio.removeEventListener("loadstart", handleLoadStart)
            audio.removeEventListener("progress", handleProgress)
        }
    }, [setDuration, setIsPlaying, setCurrentTime])

    // Set audio source when stream URL changes
    useEffect(() => {
        if (audioRef.current && streamData?.stream_url) {
            audioRef.current.src = streamData.stream_url
            audioRef.current.load()

            // Auto-play if isPlaying is true
            if (isPlaying) {
                audioRef.current.play().catch(err => {
                    console.error("Playback failed:", err)
                    setIsPlaying(false)
                })
            }
        }
    }, [streamData, isPlaying, setIsPlaying])

    if (isLoadingTrack || isLoadingStream) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-fuchsia-500"></div>
            </div>
        )
    }

    if (!currentTrack || !streamData) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-black flex items-center justify-center">
                <div className="text-white">Track not found</div>
            </div>
        )
    }

    // Calculate progress percentage
    const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-black flex items-center justify-center p-4 relative overflow-hidden">
            {/* Grid background */}
            <div
                className="absolute inset-0 opacity-20"
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
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-fuchsia-600 to-transparent opacity-20" />

            {/* Hidden audio element */}
            <audio ref={audioRef} />

            <div className="bg-gradient-to-br from-gray-900 to-indigo-950 rounded-lg shadow-[0_0_15px_rgba(255,44,201,0.5)] border border-fuchsia-500/30 max-w-md w-full p-6 backdrop-blur-sm relative z-10">
                <div className="space-y-6 text-white">
                    {/* Header */}
                    <div>
                        <h2 className="text-lg font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 tracking-wider">
                            NOW PLAYING
                        </h2>
                    </div>

                    <div className="flex-1 w-full">
                        <div className="bg-indigo-950/50 backdrop-blur-sm rounded-lg border border-fuchsia-500/30 p-6 shadow-[0_0_15px_rgba(255,44,201,0.2)]">
                            <div className="mb-6 flex flex-col items-center">
                                <Image
                                    src={currentTrack.artwork_url || "/placeholder.svg"}
                                    alt={currentTrack.title}
                                    width={300}
                                    height={300}
                                    className="w-full h-full object-cover"
                                />
                                <h1 className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 mb-2">
                                    {currentTrack.title}
                                </h1>
                                <p className="text-cyan-300 text-base">{currentTrack.artist.name}</p>
                            </div>
                            <div className="mb-6">
                                <button className="bg-gradient-to-r from-cyan-500 to-fuchsia-500 w-[100%] text-white py-2 px-4 mb-4 rounded-full font-bold flex items-center text-sm flex justify-center items-center" onClick={togglePlayPause}>
                                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                                    {isPlaying ? "Pause" : "Play"}
                                </button>
                                <div className="flex items-center gap-4 mb-4">
                                    <span className="text-sm text-cyan-300 min-w-[40px]">
                                        {formatTime(currentTime)}
                                    </span>

                                    {/* Custom progress bar that replaces the slider but maintains the look */}
                                    <div
                                        className="relative flex-1 h-5 flex items-center cursor-pointer"
                                        onClick={handleProgressBarClick}
                                    >
                                        {/* Background track */}
                                        <div className="bg-fuchsia-900 relative grow rounded-full h-1 w-full">
                                            {/* Buffered progress */}
                                            <div
                                                className="absolute bg-fuchsia-700/50 rounded-full h-full"
                                                style={{ width: `${loadingProgress}%` }}
                                            />

                                            {/* Playback progress */}
                                            <div
                                                className="absolute bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-full h-full"
                                                style={{ width: `${progressPercentage}%` }}
                                            />

                                            {/* Thumb indicator */}
                                            <div
                                                className="absolute block w-3 h-3 bg-white rounded-full shadow-md hover:bg-fuchsia-200 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transform -translate-y-1/2 top-1/2"
                                                style={{ left: `calc(${progressPercentage}% - 6px)` }}
                                            />
                                        </div>
                                    </div>

                                    <span className="text-xs text-cyan-300 w-10">
                                        {formatTime(duration || 0)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleVolumeChange([volume === 0 ? 1 : 0])}
                                            className="text-cyan-400 hover:text-cyan-300"
                                        >
                                            {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                                        </Button>
                                        <Slider.Root
                                            className="relative flex items-center select-none touch-none w-24 h-5"
                                            value={[volume]}
                                            max={1}
                                            step={0.01}
                                            onValueChange={handleVolumeChange}
                                        >
                                            <Slider.Track className="bg-fuchsia-900 relative grow rounded-full h-1">
                                                <Slider.Range className="absolute bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-full h-full" />
                                            </Slider.Track>
                                            <Slider.Thumb
                                                className="block w-3 h-3 bg-white rounded-full shadow-md hover:bg-fuchsia-200 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                                                aria-label="Volume"
                                            />
                                        </Slider.Root>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={toggleLike}
                                        className={`${isLiked ? "text-fuchsia-500" : "text-cyan-400"} hover:text-fuchsia-400`}
                                    >
                                        <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-cyan-300 font-bold text-xs">{currentTrack.description}</span>
                            </div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-fuchsia-300 font-bold text-lg">${currentTrack.starting_price?.toFixed(2) || "1.99"}</span>
                                <Button
                                    onClick={handlePurchase}
                                    className="bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white py-2 px-4 rounded-full font-bold flex items-center text-sm"
                                >
                                    <ShoppingCart size={16} className="mr-2" />
                                    Purchase
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

