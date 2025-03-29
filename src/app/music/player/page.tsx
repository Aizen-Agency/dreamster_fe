"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Heart, Share2, Download, ShoppingCart } from "lucide-react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { usePlayerStore } from "@/store/playerStore"
import { Progress } from "@/components/ui/progress"
import { useTrackDetails, useTrackStream, useTrackLikes } from "@/hooks/useTrackExplorer"
import { Button } from "@/components/ui/button"
import * as Slider from "@radix-ui/react-slider"
// import { toast } from "@/components/ui/use-toast"
import { useAuthStore } from "@/store/authStore"

export default function MusicPlayer() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const trackId = searchParams.get('id')
    const audioRef = useRef<HTMLAudioElement>(null)
    const isAuthenticated = useAuthStore(state => !!state.token)

    // Fetch track details and stream URL
    const { data: trackData, isLoading: isLoadingTrack } = useTrackDetails(trackId)
    const { data: streamData, isLoading: isLoadingStream } = useTrackStream(trackId)

    // Get like functionality
    const {
        isLiked,
        likesCount,
        toggleLike,
        isLoading: isLoadingLikeStatus
    } = useTrackLikes(trackId)

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
    const [loadingProgress, setLoadingProgress] = useState(0)
    const [isBuffering, setIsBuffering] = useState(false)
    const [isAudioReady, setIsAudioReady] = useState(false)

    // Add a ref to track the last known position
    const lastKnownPositionRef = useRef(0)

    useEffect(() => {
        if (trackData && !currentTrack) {
            setCurrentTrack(trackData)
            setIsPlaying(false)
        }
    }, [trackData, currentTrack, setCurrentTrack, setIsPlaying])

    // Set stream URL when available
    useEffect(() => {
        if (streamData?.stream_url) {
            setStreamUrl(streamData.stream_url)
        }
    }, [streamData, setStreamUrl])

    // Toggle play/pause with better error handling - wrap in useCallback
    const togglePlayPause = useCallback(() => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            // Make sure we update the current time one last time when pausing
            setCurrentTime(audioRef.current.currentTime);
            // Set isPlaying after updating the time to prevent re-render issues
            setIsPlaying(false);
        } else {
            // Check if we have a stream URL before attempting to play
            if (!streamData?.stream_url) {
                console.error("No stream URL available");
                return;
            }

            // Ensure audio has a source
            if (!audioRef.current.src) {
                audioRef.current.src = streamData.stream_url;
                audioRef.current.load();
            }

            // If we're resuming from a position, don't reset it
            // Only attempt to play
            audioRef.current.play().catch(err => {
                console.error("Playback failed:", err);
                setIsPlaying(false);
            });

            setIsPlaying(true);
        }
    }, [isPlaying, setIsPlaying, streamData, setCurrentTime]);

    // Format time for display (mm:ss) - wrap in useCallback
    const formatTime = useCallback((time: number) => {
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
    }, []);

    // Handle seeking - wrap in useCallback
    const handleSeek = useCallback((value: number[]) => {
        if (!audioRef.current || !duration) return

        const seekTime = value[0]
        audioRef.current.currentTime = seekTime
        setCurrentTime(seekTime)
    }, [duration, setCurrentTime]);

    // Handle progress bar click for seeking - wrap in useCallback
    const handleProgressBarClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!audioRef.current || !duration) return

        const progressBar = e.currentTarget
        const rect = progressBar.getBoundingClientRect()
        const clickPosition = (e.clientX - rect.left) / rect.width
        const seekTime = clickPosition * duration

        audioRef.current.currentTime = seekTime
        setCurrentTime(seekTime)
    }, [duration, setCurrentTime]);

    // Handle volume change - wrap in useCallback
    const handleVolumeChange = useCallback((value: number[]) => {
        if (!audioRef.current) return

        const newVolume = value[0]
        setVolume(newVolume)
        audioRef.current.volume = newVolume
    }, []);

    // Handle like/unlike - wrap in useCallback
    const handleToggleLike = useCallback(() => {
        if (!isAuthenticated) {
            // toast({
            //     title: "Authentication required",
            //     description: "Please sign in to like tracks",
            //     variant: "destructive"
            // })
            return
        }

        if (!trackId) return

        toggleLike(trackId)
    }, [isAuthenticated, trackId, toggleLike]);

    // Handle purchase function - wrap in useCallback
    const handlePurchase = useCallback(() => {
        router.push(`/music/purchase?id=${trackId}`)
    }, [router, trackId]);

    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return

        const updateProgress = () => {
            if (audio.currentTime) {
                setCurrentTime(audio.currentTime)
            }
        }
        const handleDurationChange = () => {
            if (audio.duration && !isNaN(audio.duration)) {
                setDuration(audio.duration)
            }
        }
        const handleEnded = () => {
            setIsPlaying(false);
            setCurrentTime(0);
        }
        const handleWaiting = () => setIsBuffering(true)
        const handlePlaying = () => {
            setIsBuffering(false)
            setIsAudioReady(true)
        }
        const handleLoadStart = () => {
            setLoadingProgress(0)
            setIsAudioReady(false)
        }
        const handleProgress = () => {
            if (audio.buffered.length > 0) {
                const bufferedEnd = audio.buffered.end(audio.buffered.length - 1)
                const duration = audio.duration
                if (duration > 0 || isPlaying == false) {
                    setLoadingProgress((bufferedEnd / duration) * 100)
                }
            }
        }
        const handleCanPlayThrough = () => {
            setIsAudioReady(true)
            if (audio.duration && !isNaN(audio.duration)) {
                setDuration(audio.duration)
            }
        }

        // Add all event listeners at once
        audio.addEventListener("timeupdate", updateProgress)
        audio.addEventListener("durationchange", handleDurationChange)
        audio.addEventListener("ended", handleEnded)
        audio.addEventListener("waiting", handleWaiting)
        audio.addEventListener("playing", handlePlaying)
        audio.addEventListener("loadstart", handleLoadStart)
        audio.addEventListener("progress", handleProgress)
        audio.addEventListener("canplaythrough", handleCanPlayThrough)

        return () => {
            // Remove all event listeners at once
            audio.removeEventListener("timeupdate", updateProgress)
            audio.removeEventListener("durationchange", handleDurationChange)
            audio.removeEventListener("ended", handleEnded)
            audio.removeEventListener("waiting", handleWaiting)
            audio.removeEventListener("playing", handlePlaying)
            audio.removeEventListener("loadstart", handleLoadStart)
            audio.removeEventListener("progress", handleProgress)
            audio.removeEventListener("canplaythrough", handleCanPlayThrough)
        }
    }, [setCurrentTime, setDuration, setIsPlaying, setLoadingProgress, isPlaying]);

    // Set audio source when stream URL changes
    useEffect(() => {
        if (audioRef.current && streamData?.stream_url) {
            // Reset states when source changes
            setCurrentTime(0)
            setLoadingProgress(0)
            setIsBuffering(true)
            setIsAudioReady(false)

            // Set the source
            audioRef.current.src = streamData.stream_url
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

                // Only play if isPlaying is true (which should be false by default)
                if (isPlaying) {
                    audioRef.current?.play().catch(err => {
                        console.error("Playback failed:", err)
                        setIsPlaying(false)
                    })
                }
            }

            audioRef.current.addEventListener("loadedmetadata", handleLoadedMetadata)
            audioRef.current.addEventListener("canplaythrough", handleCanPlayThrough)

            return () => {
                audioRef.current?.removeEventListener("loadedmetadata", handleLoadedMetadata)
                audioRef.current?.removeEventListener("canplaythrough", handleCanPlayThrough)
            }
        }
    }, [streamData, setIsPlaying, setCurrentTime, setDuration, isPlaying])

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleError = (e: ErrorEvent) => {
            console.error("Audio playback error:", e);
            setIsPlaying(false);
            setIsBuffering(false);
        };

        audio.addEventListener("error", handleError);

        return () => {
            audio.removeEventListener("error", handleError);
        };
    }, [setIsPlaying]);

    useEffect(() => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.play().catch(err => {
                console.error("Playback failed:", err);
                setIsPlaying(false);
            });
        } else {
            audioRef.current.pause();
            // Don't update currentTime here as it can cause a race condition
        }
    }, [isPlaying, setIsPlaying]);

    // Modify the continuous update effect (around line 303)
    useEffect(() => {
        if (!audioRef.current) return;

        // This should update the UI with the current time, even when paused
        const updateCurrentTime = () => {
            if (audioRef.current) {
                const currentAudioTime = audioRef.current.currentTime;

                // Only update if playing or if the time is different from last known
                if (isPlaying || Math.abs(currentAudioTime - lastKnownPositionRef.current) > 0.1) {
                    setCurrentTime(currentAudioTime);
                    lastKnownPositionRef.current = currentAudioTime;
                }
            }
        };

        // Initial update
        updateCurrentTime();

        // Run the interval more frequently for smoother updates
        const updateInterval = setInterval(updateCurrentTime, 50);

        return () => clearInterval(updateInterval);
    }, [setCurrentTime, isPlaying]);

    useEffect(() => {
        console.log("Audio state:", {
            isPlaying,
            isBuffering,
            isAudioReady,
            streamUrl: streamData?.stream_url,
            currentTrack: currentTrack?.title,
            duration
        });
    }, [isPlaying, isBuffering, isAudioReady, streamData, currentTrack, duration]);

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

    let progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0

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
                                <button
                                    className="bg-gradient-to-r from-cyan-500 to-fuchsia-500 w-[100%] text-white py-2 px-4 mb-4 rounded-full font-bold flex items-center text-sm justify-center transition-all duration-300 ease-in-out"
                                    onClick={togglePlayPause}
                                    disabled={isBuffering && !isAudioReady}
                                >
                                    <div className="flex items-center justify-center">
                                        {isBuffering && !isAudioReady ? (
                                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                                        ) : isPlaying ? (
                                            <Pause size={24} className="transition-transform duration-300 ease-in-out" />
                                        ) : (
                                            <Play size={24} className="transition-transform duration-300 ease-in-out" />
                                        )}
                                        <span className="ml-2">
                                            {isBuffering && !isAudioReady ? "Loading..." : isPlaying ? "Pause" : "Play"}
                                        </span>
                                    </div>
                                </button>
                                <div className="flex items-center gap-4 mb-4">
                                    <span className="text-sm text-cyan-300 min-w-[40px]">
                                        {formatTime(currentTime)}
                                    </span>

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
                                            {isAudioReady && (
                                                <div
                                                    className="absolute block w-3 h-3 bg-white rounded-full shadow-md hover:bg-fuchsia-200 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transform -translate-y-1/2 top-1/2"
                                                    style={{ left: `calc(${progressPercentage}% - 6px)` }}
                                                />
                                            )}
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
                                        onClick={handleToggleLike}
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
                                <span className="text-fuchsia-300 text-xs">{likesCount} likes</span>
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

