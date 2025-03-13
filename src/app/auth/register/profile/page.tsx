"use client"

import { useState } from "react"
import { Headphones, Mic } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ProfileSelection() {
    const [selectedProfile, setSelectedProfile] = useState<"fan" | "musician" | null>(null)
    const router = useRouter()

    const handleContinue = () => {
        if (selectedProfile) {
            // Handle navigation to next step
            console.log(`Selected profile: ${selectedProfile}`)
        }
    }

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

            <div className="bg-gradient-to-br from-gray-900 to-indigo-950 rounded-lg shadow-[0_0_15px_rgba(255,44,201,0.5)] border border-fuchsia-500/30 max-w-xl w-full p-8 backdrop-blur-sm relative z-10">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 tracking-wider">
                        CHOOSE YOUR PROFILE TYPE
                    </h1>
                    <p className="text-cyan-300 mt-2 opacity-80">Select how you want to use Dreamster</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    {/* Fan Profile Option */}
                    <label
                        className={`border rounded-lg p-5 cursor-pointer transition-all ${selectedProfile === "fan"
                            ? "border-cyan-400 bg-indigo-900/50 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                            : "border-indigo-700/50 hover:border-cyan-400/50 bg-indigo-950/50"
                            }`}
                    >
                        <div className="flex items-start gap-3">
                            <input
                                type="radio"
                                name="profileType"
                                className="mt-1 accent-cyan-400"
                                checked={selectedProfile === "fan"}
                                onChange={() => setSelectedProfile("fan")}
                            />
                            <div>
                                <div className="flex flex-col items-center mb-4">
                                    <div
                                        className={`p-4 rounded-full mb-3 transition-all ${selectedProfile === "fan"
                                            ? "bg-gradient-to-br from-cyan-500 to-blue-600 shadow-[0_0_10px_rgba(34,211,238,0.7)]"
                                            : "bg-indigo-800/70"
                                            }`}
                                    >
                                        <Headphones className={`h-6 w-6 ${selectedProfile === "fan" ? "text-white" : "text-cyan-300"}`} />
                                    </div>
                                    <h3 className="font-bold text-lg text-fuchsia-400">Fan Profile</h3>
                                </div>
                                <p className="text-sm text-cyan-100/80 text-center">
                                    Discover new music, follow artists, and create playlists
                                </p>
                            </div>
                        </div>
                    </label>

                    {/* Musician Profile Option */}
                    <label
                        className={`border rounded-lg p-5 cursor-pointer transition-all ${selectedProfile === "musician"
                            ? "border-fuchsia-400 bg-indigo-900/50 shadow-[0_0_10px_rgba(232,121,249,0.5)]"
                            : "border-indigo-700/50 hover:border-fuchsia-400/50 bg-indigo-950/50"
                            }`}
                    >
                        <div className="flex items-start gap-3">
                            <input
                                type="radio"
                                name="profileType"
                                className="mt-1 accent-fuchsia-400"
                                checked={selectedProfile === "musician"}
                                onChange={() => setSelectedProfile("musician")}
                            />
                            <div>
                                <div className="flex flex-col items-center mb-4">
                                    <div
                                        className={`p-4 rounded-full mb-3 transition-all ${selectedProfile === "musician"
                                            ? "bg-gradient-to-br from-fuchsia-500 to-purple-600 shadow-[0_0_10px_rgba(232,121,249,0.7)]"
                                            : "bg-indigo-800/70"
                                            }`}
                                    >
                                        <Mic className={`h-6 w-6 ${selectedProfile === "musician" ? "text-white" : "text-fuchsia-300"}`} />
                                    </div>
                                    <h3 className="font-bold text-lg text-fuchsia-400">Musician Profile</h3>
                                </div>
                                <p className="text-sm text-cyan-100/80 text-center">
                                    Share your music, connect with fans, and grow your audience
                                </p>
                            </div>
                        </div>
                    </label>
                </div>

                <div className="flex justify-between items-center">
                    <button onClick={() => router.push('/auth/register/success')} className="text-cyan-300 text-sm flex items-center gap-1 hover:text-cyan-100 transition-colors">
                        <span>←</span> Back
                    </button>
                    <button
                        className={`px-6 py-2.5 rounded font-bold tracking-wider transition-all ${selectedProfile
                            ? "bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white shadow-[0_0_10px_rgba(232,121,249,0.5)] hover:shadow-[0_0_15px_rgba(232,121,249,0.7)]"
                            : "bg-gray-700 text-gray-400 cursor-not-allowed"
                            }`}
                        disabled={!selectedProfile}
                        onClick={handleContinue}
                    >
                        CONTINUE
                    </button>
                </div>
            </div>
        </div>
    )
}

