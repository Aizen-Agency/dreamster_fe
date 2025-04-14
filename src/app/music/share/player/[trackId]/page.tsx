"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX, Heart, ChevronLeft, ShoppingCart } from "lucide-react"
import * as Slider from "@radix-ui/react-slider"
import { Button } from "@/components/ui/button"
import MusicianProfile from "@/components/musician-profile"
// import FanEarningsInfo from "@/components/dreamster-info"
import { useTrackDetails, useTrackStream, useTrackLikes } from "@/hooks/useTrackExplorer"
import { useRouter, useParams } from "next/navigation"
import { useAuthStore } from "@/store/authStore"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import Link from "next/link"

const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
}

const PREVIEW_LIMIT_SECONDS = 30

export default function MusicPlayer() {
    const router = useRouter()
    const params = useParams()
    const trackId = params.trackId as string
    const isAuthenticated = useAuthStore(state => !!state.token)

    // Player state
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [volume, setVolume] = useState(1)
    const [duration, setDuration] = useState(0)
    const [showLoginPrompt, setShowLoginPrompt] = useState(false)
    const [isBuffering, setIsBuffering] = useState(false)
    const [isAudioReady, setIsAudioReady] = useState(false)
    const [audioError, setAudioError] = useState<string | null>(null)
    const [loadingProgress, setLoadingProgress] = useState(0)
    const [progressPercentage, setProgressPercentage] = useState(0)

    // Refs
    const audioRef = useRef<HTMLAudioElement>(null)
    const previewTimerRef = useRef<NodeJS.Timeout | null>(null)
    const lastKnownPositionRef = useRef(0)

    // Fetch track data
    const { data: trackData, isLoading: isLoadingTrack } = useTrackDetails(trackId)
    const { data: streamData, isLoading: isLoadingStream } = useTrackStream(trackId)

    // Get like functionality
    const {
        isLiked,
        likesCount,
        toggleLike,
        isLoading: isLoadingLikeStatus
    } = useTrackLikes(trackId)

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause()
                setIsPlaying(false)

                // Store the last known position when pausing
                lastKnownPositionRef.current = audioRef.current.currentTime

                if (previewTimerRef.current) {
                    clearTimeout(previewTimerRef.current)
                    previewTimerRef.current = null
                }
            } else {
                // Check if we're already at or beyond the preview limit for non-authenticated users
                if (!isAuthenticated && audioRef.current.currentTime >= 30) {
                    // Force position to preview limit
                    audioRef.current.currentTime = PREVIEW_LIMIT_SECONDS
                    setCurrentTime(PREVIEW_LIMIT_SECONDS)
                    setShowLoginPrompt(true)
                    return
                }

                // Start playing
                audioRef.current.play()
                    .then(() => {
                        setIsPlaying(true)

                        // Set preview timer for non-authenticated users
                        if (!isAuthenticated) {
                            const timeRemaining = Math.max(0, PREVIEW_LIMIT_SECONDS - audioRef.current!.currentTime) * 1000
                            previewTimerRef.current = setTimeout(() => {
                                if (audioRef.current) {
                                    audioRef.current.pause()
                                    // Force position to preview limit
                                    audioRef.current.currentTime = PREVIEW_LIMIT_SECONDS
                                    setCurrentTime(PREVIEW_LIMIT_SECONDS)
                                    setIsPlaying(false)
                                    setShowLoginPrompt(true)
                                }
                            }, timeRemaining)
                        }
                    })
                    .catch(err => {
                        console.error("Playback failed:", err)
                        setAudioError(`Failed to play audio: ${err.message}`)
                    })
            }
        }
    }

    const handleVolumeChange = (newValue: number[]) => {
        const newVolume = newValue[0]
        setVolume(newVolume)
        if (audioRef.current) {
            audioRef.current.volume = newVolume
        }
    }

    const handleSeek = (newValue: number[]) => {
        const seekTime = newValue[0]

        // Prevent seeking beyond preview limit for non-authenticated users
        if (!isAuthenticated && seekTime > PREVIEW_LIMIT_SECONDS) {
            setShowLoginPrompt(true)
            // Force position to preview limit
            if (audioRef.current) {
                audioRef.current.currentTime = PREVIEW_LIMIT_SECONDS
            }
            setCurrentTime(PREVIEW_LIMIT_SECONDS)
            return
        }

        setCurrentTime(seekTime)
        if (audioRef.current) {
            audioRef.current.currentTime = seekTime
        }
    }

    const handleProgress = () => {
        if (audioRef.current) {
            const audio = audioRef.current;
            if (audio.buffered.length > 0) {
                const bufferedEnd = audio.buffered.end(audio.buffered.length - 1);
                if (duration > 0) {
                    setLoadingProgress((bufferedEnd / duration) * 100);
                }
            }
        }
    }

    // Add this function to handle progress bar clicks
    const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!audioRef.current || !duration) return;

        const progressBar = e.currentTarget;
        const rect = progressBar.getBoundingClientRect();
        const clickPosition = (e.clientX - rect.left) / rect.width;
        const seekTime = clickPosition * duration;

        // Prevent seeking beyond preview limit for non-authenticated users
        if (!isAuthenticated && seekTime > PREVIEW_LIMIT_SECONDS) {
            setShowLoginPrompt(true);
            // Force position to preview limit
            audioRef.current.currentTime = PREVIEW_LIMIT_SECONDS;
            setCurrentTime(PREVIEW_LIMIT_SECONDS);
            return;
        }

        audioRef.current.currentTime = seekTime;
        setCurrentTime(seekTime);
    }

    // Add this effect to handle the preview limit specifically
    useEffect(() => {
        if (!audioRef.current || isAuthenticated) return;

        // This function will check if we need to enforce the preview limit
        const enforcePreviewLimit = () => {
            const audio = audioRef.current;
            if (!audio) return;

            // If we're beyond the preview limit
            if (audio.currentTime > PREVIEW_LIMIT_SECONDS) {
                console.log("Enforcing preview limit at:", audio.currentTime);

                // Pause the audio
                audio.pause();
                setIsPlaying(false);

                // Reset to exactly the preview limit
                audio.currentTime = PREVIEW_LIMIT_SECONDS;
                setCurrentTime(PREVIEW_LIMIT_SECONDS);

                // Show login prompt
                setShowLoginPrompt(true);
            }
        };

        // Check frequently (every 100ms)
        const limitCheckInterval = setInterval(enforcePreviewLimit, 100);

        // Also add a direct event listener for timeupdate
        const handleTimeUpdate = () => {
            enforcePreviewLimit();
        };

        audioRef.current.addEventListener("timeupdate", handleTimeUpdate);

        return () => {
            clearInterval(limitCheckInterval);
            audioRef.current?.removeEventListener("timeupdate", handleTimeUpdate);
        };
    }, [isAuthenticated, setCurrentTime, setIsPlaying]);

    // Add this effect to enforce the preview limit by capping the progress percentage
    useEffect(() => {
        if (!isAuthenticated && duration > 0) {
            // Calculate the maximum allowed percentage for non-authenticated users
            const maxAllowedPercentage = (PREVIEW_LIMIT_SECONDS / duration) * 100;

            // If current percentage exceeds the limit
            if (progressPercentage > maxAllowedPercentage) {
                console.log("Capping progress percentage at:", maxAllowedPercentage);

                // Cap the percentage
                setProgressPercentage(maxAllowedPercentage);

                // Also update the current time and audio position
                const limitedTime = PREVIEW_LIMIT_SECONDS;
                setCurrentTime(limitedTime);

                // If playing, pause the audio and show login prompt
                if (isPlaying && audioRef.current) {
                    audioRef.current.pause();
                    setIsPlaying(false);
                    setShowLoginPrompt(true);
                }

                // Force the audio position to the limit
                if (audioRef.current) {
                    audioRef.current.currentTime = limitedTime;
                }
            }
        }
    }, [progressPercentage, isAuthenticated, duration, isPlaying]);

    // Handle audio element events
    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return

        const updateProgress = () => {
            const newTime = audio.currentTime;

            // For non-authenticated users, enforce the preview limit
            if (!isAuthenticated && duration > 0) {
                const maxAllowedTime = PREVIEW_LIMIT_SECONDS;
                const maxAllowedPercentage = (maxAllowedTime / duration) * 100;

                if (newTime >= maxAllowedTime) {
                    if (isPlaying) {
                        audio.pause();
                        setIsPlaying(false);
                        setShowLoginPrompt(true);
                    }

                    // Force position to preview limit
                    audio.currentTime = maxAllowedTime;
                    setCurrentTime(maxAllowedTime);
                    setProgressPercentage(maxAllowedPercentage);
                    return; // Return early to prevent further execution
                }
            }

            // Only execute this code if we're not at the preview limit
            setCurrentTime(newTime);

            if (duration > 0) {
                // Calculate the new percentage but cap it for non-authenticated users
                let newPercentage = (newTime / duration) * 100;
                if (!isAuthenticated) {
                    const maxAllowedPercentage = (PREVIEW_LIMIT_SECONDS / duration) * 100;
                    newPercentage = Math.min(newPercentage, maxAllowedPercentage);
                }
                setProgressPercentage(newPercentage);
            }
        }

        const handleEnded = () => {
            setIsPlaying(false)
            setCurrentTime(0)
        }

        const handleLoadedMetadata = () => {
            setDuration(audio.duration)
            setIsAudioReady(true)
            setIsBuffering(false)
        }

        const handleWaiting = () => setIsBuffering(true)
        const handlePlaying = () => setIsBuffering(false)
        const handleError = () => {
            setAudioError("Error loading audio")
            setIsPlaying(false)
            setIsBuffering(false)
        }

        audio.addEventListener("timeupdate", updateProgress)
        audio.addEventListener("ended", handleEnded)
        audio.addEventListener("loadedmetadata", handleLoadedMetadata)
        audio.addEventListener("waiting", handleWaiting)
        audio.addEventListener("playing", handlePlaying)
        audio.addEventListener("error", handleError)
        audio.addEventListener("progress", handleProgress)

        return () => {
            if (previewTimerRef.current) {
                clearTimeout(previewTimerRef.current)
            }

            audio.removeEventListener("timeupdate", updateProgress)
            audio.removeEventListener("ended", handleEnded)
            audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
            audio.removeEventListener("waiting", handleWaiting)
            audio.removeEventListener("playing", handlePlaying)
            audio.removeEventListener("error", handleError)
            audio.removeEventListener("progress", handleProgress)
        }
    }, [isAuthenticated, isPlaying, duration]);

    // Set audio source when stream data is available
    useEffect(() => {
        if (!audioRef.current) return

        if (streamData?.stream_url || trackData?.audio_url) {
            // Reset states when source changes
            setCurrentTime(0)
            setLoadingProgress(0)
            setIsBuffering(true)
            setIsAudioReady(false)

            // Reset the last known position when changing tracks
            lastKnownPositionRef.current = 0

            // Set the source
            audioRef.current.src = streamData?.stream_url || trackData?.audio_url || ''
            audioRef.current.load()

            // Force the audio to load and calculate duration without playing
            const handleLoadedMetadata = () => {
                if (audioRef.current && audioRef.current.duration && !isNaN(audioRef.current.duration)) {
                    setDuration(audioRef.current.duration)
                    console.log("Duration set from loadedmetadata:", audioRef.current.duration)
                    setIsAudioReady(true)
                    setIsBuffering(false)
                }
            }

            // Use the canplaythrough event only for play state management
            const handleCanPlayThrough = () => {
                setIsAudioReady(true)
                setIsBuffering(false)

                // Double-check duration
                if (audioRef.current && audioRef.current.duration && !isNaN(audioRef.current.duration)) {
                    setDuration(audioRef.current.duration)
                }
            }

            audioRef.current.addEventListener("loadedmetadata", handleLoadedMetadata)
            audioRef.current.addEventListener("canplaythrough", handleCanPlayThrough)

            return () => {
                audioRef.current?.removeEventListener("loadedmetadata", handleLoadedMetadata)
                audioRef.current?.removeEventListener("canplaythrough", handleCanPlayThrough)
            }
        }
    }, [streamData, trackData])

    // Update the progress percentage whenever currentTime or duration changes
    useEffect(() => {
        if (duration > 0) {
            setProgressPercentage((currentTime / duration) * 100)
        } else {
            setProgressPercentage(0)
        }
    }, [currentTime, duration])

    const handleBack = () => {
        router.back()
    }

    const handlePurchase = () => {
        if (!isAuthenticated) {
            setShowLoginPrompt(true)
            return
        }

        router.push(`/music/purchase?id=${trackId}`)
    }

    const handleLike = () => {
        if (!isAuthenticated) {
            setShowLoginPrompt(true)
            return
        }

        toggleLike(trackId)
    }

    if (isLoadingTrack || isLoadingStream) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-black p-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-fuchsia-500"></div>
            </div>
        )
    }

    if (!trackData) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-black p-4">
                <div className="bg-gradient-to-br from-gray-900 to-indigo-950 rounded-lg shadow-lg border border-fuchsia-500/30 p-6 max-w-md">
                    <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 mb-4">
                        Track Not Found
                    </h2>
                    <p className="text-cyan-300 mb-6">
                        The track you're looking for doesn't exist or has been removed.
                    </p>
                    <Button
                        onClick={() => router.push('/music')}
                        className="bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white py-2 px-4 rounded-full font-bold"
                    >
                        Browse Music
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-black p-4">
            <div className="container mx-auto max-w-6xl">
                <h1 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 tracking-wider dreamster-logo">
                    DREAMSTER
                </h1>
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="bg-gradient-to-br from-gray-900 to-indigo-950 rounded-lg shadow-lg border border-fuchsia-500/30 lg:max-w-md w-full p-6 space-y-4 lg:flex-shrink-0">
                        <Button
                            onClick={handleBack}
                            variant="ghost"
                            size="icon"
                            className="text-cyan-400 hover:text-cyan-300 transition-colors mb-4"
                        >
                            <ChevronLeft size={24} />
                        </Button>

                        <img
                            src={trackData.artwork_url || "/placeholder.svg?height=300&width=300"}
                            alt={`${trackData.title} album art`}
                            className="w-full aspect-square object-cover rounded-lg shadow-md"
                        />

                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
                                {trackData.title}
                            </h2>
                            <p className="text-fuchsia-300">{trackData.artist?.name}</p>
                        </div>

                        <div className="space-y-4">
                            <Button
                                onClick={togglePlay}
                                className="w-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white py-3 rounded-full font-bold"
                                disabled={isBuffering || !!audioError}
                            >
                                {isBuffering ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                                ) : isPlaying ? (
                                    <Pause className="mr-2" />
                                ) : (
                                    <Play className="mr-2" />
                                )}
                                {isBuffering ? "Loading..." : isPlaying ? "Pause" : "Play"}
                            </Button>

                            {!isAuthenticated && (
                                <div className="text-xs text-cyan-300 text-center">
                                    {PREVIEW_LIMIT_SECONDS} second preview available. Sign in to listen to the full track.
                                </div>
                            )}

                            <div className="flex items-center space-x-2">
                                <span className="text-xs text-cyan-300 w-10 text-right">{formatTime(currentTime)}</span>
                                <div
                                    className="relative flex-1 h-5 flex items-center cursor-pointer"
                                    onClick={handleProgressBarClick}
                                >
                                    <div className="bg-fuchsia-900 relative grow rounded-full h-1 w-full">
                                        <div
                                            className="absolute bg-fuchsia-700/50 rounded-full h-full"
                                            style={{ width: `${loadingProgress}%` }}
                                        />
                                        <div
                                            className="absolute bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-full h-full"
                                            style={{
                                                width: `${progressPercentage}%`,
                                                transition: isPlaying ? 'width 0.1s linear' : 'none' // Only animate when playing
                                            }}
                                        />
                                        <div
                                            className="absolute block w-3 h-3 bg-white rounded-full shadow-md hover:bg-fuchsia-200 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transform -translate-y-1/2 top-1/2"
                                            style={{ left: `calc(${progressPercentage}% - 6px)` }}
                                        />
                                    </div>
                                </div>
                                <span className="text-xs text-cyan-300 w-10">{formatTime(duration || 0)}</span>
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
                                    onClick={handleLike}
                                    className={`${isLiked ? "text-fuchsia-500" : "text-cyan-400"} hover:text-fuchsia-400`}
                                >
                                    <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
                                </Button>
                            </div>
                        </div>

                        <div className="mt-6 space-y-4 border-t border-fuchsia-500/30 pt-4">
                            <p className="text-cyan-300 text-sm">{trackData.description}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-fuchsia-300 font-bold text-lg">${trackData.starting_price?.toFixed(2) || "0.00"}</span>
                                <Button
                                    onClick={handlePurchase}
                                    className="bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white py-2 px-4 rounded-full font-bold flex items-center"
                                >
                                    <ShoppingCart size={18} className="mr-2" />
                                    Purchase Song
                                </Button>
                            </div>
                        </div>

                        <audio ref={audioRef} preload="auto" />
                    </div>

                    <div className="w-full lg:flex-1 flex flex-col">
                        {/* Musician Profile */}
                        <MusicianProfile artistId={trackData.artist?.id} />

                        {/* Fan Earnings Info Section */}
                        {/* <FanEarningsInfo /> */}
                    </div>
                </div>
            </div>

            {/* Login Prompt Dialog */}
            <Dialog open={showLoginPrompt} onOpenChange={setShowLoginPrompt}>
                <DialogContent className="bg-gradient-to-br from-gray-900 to-indigo-950 border border-fuchsia-500/30 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
                            Want to hear more?
                        </DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-cyan-300 mb-4">
                            Sign in to listen to the full track, like it, and support the artist.
                        </p>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                            <img
                                src={trackData.artwork_url || "/placeholder.svg?height=150&width=150"}
                                alt={trackData.title}
                                className="w-full aspect-square object-cover rounded-lg shadow-md"
                            />
                            <div className="flex flex-col justify-center">
                                <h3 className="font-bold text-fuchsia-400">{trackData.title}</h3>
                                <p className="text-sm text-cyan-300">{trackData.artist?.name}</p>
                                <p className="text-xs text-gray-400 mt-2">
                                    Full track: {formatTime(duration || 0)}
                                </p>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="flex flex-col sm:flex-row gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setShowLoginPrompt(false)}
                            className="border-cyan-500 text-cyan-400 hover:bg-cyan-950"
                        >
                            Continue Previewing
                        </Button>
                        <Button
                            onClick={() => router.push('/auth/login/email')}
                            className="bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white"
                        >
                            Sign In
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
