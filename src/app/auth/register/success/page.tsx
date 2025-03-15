"use client"

import { Check, Music, Users, Star } from "lucide-react"
import { useRouter } from "next/navigation"

export default function OnboardingSuccess() {
    const router = useRouter()
    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-950 to-black flex items-center justify-center p-4 relative overflow-hidden">
            {/* Grid background */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: `linear-gradient(#00ffff 1px, transparent 1px), linear-gradient(90deg, #00ffff 1px, transparent 1px)`,
                    backgroundSize: "40px 40px",
                    backgroundPosition: "-1px -1px",
                    perspective: "500px",
                    transform: "rotateX(60deg)",
                    transformOrigin: "center top",
                }}
            />

            {/* Sun/horizon glow */}
            <div className="absolute bottom-0 left-0 right-0 h-60 bg-gradient-to-t from-fuchsia-600 via-purple-600 to-transparent opacity-30" />

            {/* Main content container */}
            <div className="bg-gradient-to-br from-gray-950 to-indigo-950 rounded-lg shadow-[0_0_30px_rgba(255,0,255,0.7)] border border-fuchsia-400/50 max-w-2xl w-full p-8 backdrop-blur-sm relative z-10">
                {/* Success indicator */}
                <div className="flex justify-center mb-6">
                    <div className="bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full p-3 shadow-[0_0_20px_rgba(52,211,153,0.9)]">
                        <Check className="h-8 w-8 text-black" />
                    </div>
                </div>

                {/* Heading section */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-fuchsia-300 tracking-wider mb-2">
                        You're All Set! 🎉
                    </h1>
                    <p className="text-cyan-200 text-lg max-w-md mx-auto">
                        Your profile is ready to go. Would you like a quick tour of the features?
                    </p>
                </div>

                {/* Feature cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {/* Feature 1 */}
                    <div className="border border-cyan-500/50 rounded-lg p-5 bg-indigo-950 flex flex-col items-center text-center shadow-[0_0_15px_rgba(0,255,255,0.3)]">
                        <div className="p-4 rounded-full mb-3 bg-gradient-to-br from-cyan-400 to-blue-500 shadow-[0_0_15px_rgba(34,211,238,0.7)]">
                            <Music className="h-6 w-6 text-black" />
                        </div>
                        <h3 className="font-semibold text-xl text-cyan-300 mb-2">Discover Music</h3>
                        <p className="text-sm text-cyan-100">Find new artists and tracks based on your preferences</p>
                    </div>

                    {/* Feature 2 */}
                    <div className="border border-fuchsia-500/50 rounded-lg p-5 bg-indigo-950 flex flex-col items-center text-center shadow-[0_0_15px_rgba(255,0,255,0.3)]">
                        <div className="p-4 rounded-full mb-3 bg-gradient-to-br from-fuchsia-400 to-purple-500 shadow-[0_0_15px_rgba(232,121,249,0.7)]">
                            <Users className="h-6 w-6 text-black" />
                        </div>
                        <h3 className="font-semibold text-xl text-fuchsia-300 mb-2">Connect</h3>
                        <p className="text-sm text-fuchsia-100">Follow your favorite artists and connect with other fans</p>
                    </div>

                    {/* Feature 3 */}
                    <div className="border border-amber-500/50 rounded-lg p-5 bg-indigo-950 flex flex-col items-center text-center shadow-[0_0_15px_rgba(255,255,0,0.3)]">
                        <div className="p-4 rounded-full mb-3 bg-gradient-to-br from-amber-400 to-orange-500 shadow-[0_0_15px_rgba(251,191,36,0.7)]">
                            <Star className="h-6 w-6 text-black" />
                        </div>
                        <h3 className="font-semibold text-xl text-amber-300 mb-2">Personalize</h3>
                        <p className="text-sm text-amber-100">Create playlists and customize your music experience</p>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        className="px-8 py-3 rounded-lg font-bold text-lg tracking-wider bg-gradient-to-r from-cyan-400 to-fuchsia-400 text-black shadow-[0_0_20px_rgba(232,121,249,0.7)] hover:shadow-[0_0_30px_rgba(232,121,249,0.9)] transition-all max-w-xs w-full mx-auto sm:mx-0"
                        onClick={() => router.push('/auth/login/email')}
                    >
                        START EXPLORING
                    </button>
                    <button
                        className="px-8 py-3 rounded-lg font-bold text-lg tracking-wider border-2 border-cyan-400 text-cyan-300 hover:bg-cyan-400/20 hover:text-cyan-200 hover:shadow-[0_0_20px_rgba(0,255,255,0.5)] transition-all max-w-xs w-full mx-auto sm:mx-0"
                    // Skip tour button is now non-functional (no onClick handler)
                    >
                        SKIP TOUR
                    </button>
                </div>
            </div>
        </div>
    )
}

