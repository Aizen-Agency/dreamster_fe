"use client"

import { useState, useEffect } from "react"
import { Music, PlusCircle, Users, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { useAuthStore } from "@/store/authStore"
import { useGetTrack, useUpdateTrack } from "@/hooks/useTrackManagement"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api"

export default function PricingPage() {
    const [initialPrice, setInitialPrice] = useState("10.00")
    const [isExclusive, setIsExclusive] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const params = useParams()
    const searchParams = useSearchParams()
    const queryClient = useQueryClient()

    const trackIdFromParams = params.trackId as string
    const trackIdFromQuery = searchParams.get('trackId')

    // Use trackId from params or query params
    const trackId = trackIdFromParams || trackIdFromQuery

    // Fetch track details
    const { data: trackData, isLoading, isError } = useGetTrack(trackId || '')

    const updateTrackMutation = useUpdateTrack(trackId || '')

    // Set initial price and exclusive status from track data if available
    useEffect(() => {
        if (trackData) {
            if (trackData.starting_price) {
                setInitialPrice(trackData.starting_price.toString())
            }
            if (trackData.exclusive !== undefined) {
                setIsExclusive(trackData.exclusive)
            }
        }
    }, [trackData])

    const handlePriceUpdate = async () => {
        if (!trackId) {
            setError("No track found to update. Please go back and upload a track first.")
            return
        }

        // Validate total percentage
        if (totalCollaboratorPercentage > 100) {
            setError("Total collaborator percentage exceeds 100%. Please adjust the values.")
            return
        }

        // Filter out empty collaborators
        const validCollaborators = collaborators.filter(
            collab => collab.walletAddress.trim() !== ''
        )

        // Validate wallet addresses for non-empty collaborators
        const invalidWalletAddress = validCollaborators.find(
            collab => !/^0x[a-fA-F0-9]{40}$/.test(collab.walletAddress)
        )

        if (invalidWalletAddress) {
            setError("Please enter valid Ethereum wallet addresses for all collaborators (format: 0x followed by 40 hex characters)")
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
                starting_price: price,
                exclusive: isExclusive,
                collaborators: validCollaborators.length > 0 ? validCollaborators.map(collab => ({
                    wallet_address: collab.walletAddress,
                    split_share: collab.percentage
                })) : undefined
            })

            router.push(`/user/musician/upload/perks/${trackId}`)
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

    const [collaborators, setCollaborators] = useState([
        { id: '1', walletAddress: '', percentage: 0 },
        { id: '2', walletAddress: '', percentage: 0 },
    ])

    const addCollaborator = () => {
        setCollaborators([...collaborators, { id: (collaborators.length + 1).toString(), walletAddress: '', percentage: 0 }])
    }

    const updateCollaboratorWallet = (id: string, walletAddress: string) => {
        setCollaborators(prevCollaborators =>
            prevCollaborators.map(collaborator =>
                collaborator.id === id ? { ...collaborator, walletAddress } : collaborator
            )
        )
    }

    const updateCollaboratorPercentage = (id: string, percentage: number) => {
        setCollaborators(prevCollaborators =>
            prevCollaborators.map(collaborator =>
                collaborator.id === id ? { ...collaborator, percentage } : collaborator
            )
        )
    }

    const removeCollaborator = (id: string) => {
        setCollaborators(prevCollaborators =>
            prevCollaborators.filter(collaborator => collaborator.id !== id)
        )
    }

    const totalCollaboratorPercentage = collaborators.reduce((total, collaborator) => total + collaborator.percentage, 0)
    const mainAccountPercentage = 100 - totalCollaboratorPercentage

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-pink-500 relative overflow-hidden">
            {/* Background grid - lowered z-index */}
            <div
                className="fixed inset-0 opacity-20 z-0"
                style={{
                    backgroundImage: `linear-gradient(#ff2cc9 1px, transparent 1px), linear-gradient( #ff2cc9 1px, transparent 1px)`,
                    backgroundSize: "40px 40px",
                    backgroundPosition: "-1px -1px",
                    perspective: "500px",
                    transform: "rotateX(60deg)",
                    transformOrigin: "center top",
                }}
            />

            {/* Header - increased z-index */}
            <header className="bg-[#2a0052] w-full py-3 px-8 flex justify-between items-center relative z-10">
                <div className="flex items-center gap-2">
                    <Music className="h-6 w-6 text-[#00ccff]" />
                    <span className="audiowide-regular bg-gradient-to-r from-[#ff66cc] to-[#00ccff] text-transparent bg-clip-text font-bold text-xl">Dreamster</span>
                </div>
                <Button
                    variant="outline"
                    className="border-[#00ccff] text-[#00ccff] rounded-full hover:bg-[#00ccff]/10"
                >
                    Connect Wallet
                </Button>
            </header>

            {/* Main Content - increased z-index */}
            <main className="flex-1 w-[60%] container mx-auto py-8 px-4 relative z-10">
                {/* Steps */}
                <div className="flex w-[100%] justify-around items-center mb-8">
                    <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-[#2a0052] border-2 border-[#6700af] flex items-center justify-center text-white mb-2">
                            1
                        </div>
                        <span className="text-white font-semibold">Upload</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-[#ff66cc] border-2 border-[#ff33bb] flex items-center justify-center text-white mb-2">
                            2
                        </div>
                        <span className="text-[#ff33bb] font-bold">Supply & Pricing</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-[#2a0052] border-2 border-[#6700af] flex items-center justify-center text-white mb-2">
                            3
                        </div>
                        <span className="text-white font-semibold">Publish</span>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-900/50 border border-red-500 text-white rounded-md">
                        {error}
                    </div>
                )}

                {/* Loading state */}
                {isLoading && (
                    <div className="text-center py-4 text-white">
                        Loading track data...
                    </div>
                )}

                {/* Error state */}
                {isError && (
                    <div className="mb-6 p-4 bg-red-900/50 border border-red-500 text-white rounded-md">
                        Error loading track data. Please try again or go back to upload a new track.
                    </div>
                )}

                {/* Title */}
                <div className="text-center mb-8">
                    <h1 className="audiowide-regular bg-gradient-to-r from-[#00ccff] to-[#ff33bb] text-transparent bg-clip-text text-2xl md:text-3xl font-light mb-2">Set Your Music NFT Pricing</h1>
                    <p className="text-gray-300">Configure the initial price for your NFT</p>
                </div>

                {/* Main content area - using grid to create two columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left column - Pricing Configuration */}
                    <div className="bg-[#2a0052] border-2 border-[#6700af] rounded-lg p-6 flex flex-col relative z-20">
                        <h2 className="text-[#00ccff] text-xl mb-4">Pricing Configuration</h2>
                        <p className="text-gray-300 text-sm mb-6">
                            Set the initial price for your NFT. Pricing will follow a custom bonding curve scale.
                        </p>

                        <div className="mb-6">
                            <label htmlFor="initial-price" className="font-semibold block text-[#ff66cc] mb-2">
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

                        {/* Add exclusive toggle */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between">
                                <label htmlFor="exclusive-toggle" className="font-semibold block text-[#ff66cc]">
                                    Exclusive Track
                                </label>
                                <Switch
                                    id="exclusive-toggle"
                                    checked={isExclusive}
                                    onCheckedChange={setIsExclusive}
                                    className="data-[state=checked]:bg-[#00ccff]"
                                />
                            </div>
                            <p className="text-gray-400 text-xs mt-2">
                                Mark this track as exclusive content available only to NFT owners
                            </p>
                        </div>

                        {/* Collaborators section */}
                        <div className="pt-4">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400">
                                    Collaborators (Optional)
                                </p>
                                <Button
                                    onClick={addCollaborator}
                                    variant="ghost"
                                    size="sm"
                                    className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30"
                                >
                                    <PlusCircle className="h-5 w-5 mr-1" />
                                    {collaborators.length === 0 ? "Add Collaborator" : "Add Another"}
                                </Button>
                            </div>

                            {collaborators.length === 0 ? (
                                <div className="text-center py-8 border border-dashed border-purple-700/50 rounded-md bg-black/20">
                                    <Users className="h-10 w-10 mx-auto text-purple-400 opacity-50 mb-2" />
                                    <p className="text-purple-300 text-sm">No collaborators added</p>
                                    <p className="text-purple-400/70 text-xs mt-1">Add collaborators to split royalties and ownership</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {collaborators.map((collaborator, index) => (
                                        <div
                                            key={collaborator.id}
                                            className="grid grid-cols-12 gap-2 items-center p-3 rounded-md bg-black/20 border border-purple-700/50"
                                        >
                                            <div className="col-span-7">
                                                <label className="block text-xs font-medium text-pink-300 mb-1">Wallet Address *</label>
                                                <Input
                                                    type="text"
                                                    value={collaborator.walletAddress}
                                                    onChange={(e) => updateCollaboratorWallet(collaborator.id, e.target.value)}
                                                    placeholder="0x..."
                                                    className="bg-gray-900/60 border-purple-700 text-cyan-100 focus:border-cyan-400 focus:ring-cyan-400/20 text-sm"
                                                    required
                                                />
                                            </div>
                                            <div className="col-span-3">
                                                <label className="block text-xs font-medium text-pink-300 mb-1">Split %</label>
                                                <Input
                                                    type="number"
                                                    value={collaborator.percentage}
                                                    onChange={(e) => updateCollaboratorPercentage(collaborator.id, Number(e.target.value))}
                                                    min="0"
                                                    max="100"
                                                    className="bg-gray-900/60 border-purple-700 text-cyan-100 focus:border-cyan-400 focus:ring-cyan-400/20 text-sm"
                                                />
                                            </div>
                                            <div className="col-span-2 self-end">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeCollaborator(collaborator.id)}
                                                    className="text-pink-400 hover:text-pink-300 hover:bg-pink-950/30 h-9"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {collaborators.length > 0 && (
                                <div className="mt-4 p-3 rounded-md bg-black/30 border border-purple-700/50">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-purple-300">Collaborators:</span>
                                        <span className="text-cyan-400">{totalCollaboratorPercentage}%</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-purple-300">Your share:</span>
                                        <span className={mainAccountPercentage >= 0 ? "text-cyan-400" : "text-pink-500 font-bold"}>
                                            {mainAccountPercentage}%
                                        </span>
                                    </div>
                                    {totalCollaboratorPercentage > 100 && (
                                        <p className="text-pink-500 text-xs mt-2">
                                            Total percentage exceeds 100%. Please adjust collaborator percentages.
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right column - Pricing Preview */}
                    <div className="bg-[#2a0052] border-2 border-[#6700af] rounded-lg p-6 flex flex-col relative z-20">
                        <h2 className="audiowide-regular text-[#00ccff] text-xl mb-4">Pricing Preview</h2>

                        {/* Track Preview */}
                        <div className="bg-[#1a0033] border-2 border-[#6700af] rounded-lg p-4 mb-6 flex flex-col items-center">
                            <div className="w-16 h-16 bg-[#4a0072] rounded-lg flex items-center justify-center mb-4">
                                {trackData?.artwork_url ? (
                                    <img
                                        src={trackData.artwork_url}
                                        alt={trackData.title}
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                ) :
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
                                }
                            </div>
                            <h3 className="audiowide-regular text-[#ff66cc] text-lg mb-1">
                                {trackData?.title || "Your Awesome Track"}
                            </h3>
                            <p className="text-gray-400 text-sm">
                                {trackData?.genre || ""} - {new Date(trackData?.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) ?? "September 2025"}
                            </p>
                            <div className="mt-8 flex flex-col items-center justify-center border-2 border-[#6700af] bg-[#1a0033] rounded-lg p-4 mb-6">
                                <h3 className="text-[#00ccff] text-lg mb-2">Dynamic Pricing</h3>
                                <p className="text-gray-300 text-sm mb-2">Bonding Curve Based Dynamic NFT Pricing</p>
                                <p className="text-[#ff66cc] font-bold">Starting at ${initialPrice} USD</p>
                                {isExclusive && (
                                    <div className="mt-2 bg-[#ff66cc]/20 px-3 py-1 rounded-full">
                                        <span className="text-[#ff66cc] text-sm font-semibold">Exclusive Content</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Pricing Strategy Tips */}
                        <div className="bg-[#1a0033] border-2 border-[#6700af] rounded-lg p-4">
                            <h3 className="audiowide-regular text-[#ff66cc] text-lg flex items-center gap-2 mb-3">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="10" stroke="#ff66cc" strokeWidth="2" />
                                    <path d="M12 7V12" stroke="#ff66cc" strokeWidth="2" strokeLinecap="round" />
                                    <circle cx="12" cy="16" r="1" fill="#ff66cc" />
                                </svg>
                                Pricing Strategy Tips
                            </h3>
                            <ul className="text-gray-300 text-sm space-y-2 list-none">
                                <li className="flex items-start gap-2">
                                    <span className="text-[#ff66cc]">•</span>
                                    <span>
                                        Setting a lower initial price can attract more early buyers, potentially leading to faster price
                                        growth.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[#ff66cc]">•</span>
                                    <span>
                                        Consider your audience and the perceived value but avoid setting too high an initial price that
                                        could deter initial adoption.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[#ff66cc]">•</span>
                                    <span>
                                        The bonding curve ensures that the price will increase as more collectors purchase your NFT,
                                        rewarding early adopters.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[#ff66cc]">•</span>
                                    <span>
                                        Marking your track as exclusive can increase its perceived value and appeal to collectors.
                                    </span>
                                </li>
                            </ul>
                        </div>

                        {/* Bonding Curve Visualization */}
                        <div className="bg-[#1a0033] border-2 border-[#6700af] rounded-lg p-4">
                            <h3 className="audiowide-regular text-[#ff66cc] text-lg mb-3">Bonding Curve Visualization</h3>
                            <div className="relative h-40">
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
                            <p className="text-gray-400 text-center text-xs mt-2">
                                This graph shows how the price of your NFT will increase as more collectors purchase. The price will
                                increase as the supply decreases.
                            </p>
                        </div>
                    </div>
                </div>
                {/* Navigation Buttons */}
                <div className="audiowide-regular mt-8 flex justify-between">
                    <Button
                        variant="outline"
                        className="border-[#ff66cc] text-[#ff66cc] hover:bg-[#ff66cc]/10"
                        onClick={handleBack}
                        disabled={updateTrackMutation.isPending}
                    >
                        Previous Step
                    </Button>
                    <Button
                        className="bg-[#00ccff] text-white hover:bg-[#00ccff]/80"
                        onClick={handlePriceUpdate}
                        disabled={updateTrackMutation.isPending}
                    >
                        {updateTrackMutation.isPending ? "Updating..." : "Next Step"}
                    </Button>
                </div>
            </main >

            {/* Footer - increased z-index */}
            < footer className="w-full py-3 px-6 text-center text-pink-700 text-sm relative z-10" >
                © 2025 Dreamster.All rights reserved.
            </footer >
        </div >
    )
}
