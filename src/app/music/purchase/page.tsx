"use client"

import { useState } from "react"
import { Check, Eye, Plus, Minus } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

const ApplePayIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M17.0444 6.553C16.2226 7.2744 15.0937 7.1563 14.2719 6.7128C13.5682 6.3098 12.9826 6.2508 12.1608 6.3098C10.8729 6.3688 9.82249 7.0902 9.23624 8.2411C8.35449 10.0139 8.88142 12.6118 10.4621 14.7394C11.1658 15.7034 12.1018 16.8444 13.3897 16.8149C14.3257 16.7854 14.7354 16.2634 15.9061 16.2634C17.1063 16.2634 17.4569 16.8149 18.4519 16.7854C19.7398 16.7559 20.5616 15.7329 21.2653 14.7689C21.8515 13.9589 22.1136 13.1489 22.1431 13.0899C22.1136 13.0604 20.0905 12.2209 20.0905 9.8589C20.0905 7.7904 21.7045 6.8264 21.7931 6.7674C20.7981 5.2617 19.2174 5.1731 18.6312 5.1436C17.2261 5.0551 16.0554 5.9306 15.3812 5.9306C14.7354 5.9306 13.7109 5.2027 12.5107 5.2322C10.6372 5.2617 8.88142 6.4716 7.97039 8.2706C7.05936 10.0729 7.17778 13.0899 9.05124 16.2339C9.99155 17.6806 11.1067 19.3042 12.5993 19.2747C13.8872 19.2452 14.3849 18.4057 15.9356 18.4057C17.4569 18.4057 17.9248 19.2452 19.2717 19.2747C20.6768 19.3042 21.6718 17.8575 22.6128 16.4108C23.3755 15.2304 23.7262 14.0795 23.7557 14.02C23.7262 13.9905 20.9713 12.8691 20.9713 9.8884M14.8876 4.2681C15.4738 3.5467 15.8835 2.5237 15.7651 1.5007C14.8876 1.5302 13.8282 2.0522 13.2125 2.7736C12.6558 3.4065 12.1608 4.4295 12.3087 5.4231C13.2715 5.4821 14.3012 4.9896 14.8876 4.2681" />
    </svg>
)

export default function TrackPurchase() {
    const [paymentMethod, setPaymentMethod] = useState<string>("credit-card")
    const [quantity, setQuantity] = useState(1)
    const basePrice = 1.99

    const incrementQuantity = () => setQuantity((prev) => prev + 1)
    const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1))

    const totalPrice = (basePrice * quantity).toFixed(2)

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
                                <h3 className="font-semibold text-cyan-300">Summer Nights</h3>
                                <p className="text-sm text-fuchsia-300">by John Smith</p>
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
                                    <RadioGroupItem value={method.id} id={method.id} className="sr-only" />
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
                                ),
                            )}
                        </div>
                    </div>

                    {/* Complete Purchase Button */}
                    <Button className="w-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white font-bold tracking-wider py-5 shadow-[0_0_10px_rgba(232,121,249,0.5)] hover:shadow-[0_0_15px_rgba(232,121,249,0.7)] transition-all duration-300">
                        COMPLETE PURCHASE
                    </Button>
                </div>
            </div>
        </div>
    )
}

