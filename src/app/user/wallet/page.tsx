"use client"

import { useState } from "react"
import Image from "next/image"
import {
    Copy,
    ExternalLink,
    ArrowUpRight,
    ArrowDownLeft,
    Clock,
    CheckCircle2,
    AlertCircle,
    Filter,
    Search,
    Eye,
    EyeOff,
    ArrowLeft,
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function CryptoWallet() {
    const router = useRouter()
    const [hideBalance, setHideBalance] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    // Sample wallet data
    const walletAddress = "0x7F5Ec7a9335f41B28d98B3E659A3D7D584A6D1D6"
    const shortAddress = `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`
    const balance = {
        eth: 3.245,
        usd: 7892.34,
        change: 2.5,
    }

    // Sample transaction data
    const transactions = [
        {
            id: 1,
            type: "received",
            amount: 0.5,
            from: "0x1a2...3b4c",
            to: shortAddress,
            date: "Today, 10:45 AM",
            status: "completed",
            hash: "0x7d3...f12",
        },
        {
            id: 2,
            type: "sent",
            amount: 1.2,
            from: shortAddress,
            to: "0x5e6...7f8g",
            date: "Yesterday, 3:30 PM",
            status: "completed",
            hash: "0x9h1...j23",
        },
        {
            id: 3,
            type: "received",
            amount: 0.75,
            from: "0x4k5...6l7m",
            to: shortAddress,
            date: "Jul 12, 2023",
            status: "completed",
            hash: "0x8n9...o01",
        },
        {
            id: 4,
            type: "sent",
            amount: 0.3,
            from: shortAddress,
            to: "0x2p3...4q5r",
            date: "Jul 10, 2023",
            status: "pending",
            hash: "0x6s7...t89",
        },
    ]

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        // You could add a toast notification here
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-black p-4 md:p-8 relative overflow-hidden">
            {/* Grid background */}
            <div
                className="fixed inset-0 opacity-20"
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
            <div className="fixed bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-fuchsia-600 to-transparent opacity-20" />

            {/* Main content */}
            <div className="relative z-10 max-w-6xl mx-auto">
                {/* Back button */}
                <button
                    onClick={() => window.history.back()}
                    className="mb-6 flex items-center gap-2 text-cyan-300 hover:text-cyan-100 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back</span>
                </button>

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 tracking-wider">
                            NFT WALLET
                        </h1>
                        <p className="text-cyan-300 opacity-80">View and manage your digital collectibles</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setHideBalance(!hideBalance)}
                            className="p-2 rounded-full bg-indigo-950/50 border border-cyan-500/30 text-cyan-300 hover:bg-indigo-900/50 transition-colors"
                        >
                            {hideBalance ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                {/* Wallet Address and Balance Card */}
                <div className="bg-gradient-to-br from-gray-900 to-indigo-950 rounded-lg shadow-[0_0_15px_rgba(255,44,201,0.4)] border border-fuchsia-500/30 p-6 backdrop-blur-sm mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <div className="text-cyan-300 font-medium mb-2">Wallet Address</div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="bg-indigo-950/70 rounded-lg px-4 py-2 border border-indigo-800/30 text-fuchsia-400 font-mono">
                                    {walletAddress}
                                </div>
                                <button
                                    onClick={() => copyToClipboard(walletAddress)}
                                    className="p-2 rounded-md bg-indigo-950/50 border border-cyan-500/30 text-cyan-300 hover:bg-indigo-900/50 transition-colors"
                                >
                                    <Copy className="h-4 w-4" />
                                </button>
                                <a
                                    href={`https://etherscan.io/address/${walletAddress}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-md bg-indigo-950/50 border border-cyan-500/30 text-cyan-300 hover:bg-indigo-900/50 transition-colors"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                </a>
                            </div>
                            <div className="flex flex-col">
                                <div className="text-cyan-300 font-medium mb-1">Balance</div>
                                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 mb-1">
                                    {hideBalance ? "••••••" : `${balance.eth} ETH`}
                                </div>
                                <div className="flex items-center">
                                    <span className="text-cyan-300/70">
                                        {hideBalance ? "••••••" : `$${balance.usd.toLocaleString()}`}
                                    </span>
                                    <div className="flex items-center text-emerald-400 text-sm ml-3">
                                        <ArrowUpRight className="h-3 w-3 mr-1" />
                                        <span>+{balance.change}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* QR Code */}
                        <div className="bg-white p-4 rounded-lg shadow-[0_0_15px_rgba(255,44,201,0.3)] animate-glow">
                            <Image
                                src={'/qr_scan.webp'}
                                alt="Wallet QR Code"
                                width={150}
                                height={150}
                                className="rounded-md"
                            />
                        </div>
                    </div>
                </div>

                {/* NFT Assets */}
                <div className="bg-gradient-to-br from-gray-900 to-indigo-950 rounded-lg shadow-[0_0_15px_rgba(255,44,201,0.3)] border border-fuchsia-500/30 p-6 backdrop-blur-sm mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
                            YOUR NFT ASSETS
                        </h2>
                        <div className="flex items-center gap-3">
                            <button className="px-4 py-2 rounded text-sm font-medium bg-indigo-950/50 border border-cyan-500/30 text-cyan-300 hover:bg-indigo-900/50 transition-colors">
                                View All
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {/* NFT Item 1 */}
                        <div className="bg-indigo-950/50 border border-indigo-800/30 rounded-lg overflow-hidden group">
                            <div className="relative aspect-square bg-gradient-to-br from-indigo-900/50 to-fuchsia-900/30">
                                <Image
                                    src="/music_icon.avif?height=300&width=300"
                                    alt="CyberPunk #1337"
                                    width={300}
                                    height={300}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-3">
                                <h3 className="font-bold text-fuchsia-400 text-sm">CyberPunk #1337</h3>
                                <p className="text-cyan-300/70 text-xs">Collection: CyberPunks</p>
                            </div>
                        </div>

                        {/* NFT Item 2 */}
                        <div className="bg-indigo-950/50 border border-indigo-800/30 rounded-lg overflow-hidden group">
                            <div className="relative aspect-square bg-gradient-to-br from-indigo-900/50 to-fuchsia-900/30">
                                <Image
                                    src="/music_icon.avif?height=300&width=300"
                                    alt="Neon Horizon #42"
                                    width={300}
                                    height={300}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-3">
                                <h3 className="font-bold text-fuchsia-400 text-sm">Neon Horizon #42</h3>
                                <p className="text-cyan-300/70 text-xs">Collection: Neon Horizons</p>
                            </div>
                        </div>

                        {/* NFT Item 3 */}
                        <div className="bg-indigo-950/50 border border-indigo-800/30 rounded-lg overflow-hidden group">
                            <div className="relative aspect-square bg-gradient-to-br from-indigo-900/50 to-fuchsia-900/30">
                                <Image
                                    src="/music_icon.avif?height=300&width=300"
                                    alt="Digital Dreams #789"
                                    width={300}
                                    height={300}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-3">
                                <h3 className="font-bold text-fuchsia-400 text-sm">Digital Dreams #789</h3>
                                <p className="text-cyan-300/70 text-xs">Collection: Digital Dreams</p>
                            </div>
                        </div>

                        {/* NFT Item 4 */}
                        <div className="bg-indigo-950/50 border border-indigo-800/30 rounded-lg overflow-hidden group">
                            <div className="relative aspect-square bg-gradient-to-br from-indigo-900/50 to-fuchsia-900/30">
                                <Image
                                    src="/music_icon.avif?height=300&width=300"
                                    alt="Synthwave Rider #21"
                                    width={300}
                                    height={300}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-3">
                                <h3 className="font-bold text-fuchsia-400 text-sm">Synthwave Rider #21</h3>
                                <p className="text-cyan-300/70 text-xs">Collection: Synthwave Riders</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Transactions */}
                <div className="bg-gradient-to-br from-gray-900 to-indigo-950 rounded-lg shadow-[0_0_15px_rgba(255,44,201,0.3)] border border-fuchsia-500/30 p-6 backdrop-blur-sm">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
                            NFT TRANSACTION HISTORY
                        </h2>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cyan-300/50" />
                                <input
                                    type="text"
                                    placeholder="Search NFT transactions..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-indigo-950/50 border border-cyan-500/30 rounded-md py-2 pl-10 pr-4 text-cyan-100 placeholder-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                                />
                            </div>
                            <button className="p-2 bg-indigo-950/50 border border-fuchsia-500/30 rounded-md text-fuchsia-400 hover:bg-indigo-900/50 transition-colors">
                                <Filter className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px]">
                            <thead>
                                <tr className="border-b border-indigo-800/50">
                                    <th className="py-3 px-4 text-left text-cyan-300 font-medium">Type</th>
                                    <th className="py-3 px-4 text-left text-cyan-300 font-medium">Amount</th>
                                    <th className="py-3 px-4 text-left text-cyan-300 font-medium">From/To</th>
                                    <th className="py-3 px-4 text-left text-cyan-300 font-medium">Date</th>
                                    <th className="py-3 px-4 text-left text-cyan-300 font-medium">Status</th>
                                    <th className="py-3 px-4 text-right text-cyan-300 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((tx) => (
                                    <tr key={tx.id} className="border-b border-indigo-800/30 hover:bg-indigo-900/20 transition-colors">
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className={`p-2 rounded-full ${tx.type === "received"
                                                        ? "bg-emerald-900/30 text-emerald-400"
                                                        : "bg-fuchsia-900/30 text-fuchsia-400"
                                                        }`}
                                                >
                                                    {tx.type === "received" ? (
                                                        <ArrowDownLeft className="h-4 w-4" />
                                                    ) : (
                                                        <ArrowUpRight className="h-4 w-4" />
                                                    )}
                                                </div>
                                                <span className="font-medium text-cyan-100 capitalize">{tx.type}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div
                                                className={`font-medium ${tx.type === "received" ? "text-emerald-400" : "text-fuchsia-400"}`}
                                            >
                                                {tx.type === "received" ? "+" : "-"}
                                                {tx.amount} ETH
                                            </div>
                                            <div className="text-xs text-cyan-300/70">
                                                ${((tx.amount * balance.usd) / balance.eth).toFixed(2)}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="font-medium text-cyan-100">{tx.type === "received" ? "From:" : "To:"}</div>
                                            <div className="text-xs text-cyan-300/70 font-mono">
                                                {tx.type === "received" ? tx.from : tx.to}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="font-medium text-cyan-100">{tx.date}</div>
                                        </td>
                                        <td className="py-4 px-4">
                                            {tx.status === "completed" ? (
                                                <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-900/30 text-emerald-400 border border-emerald-500/30 flex items-center w-fit gap-1">
                                                    <CheckCircle2 className="h-3 w-3" /> Completed
                                                </span>
                                            ) : (
                                                <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-amber-900/30 text-amber-400 border border-amber-500/30 flex items-center w-fit gap-1">
                                                    <Clock className="h-3 w-3" /> Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <a
                                                href={`https://etherscan.io/tx/${tx.hash}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center justify-center p-2 rounded-md hover:bg-indigo-800/50 transition-colors text-cyan-300"
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-between items-center mt-6">
                        <div className="text-sm text-cyan-300/70">
                            Showing <span className="text-cyan-300">1-4</span> of <span className="text-cyan-300">4</span>{" "}
                            transactions
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="px-3 py-1.5 rounded text-sm font-medium bg-indigo-950/50 border border-cyan-500/30 text-cyan-300 hover:bg-indigo-900/50 transition-colors">
                                Previous
                            </button>
                            <button className="px-3 py-1.5 rounded text-sm font-medium bg-indigo-950/50 border border-fuchsia-500/30 text-fuchsia-400 hover:bg-indigo-900/50 transition-colors">
                                Next
                            </button>
                        </div>
                    </div>
                </div>

                {/* Security Notice */}
                <div className="mt-8 bg-indigo-950/50 border border-amber-500/30 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-medium text-amber-400 mb-1">NFT Security Notice</h3>
                        <p className="text-cyan-100/80 text-sm">
                            Always verify NFT contracts before transactions. Be cautious of fake collections and never share your
                            private keys or seed phrase with anyone. Check the authenticity of NFTs before purchasing.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

