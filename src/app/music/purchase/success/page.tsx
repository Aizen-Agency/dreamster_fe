"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle, ArrowRight, Download, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTrackDetails } from "@/hooks/useTrackDetails"
import { useCheckTrackOwnership } from "@/hooks/usePayments"
import { useAuthStore } from "@/store/authStore"

export default function PurchaseSuccess() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { isLoggedIn } = useAuthStore()
    const trackId = searchParams.get('track_id')

    const { data: trackData } = trackId ? useTrackDetails(trackId) : { data: null }
    const { data: ownershipData, isLoading } = trackId ? useCheckTrackOwnership(trackId) : { data: null, isLoading: false }

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login?redirect=/music/purchase/success?track_id=' + trackId)
        }
    }, [isLoggedIn, router, trackId])

    const handleViewLibrary = () => {
        router.push('/user/library')
    }

    const handleViewTrack = () => {
        router.push(`/music/player?id=${trackId}`)
    }

    if (!isLoggedIn) {
        return null
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

            <div className="bg-indigo-950/80 backdrop-blur-sm rounded-xl border border-fuchsia-500/30 p-8 w-full max-w-md relative z-10 shadow-[0_0_30px_rgba(192,38,211,0.2)] text-center">
                <div className="mb-6 flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                        <CheckCircle className="h-10 w-10 text-green-400" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 mb-2">
                    Purchase Successful!
                </h1>

                <p className="text-cyan-300 mb-6">
                    You now own the NFT for "{trackData?.title || 'this track'}"
                </p>

                {isLoading ? (
                    <div className="flex justify-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-fuchsia-500"></div>
                    </div>
                ) : ownershipData?.owns ? (
                    <div className="bg-indigo-900/30 p-4 rounded-md border border-fuchsia-500/30 mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-fuchsia-300">Token ID</span>
                            <span className="text-cyan-300 font-mono">{ownershipData.token_id}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-fuchsia-300">Purchase Date</span>
                            <span className="text-cyan-300">
                                {new Date(ownershipData.purchase_date).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                ) : null}

                <div className="space-y-4">
                    <Button
                        onClick={handleViewTrack}
                        className="w-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 hover:from-cyan-600 hover:to-fuchsia-600 text-white font-bold py-3 rounded-md"
                    >
                        Listen Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>

                    <Button
                        onClick={handleViewLibrary}
                        variant="outline"
                        className="w-full border-cyan-500 text-cyan-500 hover:bg-cyan-950/50"
                    >
                        View My Library
                    </Button>

                    {trackData?.exclusive && (
                        <Button
                            variant="outline"
                            className="w-full border-fuchsia-500 text-fuchsia-500 hover:bg-fuchsia-950/50 flex items-center justify-center"
                        >
                            <Download className="mr-2 h-4 w-4" />
                            Download Exclusive Content
                        </Button>
                    )}

                    <div className="pt-4 border-t border-indigo-800/30 mt-4">
                        <a
                            href={`https://etherscan.io/token/${process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS}?a=${ownershipData?.token_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:text-cyan-300 flex items-center justify-center"
                        >
                            View on Blockchain <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
} 