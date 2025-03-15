"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX, Heart, ChevronLeft, ShoppingCart } from "lucide-react"
import * as Slider from "@radix-ui/react-slider"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
const track = {
    title: "Summer Nights",
    artist: "John Smith",
    duration: 237,
    cover: "/placeholder.svg?height=300&width=300",
    audio: "https://samplelib.com/lib/preview/mp3/sample-15s.mp3",
    description:
        "A dreamy synthwave track that captures the essence of warm summer evenings, blending nostalgic melodies with modern electronic beats.",
    price: 1.99,
}

const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
}

export default function MusicPlayer() {
    const router = useRouter()
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [volume, setVolume] = useState(1)
    const [isLiked, setIsLiked] = useState(false)

    const audioRef = useRef<HTMLAudioElement>(null)

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause()
            } else {
                audioRef.current.play()
            }
            setIsPlaying(!isPlaying)
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
        setCurrentTime(seekTime)
        if (audioRef.current) {
            audioRef.current.currentTime = seekTime
        }
    }

    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return

        const updateProgress = () => setCurrentTime(audio.currentTime)
        const handleEnded = () => {
            setIsPlaying(false)
            setCurrentTime(0)
        }

        audio.addEventListener("timeupdate", updateProgress)
        audio.addEventListener("ended", handleEnded)

        return () => {
            audio.removeEventListener("timeupdate", updateProgress)
            audio.removeEventListener("ended", handleEnded)
        }
    }, [])

    const handleBack = () => {
        console.log("Back button clicked")
        window.history.back()
        // Implement actual back navigation logic here
    }

    const handlePurchase = () => {
        router.push('/music/purchase')
        console.log("Purchase button clicked")
        // Implement actual purchase logic here
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-black p-4">
            <div className="bg-gradient-to-br from-gray-900 to-indigo-950 rounded-lg shadow-lg border border-fuchsia-500/30 max-w-3xl w-full p-6 space-y-4">
                <Button
                    onClick={handleBack}
                    variant="ghost"
                    size="icon"
                    className="text-cyan-400 hover:text-cyan-300 transition-colors mb-4"
                >
                    <ChevronLeft size={24} />
                </Button>

                <img
                    src={track.cover || "/placeholder.svg"}
                    alt={`${track.title} album art`}
                    className="w-full max-w-md mx-auto aspect-square object-cover rounded-lg shadow-md"
                />

                <div className="text-center">
                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
                        {track.title}
                    </h2>
                    <p className="text-fuchsia-300">{track.artist}</p>
                </div>

                <div className="flex space-x-6">
                    <div className="flex-1 space-y-4">
                        <Button
                            onClick={togglePlay}
                            className="w-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white py-3 rounded-full font-bold"
                        >
                            {isPlaying ? <Pause className="mr-2" /> : <Play className="mr-2" />}
                            {isPlaying ? "Pause" : "Play"}
                        </Button>

                        <div className="flex items-center space-x-2">
                            <span className="text-xs text-cyan-300 w-10 text-right">{formatTime(currentTime)}</span>
                            <Slider.Root
                                className="relative flex items-center select-none touch-none w-full h-5"
                                value={[currentTime]}
                                max={track.duration}
                                step={1}
                                onValueChange={handleSeek}
                            >
                                <Slider.Track className="bg-fuchsia-900 relative grow rounded-full h-1">
                                    <Slider.Range className="absolute bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-full h-full" />
                                </Slider.Track>
                                <Slider.Thumb
                                    className="block w-3 h-3 bg-white rounded-full shadow-md hover:bg-fuchsia-200 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                                    aria-label="Seek"
                                />
                            </Slider.Root>
                            <span className="text-xs text-cyan-300 w-10">{formatTime(track.duration)}</span>
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
                                onClick={() => setIsLiked(!isLiked)}
                                className={`${isLiked ? "text-fuchsia-500" : "text-cyan-400"} hover:text-fuchsia-400`}
                            >
                                <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
                            </Button>
                        </div>
                    </div>

                    <div className="w-64 bg-indigo-900/50 rounded-lg p-4 border border-fuchsia-500/30 flex flex-col justify-between">
                        <div>
                            <h3 className="text-cyan-300 font-semibold mb-2">About this track</h3>
                            <p className="text-fuchsia-300 text-sm">{track.description}</p>
                        </div>
                        <div className="mt-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-cyan-300 font-bold text-lg">${track.price.toFixed(2)}</span>
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

                <audio ref={audioRef} src={track.audio} preload="metadata" />
            </div>
        </div>
    )
}

