"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { ArrowLeft, Play, Pause, Volume2, VolumeX, User, Music, Clock, Calendar } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useAdminTrackOperations } from "@/hooks/useAdminTrackOperations"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import * as Slider from "@radix-ui/react-slider"
import { useTrackDetails, useTrackStream } from "@/hooks/useTrackExplorer"
import { Track } from "@/types/track"

export default function TrackReview() {
    const params = useParams()
    const router = useRouter()
    const trackId = params.trackid as string

    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [currentTrack, setCurrentTrack] = useState<Track>()
    const [duration, setDuration] = useState(0)
    const [volume, setVolume] = useState(1)
    const audioRef = useRef<HTMLAudioElement>(null)

    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
    const [rejectionReason, setRejectionReason] = useState("")

    const [isAudioReady, setIsAudioReady] = useState(false)
    const [isBuffering, setIsBuffering] = useState(false)
    const [audioError, setAudioError] = useState<string | null>(null)

    const [loadingProgress, setLoadingProgress] = useState(0)

    const { data: track, isLoading, isError: error } = useTrackDetails(trackId)
    const { data: streamData, isLoading: isLoadingStream } = useTrackStream(trackId)
    const { approveTrack, rejectTrack } = useAdminTrackOperations()

    const togglePlayPause = useCallback(() => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            // Check if we have a valid audio source
            if (!streamData?.stream_url && !track?.audio_url) {
                setAudioError("No audio source available");
                return;
            }

            // Make sure audio is ready
            if (!isAudioReady) {
                setIsBuffering(true);
                // Ensure audio has a source
                if (!audioRef.current.src) {
                    // Prioritize stream URL, then fall back to direct URLs
                    audioRef.current.src = streamData?.stream_url || track?.audio_url || '';
                    audioRef.current.load();
                }
            }

            // Try to play
            audioRef.current.play().catch(err => {
                console.error("Playback failed:", err);
                setAudioError(`Failed to play audio: ${err.message}`);
                setIsPlaying(false);
            });


            setIsPlaying(true);
        }
    }, [isPlaying, track, streamData, isAudioReady]);

    const handleSliderChange = (values: number[]) => {
        const newTime = values[0]
        setCurrentTime(newTime)
        if (audioRef.current) {
            audioRef.current.currentTime = newTime
        }
    }

    const handleVolumeChange = (values: number[]) => {
        const newVolume = values[0]
        setVolume(newVolume)
        if (audioRef.current) {
            audioRef.current.volume = newVolume
        }
    }

    const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!audioRef.current || !duration) return;
        const progressBar = e.currentTarget;
        const rect = progressBar.getBoundingClientRect();
        const clickPosition = (e.clientX - rect.left) / rect.width;
        const seekTime = clickPosition * duration;
        audioRef.current.currentTime = seekTime;
        setCurrentTime(seekTime);
    }

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${minutes}:${seconds.toString().padStart(2, "0")}`
    }

    const handleApproveTrack = () => {
        approveTrack.mutate(trackId, {
            onSuccess: () => {
                router.push("/dashboard/admin/tracks")
            }
        })
    }

    const handleRejectTrack = () => {
        if (!rejectionReason.trim()) {
            return
        }

        rejectTrack.mutate(
            { trackId, rejectionReason },
            {
                onSuccess: () => {
                    setIsRejectDialogOpen(false)
                    router.push("/dashboard/admin/tracks")
                }
            }
        )
    }

    const handleMetadataLoaded = useCallback(() => {
        if (audioRef.current) {
            const audioDuration = audioRef.current.duration;
            console.log("Metadata loaded, duration:", audioDuration);

            if (audioDuration && !isNaN(audioDuration) && audioDuration > 0) {
                setDuration(audioDuration);
                setIsAudioReady(true);
            } else {
                console.warn("Invalid duration detected:", audioDuration);
            }
        }
    }, [])

    const handleCanPlayThrough = useCallback(() => {
        if (audioRef.current) {
            console.log("Audio can play through");
            setIsBuffering(false);
            setIsAudioReady(true);

            // Double-check duration
            if (audioRef.current.duration && !isNaN(audioRef.current.duration)) {
                setDuration(audioRef.current.duration);
            }
        }
    }, [])

    const handleProgress = useCallback(() => {
        if (audioRef.current) {
            const audio = audioRef.current;
            if (audio.buffered.length > 0) {
                const bufferedEnd = audio.buffered.end(audio.buffered.length - 1);
                const duration = audio.duration;
                if (duration > 0) {
                    setLoadingProgress((bufferedEnd / duration) * 100);
                }
            }
        }
    }, []);

    useEffect(() => {
        if (track && !currentTrack) {
            setCurrentTrack(track);
            setIsPlaying(false);
        }
    }, [track, currentTrack]);

    useEffect(() => {
        if (!audioRef.current) return;

        const audio = audioRef.current;

        // Reset audio element when stream data or track changes
        audio.pause();
        setIsPlaying(false);
        setCurrentTime(0);
        setIsAudioReady(false);
        setIsBuffering(true);
        setAudioError(null);
        setLoadingProgress(0);

        // Try to use the direct audio URL first, then fall back to stream URL
        if (track?.audio_url) {
            console.log("Using direct audio URL:", track.audio_url);
            audio.src = track.audio_url;
        } else if (streamData?.stream_url) {
            console.log("Using stream URL:", streamData.stream_url);
            audio.src = streamData.stream_url;
        } else {
            console.warn("No audio source available");
            setAudioError("No audio source available. The track might not have an audio file.");
            return; // Exit early if no source
        }

        // Load the audio
        audio.load();

        // Set up all event handlers
        const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
        const handleEnded = () => {
            setIsPlaying(false);
            setCurrentTime(0);
        };
        const handleError = () => {
            setAudioError("Error loading audio");
            setIsPlaying(false);
            setIsBuffering(false);
        };
        const handleWaiting = () => setIsBuffering(true);
        const handlePlaying = () => {
            setIsBuffering(false);
            setIsAudioReady(true);
        };

        // Add all event listeners
        audio.addEventListener("timeupdate", handleTimeUpdate);
        audio.addEventListener("ended", handleEnded);
        audio.addEventListener("loadedmetadata", handleMetadataLoaded);
        audio.addEventListener("canplaythrough", handleCanPlayThrough);
        audio.addEventListener("progress", handleProgress);
        audio.addEventListener("error", handleError);
        audio.addEventListener("waiting", handleWaiting);
        audio.addEventListener("playing", handlePlaying);

        // Cleanup function
        return () => {
            audio.removeEventListener("timeupdate", handleTimeUpdate);
            audio.removeEventListener("ended", handleEnded);
            audio.removeEventListener("loadedmetadata", handleMetadataLoaded);
            audio.removeEventListener("canplaythrough", handleCanPlayThrough);
            audio.removeEventListener("progress", handleProgress);
            audio.removeEventListener("error", handleError);
            audio.removeEventListener("waiting", handleWaiting);
            audio.removeEventListener("playing", handlePlaying);
        };
    }, [streamData, track, handleMetadataLoaded, handleCanPlayThrough, handleProgress]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-fuchsia-500"></div>
            </div>
        )
    }

    if (error || !currentTrack) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-black flex items-center justify-center">
                <div className="bg-gray-900 rounded-lg p-6 max-w-md">
                    <h2 className="text-xl font-bold text-red-400 mb-2">Error Loading Track</h2>
                    <p className="text-gray-300 mb-4">Unable to load track details. The track may have been deleted or you don't have permission to view it.</p>
                    <Link
                        href="/dashboard/admin/tracks"
                        className="inline-flex items-center text-purple-300 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back to Tracks
                    </Link>
                </div>
            </div>
        )
    }

    const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

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
            <div className="relative h-full max-w-5xl mx-auto z-10">
                <Link
                    href="/dashboard/admin/tracks"
                    className="inline-flex items-center text-purple-300 hover:text-white mb-4 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Tracks
                </Link>

                <div className="bg-gradient-to-br from-gray-900 to-indigo-950 rounded-lg shadow-[0_0_15px_rgba(255,44,201,0.3)] border border-fuchsia-500/30 p-6 backdrop-blur-sm">
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="w-full md:w-1/3">
                            <div className="relative aspect-square bg-indigo-950/50 rounded-md overflow-hidden border border-fuchsia-500/30">
                                {currentTrack?.artwork_url ? (
                                    <img
                                        src={currentTrack.artwork_url}
                                        alt={currentTrack.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 flex items-center justify-center">
                                            <span className="text-white text-xl">♪</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="w-full md:w-2/3">
                            <div className="flex items-center gap-2 mb-2">

                                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 tracking-wider">
                                    {currentTrack?.title}
                                </h1>
                                {currentTrack?.status === "pending" && (
                                    <span className="bg-amber-700 text-amber-200 text-xs px-2 py-0.5 rounded">Pending Review</span>
                                )}
                            </div>

                            <h2 className="text-sm font-semibold mb-2 text-fuchsia-400">Description</h2>
                            <p className="text-sm text-white mb-4">
                                {currentTrack?.description || "No description provided."}
                            </p>

                            <div className="mb-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <button
                                        onClick={togglePlayPause}
                                        className="p-3 rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white shadow-[0_0_10px_rgba(232,121,249,0.5)] hover:shadow-[0_0_15px_rgba(232,121,249,0.7)] transition-all"
                                        disabled={isBuffering && !isAudioReady}
                                    >
                                        {isBuffering && !isAudioReady ? (
                                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                        ) : isPlaying ? (
                                            <Pause className="w-5 h-5" />
                                        ) : (
                                            <Play className="w-5 h-5 ml-0.5" />
                                        )}
                                    </button>

                                    <div className="flex items-center gap-4 flex-1">
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
                                                        transition: isPlaying ? 'width 0.1s linear' : 'none'
                                                    }}
                                                />
                                                <div
                                                    className="absolute block w-3 h-3 bg-white rounded-full shadow-md hover:bg-fuchsia-200 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transform -translate-y-1/2 top-1/2"
                                                    style={{ left: `calc(${progressPercentage}% - 6px)` }}
                                                />
                                            </div>
                                        </div>

                                        <span className="text-sm text-cyan-300 min-w-[40px]">
                                            {formatTime(duration || 0)}
                                        </span>
                                    </div>

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
                                </div>
                            </div>

                            <audio ref={audioRef} />

                            {audioError && (
                                <div className="mb-4 p-2 bg-red-900/50 border border-red-500/30 rounded text-red-300 text-sm">
                                    {audioError}
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-6">
                                <div className="flex items-center gap-2 bg-indigo-950/50 p-2 rounded-md border border-cyan-500/20">
                                    <User className="w-4 h-4 text-cyan-400" />
                                    <span className="text-gray-400">Artist:</span>
                                    <span className="text-fuchsia-400">{currentTrack?.artist?.name || "Unknown Artist"}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-indigo-950/50 p-2 rounded-md border border-cyan-500/20">
                                    <Music className="w-4 h-4 text-cyan-400" />
                                    <span className="text-gray-400">Genre:</span>
                                    <span className="text-fuchsia-400">{currentTrack?.genre || "Unspecified"}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-indigo-950/50 p-2 rounded-md border border-cyan-500/20">
                                    <Clock className="w-4 h-4 text-cyan-400" />
                                    <span className="text-gray-400">Duration:</span>
                                    <span className="text-fuchsia-400">{formatTime(duration)}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-indigo-950/50 p-2 rounded-md border border-cyan-500/20">
                                    <Calendar className="w-4 h-4 text-cyan-400" />
                                    <span className="text-gray-400">Upload Date:</span>
                                    <span className="text-fuchsia-400">{new Date(currentTrack?.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h3 className="text-sm font-semibold mb-3 text-fuchsia-400">Moderation Actions</h3>
                                <div className="flex gap-4">
                                    <button
                                        className="flex-1 font-semibold bg-gradient-to-r from-cyan-500 to-emerald-500 text-white py-2 rounded-md flex items-center justify-center gap-2 transition-colors shadow-[0_0_10px_rgba(16,185,129,0.5)] hover:shadow-[0_0_15px_rgba(16,185,129,0.7)]"
                                        onClick={handleApproveTrack}
                                        disabled={approveTrack.isPending}
                                    >
                                        {approveTrack.isPending ? (
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                        ) : (
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M20 6L9 17L4 12"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        )}
                                        APPROVE TRACK
                                    </button>
                                    <button
                                        className="flex-1 font-semibold bg-gradient-to-r from-fuchsia-500 to-red-500 text-white py-2 rounded-md flex items-center justify-center gap-2 transition-colors shadow-[0_0_10px_rgba(239,68,68,0.5)] hover:shadow-[0_0_15px_rgba(239,68,68,0.7)]"
                                        onClick={() => setIsRejectDialogOpen(true)}
                                        disabled={rejectTrack.isPending}
                                    >
                                        {rejectTrack.isPending ? (
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                        ) : (
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M18 6L6 18M6 6L18 18"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        )}
                                        REJECT TRACK
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-gray-900 to-indigo-950 rounded-lg shadow-[0_0_15px_rgba(255,44,201,0.3)] border border-fuchsia-500/30 p-6 backdrop-blur-sm mt-4">
                    <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 uppercase text-sm font-bold mb-4">Submission Details</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                        <div>
                            <p className="text-xs text-cyan-400 mb-1">Submitted By</p>
                            <p className="text-sm text-fuchsia-400">{currentTrack?.artist?.name || "Unknown Artist"}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-cyan-400 mb-1">Submission Date</p>
                            <p className="text-sm text-fuchsia-400">{new Date(currentTrack?.created_at).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="text-xs text-cyan-400 mb-1">File Format</p>
                            <p className="text-sm text-fuchsia-400">{streamData?.file_format || "Unknown"}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-cyan-400 mb-1">File Size</p>
                            <p className="text-sm text-fuchsia-400">{streamData?.file_size_mb} MB</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Rejection Dialog */}
            <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
                <DialogContent className="bg-gradient-to-br from-gray-900 to-indigo-950 border border-fuchsia-500/30 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">Reject Track</DialogTitle>
                        <DialogDescription className="text-cyan-300/70">
                            Please provide a reason for rejecting this track. This feedback will be sent to the artist.
                        </DialogDescription>
                    </DialogHeader>

                    <Textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Enter rejection reason..."
                        className="bg-indigo-950/50 border-fuchsia-500/30 text-white focus:ring-fuchsia-500"
                        rows={4}
                    />

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsRejectDialogOpen(false)}
                            className="border-cyan-500/30 text-cyan-300 hover:bg-indigo-900/50"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleRejectTrack}
                            className="bg-gradient-to-r from-fuchsia-500 to-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.5)] hover:shadow-[0_0_15px_rgba(239,68,68,0.7)]"
                            disabled={!rejectionReason.trim() || rejectTrack.isPending}
                        >
                            {rejectTrack.isPending ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                            ) : null}
                            Reject Track
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

