"use client"

import { useState, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"

const videos = [
    { id: 1, title: "Intro to Dreamster.io", thumbnail: "/placeholder.svg?height=360&width=640" },
    { id: 2, title: "AI Mastering Demo", thumbnail: "/placeholder.svg?height=360&width=640" },
    { id: 3, title: "Synthwave Presets Showcase", thumbnail: "/placeholder.svg?height=360&width=640" },
    { id: 4, title: "User Success Stories", thumbnail: "/placeholder.svg?height=360&width=640" },
]

export default function VSLPage() {
    const [isPlaying, setIsPlaying] = useState(false)
    const [isMuted, setIsMuted] = useState(false)
    const [progress, setProgress] = useState(0)
    const [currentVideo, setCurrentVideo] = useState(videos[0])
    const router = useRouter()

    useEffect(() => {
        let interval: NodeJS.Timeout

        if (isPlaying) {
            interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        setIsPlaying(false)
                        return 100
                    }
                    return prev + 0.5
                })
            }, 1000)
        }

        return () => clearInterval(interval)
    }, [isPlaying])

    const togglePlay = () => setIsPlaying(!isPlaying)
    const toggleMute = () => setIsMuted(!isMuted)

    const changeVideo = (video: (typeof videos)[0]) => {
        setCurrentVideo(video)
        setIsPlaying(false)
        setProgress(0)
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-black p-4 relative overflow-hidden">
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

            <div className="max-w-5xl mx-auto relative z-10 pt-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 tracking-wider">
                        DREAMSTER.IO
                    </h1>
                    <p className="text-xl md:text-2xl text-cyan-300 max-w-3xl mx-auto">
                        The Ultimate AI Music Production Suite That Will Transform Your Tracks Into Chart-Topping Hits
                    </p>
                </div>

                {/* Main Video Player */}
                <div className="bg-gradient-to-br from-gray-900 to-indigo-950 rounded-lg shadow-[0_0_15px_rgba(255,44,201,0.5)] border border-fuchsia-500/30 mb-8 overflow-hidden backdrop-blur-sm">
                    <div className="relative aspect-video bg-black/50">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <img
                                src={currentVideo.thumbnail || "/placeholder.svg"}
                                alt={currentVideo.title}
                                className="w-full h-full object-cover opacity-60"
                            />

                            {/* Play button overlay */}
                            {!isPlaying && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <button
                                        onClick={togglePlay}
                                        className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 flex items-center justify-center shadow-[0_0_15px_rgba(232,121,249,0.7)] hover:shadow-[0_0_25px_rgba(232,121,249,0.9)] transition-all duration-300"
                                        aria-label="Play video"
                                    >
                                        <Play className="h-10 w-10 text-white" />
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                            <div className="flex items-center justify-between mb-2">
                                <button
                                    onClick={togglePlay}
                                    className="text-white hover:text-cyan-400 transition-colors"
                                    aria-label={isPlaying ? "Pause video" : "Play video"}
                                >
                                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                                </button>

                                <div className="flex-1 mx-4">
                                    <Progress
                                        value={progress}
                                        className="h-1 bg-gray-700"
                                        indicatorClassName="bg-gradient-to-r from-cyan-500 to-fuchsia-500"
                                    />
                                </div>

                                <button
                                    onClick={toggleMute}
                                    className="text-white hover:text-cyan-400 transition-colors"
                                    aria-label={isMuted ? "Unmute" : "Mute"}
                                >
                                    {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
                                </button>
                            </div>
                            <div className="text-cyan-300 text-sm">{currentVideo.title}</div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {videos.map((video) => (
                        <div
                            key={video.id}
                            className={`relative aspect-video rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${currentVideo.id === video.id
                                ? "ring-2 ring-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                                : "hover:shadow-[0_0_10px_rgba(232,121,249,0.5)]"
                                }`}
                            onClick={() => changeVideo(video)}
                        >
                            <img
                                src={video.thumbnail || "/placeholder.svg"}
                                alt={video.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-2">
                                <div className="text-xs text-cyan-300 line-clamp-2">{video.title}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <Button onClick={() => router.push('/user/musician/upload')} className="bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white font-bold tracking-wider py-6 px-12 shadow-[0_0_10px_rgba(232,121,249,0.5)] hover:shadow-[0_0_15px_rgba(232,121,249,0.7)] transition-all duration-300 text-xl">
                        GET STARTED NOW
                    </Button>
                </div>
            </div>
        </div>
    )
}

