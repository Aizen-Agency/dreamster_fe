"use client"

import { useState } from "react"
import { Minus, Plus, Check, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useRouter, useSearchParams } from "next/navigation"
import { useTrackDetails } from "@/hooks/useTrackExplorer"

const ApplePayIcon = () => <span>Apple Pay</span>

export default function TrackPurchase() {
    const [paymentMethod, setPaymentMethod] = useState<string>("credit-card")
    const [quantity, setQuantity] = useState(1)
    const router = useRouter()
    const searchParams = useSearchParams()

    // Get track details from URL parameters
    const trackId = searchParams.get('id')
    const trackTitle = searchParams.get('title')
    const artistName = searchParams.get('artist')
    const basePrice = parseFloat(searchParams.get('price') || "1.99")

    // Fetch full track details if needed
    const { data: trackData, isLoading } = useTrackDetails(trackId)

    const incrementQuantity = () => setQuantity((prev) => prev + 1)
    const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1))

    const totalPrice = (basePrice * quantity).toFixed(2)

    // Use track data from API if available, otherwise use URL params
    const title = trackData?.title || trackTitle || "Unknown Track"
    const artist = trackData?.artist?.name || artistName || "Unknown Artist"

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

            <div className="bg-gradient-to-br from-gray-900 to-indigo-950 rounded-lg shadow-[0_0_15px_rgba(255,44,201,0.5)] border border-fuchsia-500/30 max-w-md w-full p-6 backdrop-blur-sm relative z-10">
                <div className="space-y-6 text-white">
                    {/* Header */}
                    <div>
                        <h2 className="text-2xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 tracking-wider">
                            OWN THIS TRACK
                        </h2>
                        <div className="flex items-start space-x-3 p-3 bg-indigo-900/40 rounded-md border border-fuchsia-500/30">
                            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-fuchsia-500 flex-shrink-0 flex items-center justify-center rounded-md">
                                <span className="text-lg">♪</span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-cyan-300">{title}</h3>
                                <p className="text-sm text-fuchsia-300">by {artist}</p>
                            </div>
                        </div>

                        <div className="flex items-center mt-3 text-sm text-cyan-200 p-2 bg-indigo-900/30 rounded-md border border-cyan-500/30">
                            <Eye className="h-4 w-4 mr-2 text-cyan-400" />
                            <p>85% of fans who purchased this track gained exclusive access to behind-the-scenes content</p>
                        </div>
                    </div>

                    {/* Quantity Selector */}
                    <div>
                        <h3 className="font-semibold mb-3 text-fuchsia-300">Quantity</h3>
                        <div className="flex items-center justify-between bg-indigo-900/40 rounded-md border border-fuchsia-500/30 p-2">
                            <button
                                onClick={decrementQuantity}
                                className="text-cyan-400 hover:text-cyan-300 transition-colors"
                                aria-label="Decrease quantity"
                            >
                                <Minus size={20} />
                            </button>
                            <span className="text-xl font-bold text-cyan-300">{quantity}</span>
                            <button
                                onClick={incrementQuantity}
                                className="text-cyan-400 hover:text-cyan-300 transition-colors"
                                aria-label="Increase quantity"
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div>
                        <h3 className="font-semibold mb-3 text-fuchsia-300">Choose Payment Method</h3>
                        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-1 gap-3">
                            {[
                                { id: "apple-pay", label: "Apple Pay", icon: <ApplePayIcon /> },
                                { id: "credit-card", label: "Credit Card (Visa)", icon: "💳" },
                                { id: "crypto", label: "Crypto", icon: "₿" },
                            ].map((method) => (
                                <div
                                    key={method.id}
                                    className={`border rounded-md p-3 flex items-center transition-all duration-300 ${paymentMethod === method.id
                                        ? "border-cyan-400 bg-indigo-900/50 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                                        : "border-indigo-700/50 hover:border-cyan-400/50 bg-indigo-950/50"
                                        }`}
                                >
                                    <RadioGroupItem
                                        value={method.id}
                                        id={method.id}
                                        className="sr-only"
                                    />
                                    <Label htmlFor={method.id} className="flex items-center cursor-pointer w-full">
                                        <span className="mr-2 text-2xl">{method.icon}</span>
                                        <span className="flex-grow">{method.label}</span>
                                        {paymentMethod === method.id && <span className="ml-2 text-cyan-400">•</span>}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>

                    {/* Price and Benefits */}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-semibold text-fuchsia-300">Total Price</h3>
                            <span className="font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
                                ${totalPrice}
                            </span>
                        </div>

                        <div className="space-y-3 mb-4 bg-indigo-900/30 p-3 rounded-md border border-fuchsia-500/30">
                            {["Exclusive behind-the-scenes access", "Digital ownership badge", "Early access to future releases"].map(
                                (benefit, index) => (
                                    <div key={index} className="flex items-start">
                                        <Check className="h-4 w-4 text-cyan-400 mt-1 mr-2" />
                                        <span className="text-sm text-cyan-200">{benefit}</span>
                                    </div>
                                )
                            )}
                        </div>

                        <Button
                            className="w-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 hover:from-cyan-600 hover:to-fuchsia-600 text-white font-bold py-3 rounded-md"
                        >
                            Complete Purchase
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

