"use client"

import { useState, useEffect } from "react"
import { Music } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter, useSearchParams } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { useAuthStore } from "@/store/authStore"
import { useUpdateTrack } from "@/hooks/useTrackManagement"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api"

export default function PricingPage() {
    const [initialPrice, setInitialPrice] = useState("10.00")
    const [isUpdating, setIsUpdating] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const searchParams = useSearchParams()
    const queryClient = useQueryClient()

    const trackIdFromParams = searchParams.get('trackId')

    const latestTrack = queryClient.getQueryData<any>(["tracks"])?.data?.[0]
    const trackId = trackIdFromParams || latestTrack?.id

    const updateTrackMutation = useUpdateTrack(trackId || '')

    const handlePriceUpdate = async () => {
        if (!trackId) {
            setError("No track found to update. Please go back and upload a track first.")
            return
        }

        setIsUpdating(true)
        setError(null)

        try {
            const price = parseFloat(initialPrice)

            if (isNaN(price) || price <= 0) {
                setError("Please enter a valid price greater than 0")
                setIsUpdating(false)
                return
            }

            await updateTrackMutation.mutateAsync({
                starting_price: price
            })

            router.push(`/user/musician/upload/publish?trackId=${trackId}`)
        } catch (err) {
            console.error("Error updating track price:", err)
            setError("Failed to update track price. Please try again.")
        } finally {
            setIsUpdating(false)
        }
    }

    const handleBack = () => {
        router.push("/user/musician/upload")
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-pink-500 p-4 md:p-8 relative overflow-hidden">
            {/* Background grid - lowered z-index */}
            <div
                className="fixed inset-0 opacity-20 z-0"
                style={{
                    backgroundImage: `linear-gradient(#ff2cc9 1px, transparent 1px), linear-gradient(90deg, #ff2cc9 1px, transparent 1px)`,
                    backgroundSize: "40px 40px",
                    backgroundPosition: "-1px -1px",
                    perspective: "500px",
                    transform: "rotateX(60deg)",
                    transformOrigin: "center top",
                }}
            />

            {/* Header - increased z-index */}
            <header className="w-full py-3 px-6 flex justify-between items-center relative z-10">
                <div className="flex items-center gap-2">
                    <Music className="h-6 w-6 text-[#ff66cc]" />
                    <span className="text-[#ff66cc] font-bold text-xl">Dreamster</span>
                </div>
                <Button
                    variant="outline"
                    className="bg-transparent border-[#00ccff] text-[#00ccff] hover:bg-[#00ccff]/10 rounded-full"
                >
                    Create Music
                </Button>
            </header>

            {/* Main Content - increased z-index */}
            <main className="flex-1 container mx-auto py-8 px-4 relative z-10">
                {/* Steps */}
                <div className="flex justify-center mb-8 gap-16">
                    <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-[#ff66cc] flex items-center justify-center text-white mb-2">
                            1
                        </div>
                        <span className="text-white">Upload</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-[#ff66cc] flex items-center justify-center text-white mb-2">
                            2
                        </div>
                        <span className="text-white">Supply & Pricing</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-[#2a0052] flex items-center justify-center text-white mb-2">
                            3
                        </div>
                        <span className="text-white">Publish</span>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-900/50 border border-red-500 text-white rounded-md">
                        {error}
                    </div>
                )}

                {/* Title */}
                <div className="text-center mb-8">
                    <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff66cc] to-[#00ccff] text-2xl md:text-3xl font-light mb-2">Set Your Music NFT Pricing</h1>
                    <p className="text-gray-300">Configure the initial price for your NFT</p>
                </div>

                {/* Pricing Configuration and Preview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Pricing Configuration */}
                    <div className="bg-[#2a0052] border-2 border-[#ff66cc] p-6 flex flex-col relative z-20">
                        <h2 className="text-[#00ccff] text-xl mb-4">Pricing Configuration</h2>
                        <p className="text-gray-300 text-sm mb-6">
                            Set the initial price for your NFT. Pricing will follow a custom bonding curve scale.
                        </p>

                        <div className="mb-6">
                            <label htmlFor="initial-price" className="block text-[#ff66cc] mb-2">
                                Initial Price (USD)
                            </label>
                            <Input
                                id="initial-price"
                                type="text"
                                value={initialPrice}
                                onChange={(e) => setInitialPrice(e.target.value)}
                                className="bg-[#1a0033] border-[#3a0062] text-white focus:outline-none focus:ring-1 focus:ring-[#ff66cc]"
                            />
                            <p className="text-gray-400 text-xs mt-2">Set the starting price for your NFT</p>
                        </div>
                    </div>

                    {/* Pricing Preview */}
                    <div className="bg-[#2a0052] border-2 border-[#00ccff] p-6 relative z-20">
                        <h2 className="text-[#00ccff] text-xl mb-4">Pricing Preview</h2>

                        {/* Track Preview */}
                        <div className="bg-[#3a0062] rounded-lg p-4 mb-6 flex flex-col items-center">
                            <div className="w-16 h-16 bg-[#4a0072] rounded-lg flex items-center justify-center mb-4">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M9 18V6L21 3V15"
                                        stroke="#00ccff"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <circle
                                        cx="6"
                                        cy="18"
                                        r="3"
                                        stroke="#00ccff"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <circle
                                        cx="18"
                                        cy="15"
                                        r="3"
                                        stroke="#00ccff"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-[#00ccff] text-lg mb-1">Your Awesome Track</h3>
                            <p className="text-gray-400 text-xs">September 2025</p>
                        </div>

                        {/* Dynamic Pricing */}
                        <div className="bg-[#3a0062] rounded-lg p-4 mb-6">
                            <h3 className="text-[#00ccff] text-lg mb-2">Dynamic Pricing</h3>
                            <p className="text-gray-300 text-sm mb-2">Bonding Curve Based Dynamic NFT Pricing</p>
                            <p className="text-white font-bold">Starting at ${initialPrice} USD</p>
                        </div>

                        {/* Pricing Strategy Tips */}
                        <div className="mb-6">
                            <h3 className="text-[#00ccff] text-lg flex items-center gap-2 mb-3">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="10" stroke="#00ccff" strokeWidth="2" />
                                    <path d="M12 7V12" stroke="#00ccff" strokeWidth="2" strokeLinecap="round" />
                                    <circle cx="12" cy="16" r="1" fill="#00ccff" />
                                </svg>
                                Pricing Strategy Tips
                            </h3>
                            <ul className="text-gray-300 text-sm space-y-2 list-none">
                                <li className="flex items-start gap-2">
                                    <span className="text-[#00ccff]">•</span>
                                    <span>
                                        Setting a lower initial price can attract more early buyers, potentially leading to faster price
                                        growth.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[#00ccff]">•</span>
                                    <span>
                                        Consider your audience and the perceived value but avoid setting too high an initial price that
                                        could deter initial adoption.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[#00ccff]">•</span>
                                    <span>
                                        The bonding curve ensures that the price will increase as more collectors purchase your NFT,
                                        rewarding early adopters.
                                    </span>
                                </li>
                            </ul>
                        </div>

                        {/* Bonding Curve Visualization */}
                        <div>
                            <h3 className="text-[#00ccff] text-lg mb-3">Bonding Curve Visualization</h3>
                            <div className="bg-[#3a0062] rounded-lg p-4 h-[150px] relative">
                                {/* Y-axis label */}
                                <div className="absolute left-2 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-400">
                                    <span>Price</span>
                                </div>

                                {/* Graph */}
                                <div className="absolute left-12 right-4 top-4 bottom-8 flex items-end">
                                    <svg className="w-full h-full" viewBox="0 0 100 60">
                                        <defs>
                                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#ff66cc" />
                                                <stop offset="100%" stopColor="#00ccff" />
                                            </linearGradient>
                                        </defs>
                                        <path
                                            d="M0,60 C20,58 40,40 60,20 C80,0 90,0 100,0"
                                            fill="none"
                                            stroke="url(#gradient)"
                                            strokeWidth="2"
                                        />
                                    </svg>
                                </div>

                                {/* X-axis label */}
                                <div className="absolute left-12 right-4 bottom-2 flex justify-end text-xs text-gray-400">
                                    <span>Supply</span>
                                </div>
                            </div>
                            <p className="text-gray-400 text-xs mt-2">
                                This graph shows how the price of your NFT will increase as more collectors purchase. The price will
                                increase as the supply decreases.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                    <Button
                        variant="outline"
                        className="border-[#ff66cc] text-[#ff66cc] hover:bg-[#ff66cc]/10"
                        onClick={handleBack}
                        disabled={updateTrackMutation.isPending}
                    >
                        Back
                    </Button>
                    <Button
                        className="bg-[#00ccff] text-white hover:bg-[#00ccff]/80"
                        onClick={handlePriceUpdate}
                        disabled={updateTrackMutation.isPending}
                    >
                        {updateTrackMutation.isPending ? "Updating..." : "Next Step"}
                    </Button>
                </div>
            </main>

            {/* Footer - increased z-index */}
            <footer className="w-full py-3 px-6 text-center text-gray-400 text-sm relative z-10">
                © 2025 Dreamster. All rights reserved.
            </footer>
        </div>
    )
}
