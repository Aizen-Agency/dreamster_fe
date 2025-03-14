"use client"

import { useState } from "react"
import { ArrowRight, ExternalLink, Shield, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function WalletConnect() {
    const [selectedWallet, setSelectedWallet] = useState<string | null>(null)
    const [isConnecting, setIsConnecting] = useState(false)

    const wallets = [
        {
            id: "metamask",
            name: "MetaMask",
            icon: "/placeholder.svg?height=40&width=40",
            description: "Connect to your MetaMask wallet",
            popular: true,
        },
        {
            id: "coinbase",
            name: "Coinbase Wallet",
            icon: "/placeholder.svg?height=40&width=40",
            description: "Connect to your Coinbase wallet",
            popular: true,
        },
        {
            id: "walletconnect",
            name: "WalletConnect",
            icon: "/placeholder.svg?height=40&width=40",
            description: "Connect with WalletConnect",
            popular: false,
        },
        {
            id: "phantom",
            name: "Phantom",
            icon: "/placeholder.svg?height=40&width=40",
            description: "Connect to your Phantom wallet",
            popular: false,
        },
    ]

    const handleConnect = () => {
        if (!selectedWallet) return

        setIsConnecting(true)

        // Simulate connection process
        setTimeout(() => {
            setIsConnecting(false)
            // Here you would redirect or update state after successful connection
            console.log(`Connected to ${selectedWallet}`)
        }, 2000)
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

            <div className="bg-gradient-to-br from-gray-900 to-indigo-950 rounded-lg shadow-[0_0_15px_rgba(255,44,201,0.5)] border border-fuchsia-500/30 max-w-md w-full p-6 backdrop-blur-sm relative z-10">
                <div className="space-y-6 text-white">
                    {/* Header */}
                    <div className="text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-fuchsia-500 rounded-full mx-auto flex items-center justify-center mb-4">
                            <Wallet className="h-10 w-10 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 tracking-wider">
                            CONNECT YOUR WALLET
                        </h2>
                        <p className="text-cyan-200">Choose your preferred wallet to connect</p>
                    </div>

                    {/* Wallet Options */}
                    <div className="space-y-3">
                        {wallets.map((wallet) => (
                            <div
                                key={wallet.id}
                                className={`border rounded-md p-4 transition-all duration-300 cursor-pointer ${selectedWallet === wallet.id
                                    ? "border-cyan-400 bg-indigo-900/50 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                                    : "border-indigo-700/50 hover:border-cyan-400/50 bg-indigo-950/50"
                                    }`}
                                onClick={() => setSelectedWallet(wallet.id)}
                            >
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-indigo-900 rounded-md flex items-center justify-center mr-3 overflow-hidden">
                                        <Image src={wallet.icon || "/placeholder.svg"} alt={wallet.name} width={40} height={40} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center">
                                            <h3 className="font-semibold text-cyan-300">{wallet.name}</h3>
                                            {wallet.popular && (
                                                <span className="ml-2 text-xs bg-fuchsia-500/20 text-fuchsia-300 px-2 py-0.5 rounded-full">
                                                    Popular
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-cyan-200">{wallet.description}</p>
                                    </div>
                                    <div className="w-5 h-5 rounded-full border-2 flex-shrink-0 ml-2 flex items-center justify-center">
                                        {selectedWallet === wallet.id && <div className="w-3 h-3 rounded-full bg-cyan-400"></div>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Security Note */}
                    <div className="bg-indigo-900/20 p-3 rounded-md border border-cyan-500/30">
                        <p className="text-xs text-cyan-200 flex items-start">
                            <Shield className="h-4 w-4 mr-2 flex-shrink-0 text-cyan-400" />
                            By connecting your wallet, you agree to our Terms of Service and Privacy Policy. Your wallet will be used
                            for transactions and to verify your identity.
                        </p>
                    </div>

                    {/* Connect Button */}
                    <Button
                        className="w-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white font-bold tracking-wider py-5 shadow-[0_0_10px_rgba(232,121,249,0.5)] hover:shadow-[0_0_15px_rgba(232,121,249,0.7)] transition-all duration-300"
                        disabled={!selectedWallet || isConnecting}
                        onClick={handleConnect}
                    >
                        {isConnecting ? (
                            <div className="flex items-center">
                                <svg
                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                CONNECTING...
                            </div>
                        ) : (
                            <>
                                CONNECT WALLET <ArrowRight className="ml-2 h-5 w-5" />
                            </>
                        )}
                    </Button>

                    {/* Alternative Options */}
                    <div className="text-center">
                        <p className="text-sm text-cyan-200 mb-3">Don't have a wallet?</p>
                        <Button variant="outline" className="border-cyan-500 text-cyan-300 hover:bg-cyan-500/20">
                            <ExternalLink className="mr-2 h-4 w-4" /> CREATE A NEW WALLET
                        </Button>
                    </div>

                    {/* Supported Networks */}
                    <div className="pt-4 border-t border-indigo-700/50">
                        <p className="text-xs text-center text-fuchsia-300 mb-3">Supported Networks</p>
                        <div className="flex justify-center space-x-4">
                            {["Ethereum", "Polygon", "Solana", "Avalanche"].map((network) => (
                                <div key={network} className="flex flex-col items-center">
                                    <div className="w-8 h-8 bg-gradient-to-br from-gray-800 to-indigo-900 rounded-full flex items-center justify-center mb-1">
                                        <div className="w-4 h-4 rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500"></div>
                                    </div>
                                    <span className="text-xs text-cyan-200">{network}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

