import { ExternalLink, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMusician } from "@/hooks/useMusician"
import { useState, useEffect } from "react"

export default function MusicianProfile({ artistId }: { artistId: string }) {
    const { data: musicianData, isLoading, error } = useMusician(artistId)
    const [musician, setMusician] = useState({
        name: "",
        image: "/placeholder.svg",
        bio: "",
        established: "",
        profileUrl: "",
    })

    useEffect(() => {
        if (musicianData) {
            setMusician({
                name: musicianData.username || "Unknown Artist",
                image: musicianData.avatar || "/placeholder.svg?height=400&width=400&text=Artist",
                bio: musicianData.bio || "No biography available for this artist.",
                established: new Date(musicianData.created_at).getFullYear().toString() || "Unknown",
                profileUrl: `https://${process.env.NEXT_PUBLIC_APP_URL}/share/musician/${musicianData.id}` || "#",
            })
        }
    }, [musicianData])

    if (isLoading) {
        return (
            <div className="bg-gradient-to-br from-gray-900 to-indigo-950 rounded-lg shadow-lg border border-fuchsia-500/30 p-6 h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-fuchsia-500"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-gradient-to-br from-gray-900 to-indigo-950 rounded-lg shadow-lg border border-fuchsia-500/30 p-6 h-full flex flex-col items-center justify-center text-center">
                <p className="text-red-400 mb-2">Failed to load artist profile</p>
                <p className="text-cyan-300 text-sm">Please try again later</p>
            </div>
        )
    }

    return (
        <div className="bg-gradient-to-br from-gray-900 to-indigo-950 rounded-lg shadow-lg border border-fuchsia-500/30 p-6 space-y-4 h-full flex flex-col relative overflow-hidden">
            {/* Background grid effect */}
            <div
                className="absolute inset-0 opacity-5 z-0"
                style={{
                    backgroundImage: `linear-gradient(#ff2cc9 1px, transparent 1px), linear-gradient(90deg, #ff2cc9 1px, transparent 1px)`,
                    backgroundSize: "20px 20px",
                    backgroundPosition: "-1px -1px",
                }}
            />

            {/* Glow effect */}
            <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 w-2/3 h-40 bg-fuchsia-500 opacity-10 blur-3xl rounded-full z-0"></div>

            <div className="relative z-10">
                <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-center mb-1">
                    Artist Profile
                </h2>
                <div className="h-1 w-24 mx-auto bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-full mb-4"></div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 relative z-10">
                {/* Artist Image and Info */}
                <div className="md:w-1/3 flex flex-col items-center">
                    <div className="relative w-full max-w-[200px] aspect-square mb-4">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500/30 to-fuchsia-500/30 blur-md"></div>
                        <img
                            src={musician.image}
                            alt={musician.name}
                            className="w-full h-full object-cover rounded-full border-2 border-fuchsia-500/50 p-1 relative z-10"
                        />
                    </div>

                    <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-center">
                        {musician.name}
                    </h3>

                    <div className="flex justify-center mt-4">
                        <Button
                            variant="outline"
                            className="text-cyan-400 border-cyan-500/50 hover:bg-cyan-950/50 bg-indigo-900/40 px-6"
                            onClick={() => window.open(musician.profileUrl, "_blank")}
                        >
                            View Full Profile <ExternalLink size={14} className="ml-2" />
                        </Button>
                    </div>
                </div>

                {/* Artist Bio and Established Date */}
                <div className="md:w-2/3 space-y-4">
                    <div className="bg-indigo-900/30 p-4 rounded-md border border-fuchsia-500/20">
                        <p className="text-cyan-200 text-sm leading-relaxed">{musician.bio}</p>
                    </div>

                    {/* Established Date */}
                    <div className="bg-indigo-900/40 p-3 rounded-md border border-cyan-500/20 flex items-center justify-center">
                        <Calendar size={20} className="text-cyan-400 mr-3" />
                        <div className="flex flex-col items-center">
                            <span className="text-fuchsia-300 font-bold">Since {musician.established}</span>
                            <span className="text-xs text-cyan-200">Established</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
