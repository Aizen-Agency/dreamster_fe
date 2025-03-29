"use client"

import { useState } from "react"
import {
    ArrowLeft,
    DollarSign,
    CreditCard,
    Wallet,
    BanknoteIcon as Bank,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Info,
    ArrowUpRight,
} from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/authStore"

export default function WithdrawEarnings() {
    const router = useRouter()
    const [amount, setAmount] = useState("")
    const [selectedMethod, setSelectedMethod] = useState<string>("bank")
    const [isProcessing, setIsProcessing] = useState(false)
    const { isLoggedIn, user } = useAuthStore()

    const handleWithdraw = () => {
        if (!amount || Number.parseFloat(amount) <= 0) return

        setIsProcessing(true)
        // Simulate processing
        setTimeout(() => {
            setIsProcessing(false)
            // Reset form or show success message
            setAmount("")
        }, 2000)
    }

    const paymentMethods = [
        { id: "bank", name: "Bank Account", icon: Bank, lastDigits: "4567" },
        { id: "card", name: "Credit Card", icon: CreditCard, lastDigits: "8901" },
        { id: "wallet", name: "Crypto Wallet", icon: Wallet, lastDigits: "3x4z" },
    ]

    const transactions = [
        {
            id: "tx-001",
            date: "Mar 5, 2025",
            amount: 1250.0,
            method: "Bank Account",
            status: "completed",
            time: "10:23 AM",
        },
        {
            id: "tx-002",
            date: "Feb 20, 2025",
            amount: 750.5,
            method: "Crypto Wallet",
            status: "completed",
            time: "3:45 PM",
        },
        {
            id: "tx-003",
            date: "Feb 5, 2025",
            amount: 500.0,
            method: "Credit Card",
            status: "failed",
            time: "11:30 AM",
        },
        {
            id: "tx-004",
            date: "Jan 22, 2025",
            amount: 1800.0,
            method: "Bank Account",
            status: "completed",
            time: "9:15 AM",
        },
    ]

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
            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.push('/dashboard/musician')} className="p-2 rounded-full bg-indigo-950/70 border border-cyan-500/30 text-cyan-400 hover:bg-indigo-900/70 transition-colors">
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 tracking-wider">
                                WITHDRAW EARNINGS
                            </h1>
                            <p className="text-cyan-300 opacity-80">Transfer your earnings to your preferred account</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-cyan-400 to-fuchsia-500 p-0.5 shadow-[0_0_15px_rgba(255,44,201,0.5)]">
                            <div className="h-full w-full rounded-full overflow-hidden">
                                <Image
                                    src={user?.avatar ?? "/placeholder.svg?height=48&width=48"}
                                    alt="Artist avatar"
                                    width={48}
                                    height={48}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        </div>
                        <div>
                            <p className="text-fuchsia-400 font-medium">{user?.username}</p>
                            <p className="text-cyan-300 text-sm opacity-80">Artist ID: {user?.id}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left column - Withdraw Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-gradient-to-br from-gray-900 to-indigo-950 rounded-lg shadow-[0_0_15px_rgba(255,44,201,0.3)] border border-fuchsia-500/30 p-6 backdrop-blur-sm mb-8">
                            <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 mb-6">
                                WITHDRAW FUNDS
                            </h2>

                            {/* Available Balance */}
                            <div className="bg-indigo-950/50 border border-cyan-500/30 rounded-lg p-4 mb-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-cyan-300">Available Balance</span>
                                    <div className="flex items-center">
                                        <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
                                            $24,500.00
                                        </span>
                                        <Info className="h-4 w-4 text-cyan-300 ml-2 cursor-help" />
                                    </div>
                                </div>
                            </div>

                            {/* Amount Input */}
                            <div className="mb-6">
                                <label htmlFor="amount" className="block text-cyan-300 mb-2">
                                    Amount to Withdraw
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                        <DollarSign className="h-5 w-5 text-cyan-400" />
                                    </div>
                                    <input
                                        type="number"
                                        id="amount"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full bg-indigo-950/50 border border-fuchsia-500/30 rounded-lg py-3 pl-12 pr-4 text-fuchsia-400 placeholder-fuchsia-400/50 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 text-xl font-bold"
                                    />
                                    <button
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-cyan-400 hover:text-cyan-300"
                                        onClick={() => setAmount("24500")}
                                    >
                                        MAX
                                    </button>
                                </div>
                                <div className="flex justify-between mt-2 text-sm">
                                    <span className="text-cyan-300/70">Min: $50.00</span>
                                    <span className="text-cyan-300/70">Fee: 1.5%</span>
                                </div>
                            </div>

                            {/* Payment Method Selection */}
                            <div className="mb-6">
                                <label className="block text-cyan-300 mb-2">Select Payment Method</label>
                                <div className="space-y-3">
                                    {paymentMethods.map((method) => (
                                        <label
                                            key={method.id}
                                            className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${selectedMethod === method.id
                                                ? "border-cyan-400 bg-indigo-900/50 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                                                : "border-indigo-700/50 hover:border-cyan-400/50 bg-indigo-950/50"
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                className="hidden"
                                                checked={selectedMethod === method.id}
                                                onChange={() => setSelectedMethod(method.id)}
                                            />
                                            <div className="flex items-center gap-3 flex-1">
                                                <div
                                                    className={`p-2 rounded-full transition-all ${selectedMethod === method.id
                                                        ? "bg-gradient-to-br from-cyan-500 to-blue-600 shadow-[0_0_10px_rgba(34,211,238,0.7)]"
                                                        : "bg-indigo-800/70"
                                                        }`}
                                                >
                                                    <method.icon
                                                        className={`h-5 w-5 ${selectedMethod === method.id ? "text-white" : "text-cyan-300"}`}
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-fuchsia-400">{method.name}</p>
                                                    <p className="text-sm text-cyan-300/70">
                                                        {method.id === "bank" && `Ending in ${method.lastDigits}`}
                                                        {method.id === "card" && `**** **** **** ${method.lastDigits}`}
                                                        {method.id === "wallet" && `${method.lastDigits}...`}
                                                    </p>
                                                </div>
                                            </div>
                                            <div
                                                className={`h-4 w-4 rounded-full border-2 ${selectedMethod === method.id ? "border-cyan-400 bg-cyan-400" : "border-indigo-600"
                                                    }`}
                                            />
                                        </label>
                                    ))}
                                    <button className="w-full p-4 border border-dashed border-indigo-700/50 rounded-lg text-cyan-300 hover:border-cyan-400/50 hover:text-cyan-400 transition-all flex items-center justify-center gap-2">
                                        <span>+ Add New Payment Method</span>
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={handleWithdraw}
                                disabled={!amount || Number.parseFloat(amount) <= 0 || isProcessing}
                                className={`w-full py-3 rounded-lg font-bold tracking-wider transition-all ${!amount || Number.parseFloat(amount) <= 0 || isProcessing
                                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                                    : "bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white shadow-[0_0_10px_rgba(232,121,249,0.5)] hover:shadow-[0_0_15px_rgba(232,121,249,0.7)]"
                                    }`}
                            >
                                {isProcessing ? "PROCESSING..." : "WITHDRAW FUNDS"}
                            </button>

                            <div className="mt-4 text-sm text-cyan-300/70 flex items-center gap-1">
                                <Info className="h-4 w-4" />
                                <span>Withdrawals typically process within 1-3 business days</span>
                            </div>
                        </div>

                        {/* Transaction History */}
                        <div className="bg-gradient-to-br from-gray-900 to-indigo-950 rounded-lg shadow-[0_0_15px_rgba(255,44,201,0.3)] border border-fuchsia-500/30 p-6 backdrop-blur-sm">
                            <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 mb-6">
                                TRANSACTION HISTORY
                            </h2>

                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[600px]">
                                    <thead>
                                        <tr className="border-b border-indigo-800/50">
                                            <th className="py-3 px-4 text-left text-cyan-300 font-medium">Date</th>
                                            <th className="py-3 px-4 text-left text-cyan-300 font-medium">Transaction ID</th>
                                            <th className="py-3 px-4 text-left text-cyan-300 font-medium">Amount</th>
                                            <th className="py-3 px-4 text-left text-cyan-300 font-medium">Method</th>
                                            <th className="py-3 px-4 text-left text-cyan-300 font-medium">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.map((tx) => (
                                            <tr
                                                key={tx.id}
                                                className="border-b border-indigo-800/30 hover:bg-indigo-900/20 transition-colors"
                                            >
                                                <td className="py-4 px-4">
                                                    <div className="text-fuchsia-400">{tx.date}</div>
                                                    <div className="text-xs text-cyan-300/70">{tx.time}</div>
                                                </td>
                                                <td className="py-4 px-4 text-cyan-100 font-mono">{tx.id}</td>
                                                <td className="py-4 px-4 text-cyan-100 font-medium">${tx.amount.toFixed(2)}</td>
                                                <td className="py-4 px-4 text-cyan-100">{tx.method}</td>
                                                <td className="py-4 px-4">
                                                    {tx.status === "completed" ? (
                                                        <span className="flex items-center gap-1 text-emerald-400">
                                                            <CheckCircle className="h-4 w-4" />
                                                            <span>Completed</span>
                                                        </span>
                                                    ) : tx.status === "pending" ? (
                                                        <span className="flex items-center gap-1 text-amber-400">
                                                            <Clock className="h-4 w-4" />
                                                            <span>Pending</span>
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-1 text-red-400">
                                                            <XCircle className="h-4 w-4" />
                                                            <span>Failed</span>
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex justify-between items-center mt-6">
                                <div className="text-sm text-cyan-300/70">
                                    Showing <span className="text-cyan-300">1-4</span> of <span className="text-cyan-300">12</span>{" "}
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
                    </div>

                    {/* Right column - Stats and Info */}
                    <div className="lg:col-span-1">
                        {/* Earnings Summary */}
                        <div className="bg-gradient-to-br from-gray-900 to-indigo-950 rounded-lg shadow-[0_0_15px_rgba(255,44,201,0.3)] border border-fuchsia-500/30 p-6 backdrop-blur-sm mb-8">
                            <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 mb-6">
                                EARNINGS SUMMARY
                            </h2>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center pb-3 border-b border-indigo-800/30">
                                    <span className="text-cyan-300">Total Earnings</span>
                                    <span className="text-fuchsia-400 font-bold">$28,750.00</span>
                                </div>
                                <div className="flex justify-between items-center pb-3 border-b border-indigo-800/30">
                                    <span className="text-cyan-300">Withdrawn</span>
                                    <span className="text-fuchsia-400 font-bold">$4,250.00</span>
                                </div>
                                <div className="flex justify-between items-center pb-3 border-b border-indigo-800/30">
                                    <span className="text-cyan-300">Available Balance</span>
                                    <span className="text-fuchsia-400 font-bold">$24,500.00</span>
                                </div>
                                <div className="flex justify-between items-center pb-3 border-b border-indigo-800/30">
                                    <span className="text-cyan-300">Pending Earnings</span>
                                    <span className="text-fuchsia-400 font-bold">$1,850.00</span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <div className="text-cyan-300 mb-2">Monthly Earnings</div>
                                <div className="space-y-2">
                                    {/* March */}
                                    <div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-cyan-300/70">March 2025</span>
                                            <span className="text-cyan-300">$3,250.00</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-indigo-900/50 rounded-full mt-1 overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-full"
                                                style={{ width: "65%" }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* February */}
                                    <div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-cyan-300/70">February 2025</span>
                                            <span className="text-cyan-300">$5,000.00</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-indigo-900/50 rounded-full mt-1 overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-full"
                                                style={{ width: "100%" }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* January */}
                                    <div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-cyan-300/70">January 2025</span>
                                            <span className="text-cyan-300">$4,200.00</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-indigo-900/50 rounded-full mt-1 overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-full"
                                                style={{ width: "84%" }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex items-center justify-center">
                                <button className="px-4 py-2 rounded text-sm font-medium bg-indigo-950/50 border border-cyan-500/30 text-cyan-300 hover:bg-indigo-900/50 transition-colors flex items-center gap-2">
                                    <span>View Detailed Analytics</span>
                                    <ArrowUpRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* Withdrawal Info */}
                        <div className="bg-gradient-to-br from-gray-900 to-indigo-950 rounded-lg shadow-[0_0_15px_rgba(255,44,201,0.3)] border border-fuchsia-500/30 p-6 backdrop-blur-sm">
                            <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 mb-6">
                                WITHDRAWAL INFO
                            </h2>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3 pb-3 border-b border-indigo-800/30">
                                    <AlertCircle className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-fuchsia-400 font-medium">Processing Time</p>
                                        <p className="text-sm text-cyan-300/70">
                                            Withdrawals typically process within 1-3 business days depending on your payment method.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 pb-3 border-b border-indigo-800/30">
                                    <AlertCircle className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-fuchsia-400 font-medium">Minimum Withdrawal</p>
                                        <p className="text-sm text-cyan-300/70">The minimum withdrawal amount is $50.00 USD.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 pb-3 border-b border-indigo-800/30">
                                    <AlertCircle className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-fuchsia-400 font-medium">Fees</p>
                                        <p className="text-sm text-cyan-300/70">
                                            A 1.5% processing fee applies to all withdrawals. This fee is deducted from the withdrawal amount.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <AlertCircle className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-fuchsia-400 font-medium">Tax Information</p>
                                        <p className="text-sm text-cyan-300/70">
                                            Remember to keep track of your earnings for tax purposes. You can download your earnings statement
                                            from the Analytics page.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 p-4 bg-indigo-950/50 border border-amber-500/30 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-amber-400 font-medium">Need Help?</p>
                                        <p className="text-sm text-cyan-300/70">
                                            If you have any questions about withdrawals or need assistance, please contact our support team.
                                        </p>
                                        <button className="mt-2 text-sm text-amber-400 hover:text-amber-300 transition-colors">
                                            Contact Support →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

