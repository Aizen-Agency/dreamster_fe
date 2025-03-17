"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Check, Mail, Shield, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

export default function AccountRecovery() {
    const router = useRouter()
    const [step, setStep] = useState<number>(1)
    const [email, setEmail] = useState<string>("")
    const [code, setCode] = useState<string[]>(Array(6).fill(""))
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [newPassword, setNewPassword] = useState<string>("")
    const [confirmPassword, setConfirmPassword] = useState<string>("")

    const handleEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsLoading(true)

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false)
            if (!email.includes("@")) {
                setError("PLEASE ENTER A VALID EMAIL ADDRESS")
                return
            }
            setStep(2)
        }, 1500)
    }

    const handleCodeChange = (index: number, value: string) => {
        if (value.length > 1) value = value[0]
        if (!/^\d*$/.test(value) && value !== "") return

        const newCode = [...code]
        newCode[index] = value
        setCode(newCode)

        // Auto-focus next input
        if (value !== "" && index < 5) {
            const nextInput = document.getElementById(`code-${index + 1}`)
            nextInput?.focus()
        }
    }

    const handleCodeSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsLoading(true)

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false)
            if (code.join("").length !== 6) {
                setError("PLEASE ENTER A VALID 6-DIGIT CODE")
                return
            }
            setStep(3)
        }, 1500)
    }

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsLoading(true)

        // Password validation
        if (newPassword.length < 8) {
            setIsLoading(false)
            setError("PASSWORD MUST BE AT LEAST 8 CHARACTERS")
            return
        }

        if (newPassword !== confirmPassword) {
            setIsLoading(false)
            setError("PASSWORDS DO NOT MATCH")
            return
        }

        // Simulate API call to reset password
        setTimeout(() => {
            setIsLoading(false)
            setStep(4) // Move to success step
        }, 1500)
    }

    const handleResendCode = () => {
        setError(null)
        setIsLoading(true)

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false)
            setError("NEW CODE SENT TO YOUR EMAIL")
        }, 1500)
    }

    const getCurrentTime = () => {
        const now = new Date()
        return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-black flex flex-col items-center justify-center p-4 relative overflow-hidden font-mono">
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

            <div className="max-w-md w-full space-y-6 relative z-10">
                {/* Header */}
                <div className="bg-gradient-to-r from-synthwave-purple to-synthwave-pink rounded-lg shadow-[0_0_15px_rgba(255,44,201,0.5)] border border-fuchsia-500/30 p-4 flex items-center justify-between animate-glow">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-synthwave-cyan to-synthwave-pink p-0.5">
                        <div className="bg-indigo-950 rounded-full w-full h-full flex items-center justify-center">
                            <Shield className="w-5 h-5 text-synthwave-cyan" />
                        </div>
                    </div>

                    <div className="text-center">
                        <h1 className="text-xl font-bold text-synthwave-cyan uppercase tracking-wider">Account Recovery</h1>
                        <p className="text-xs text-synthwave-pink uppercase">Regain Access To Your Account</p>
                    </div>

                    <button onClick={() => window.history.back()} className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-950 border border-synthwave-pink/30 hover:border-synthwave-pink transition-colors">
                        <ArrowLeft className="w-5 h-5 text-synthwave-cyan" />
                    </button>
                </div>

                {/* Main Content Card */}
                <div className="bg-indigo-950/70 backdrop-blur-sm rounded-lg shadow-lg border border-fuchsia-500/30 p-6 animate-glow">
                    {/* Step 1: Email Input */}
                    {step === 1 && (
                        <form onSubmit={handleEmailSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <h2 className="text-xl font-bold text-synthwave-cyan uppercase tracking-wider text-center">
                                    Forgot Your Password?
                                </h2>
                                <p className="text-sm text-synthwave-pink text-center uppercase">
                                    Enter your email address to receive a recovery code
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <Mail className="h-5 w-5 text-synthwave-pink" />
                                    </div>
                                    <Input
                                        type="email"
                                        placeholder="YOUR EMAIL ADDRESS"
                                        className="pl-10 bg-indigo-900/40 border-synthwave-pink/30 text-white placeholder:text-synthwave-pink/50 focus:border-synthwave-cyan"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                {error && <div className="text-red-400 text-sm uppercase text-center">{error}</div>}

                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-synthwave-cyan to-synthwave-pink text-white font-bold tracking-wider py-5 uppercase shadow-[0_0_10px_rgba(232,121,249,0.5)] hover:shadow-[0_0_15px_rgba(232,121,249,0.7)] transition-all duration-300"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Sending..." : "Send Recovery Code"}
                                </Button>
                            </div>
                        </form>
                    )}

                    {/* Step 2: Code Verification */}
                    {step === 2 && (
                        <form onSubmit={handleCodeSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <h2 className="text-xl font-bold text-synthwave-cyan uppercase tracking-wider text-center">
                                    Check Your Email
                                </h2>
                                <p className="text-sm text-synthwave-pink text-center uppercase">
                                    We sent a 6-digit code to <span className="text-synthwave-cyan">{email}</span>
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between gap-2">
                                    {code.map((digit, index) => (
                                        <Input
                                            key={index}
                                            id={`code-${index}`}
                                            type="text"
                                            maxLength={1}
                                            className="w-12 h-12 text-center text-xl bg-indigo-900/40 border-synthwave-pink/30 text-white focus:border-synthwave-cyan"
                                            value={digit}
                                            onChange={(e) => handleCodeChange(index, e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Backspace" && !digit && index > 0) {
                                                    const prevInput = document.getElementById(`code-${index - 1}`)
                                                    prevInput?.focus()
                                                }
                                            }}
                                        />
                                    ))}
                                </div>

                                {error && (
                                    <div
                                        className={`text-sm uppercase text-center ${error.includes("SENT") ? "text-green-400" : "text-red-400"}`}
                                    >
                                        {error}
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <Button
                                        type="button"
                                        className="bg-indigo-900/40 border border-synthwave-pink/30 text-white font-bold tracking-wider py-5 uppercase hover:bg-indigo-900/60 transition-all duration-300"
                                        onClick={() => setStep(1)}
                                        disabled={isLoading}
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="bg-gradient-to-r from-synthwave-cyan to-synthwave-pink text-white font-bold tracking-wider py-5 uppercase shadow-[0_0_10px_rgba(232,121,249,0.5)] hover:shadow-[0_0_15px_rgba(232,121,249,0.7)] transition-all duration-300"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Verifying..." : "Verify Code"}
                                    </Button>
                                </div>

                                <button
                                    type="button"
                                    className="w-full text-center text-xs text-synthwave-pink uppercase hover:text-synthwave-cyan transition-colors"
                                    onClick={handleResendCode}
                                    disabled={isLoading}
                                >
                                    Didn't receive a code? Resend
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Step 3: New Password */}
                    {step === 3 && (
                        <form onSubmit={handlePasswordSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <h2 className="text-xl font-bold text-synthwave-cyan uppercase tracking-wider text-center">
                                    Create New Password
                                </h2>
                                <p className="text-sm text-synthwave-pink text-center uppercase">
                                    Enter a new secure password for your account
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <Lock className="h-5 w-5 text-synthwave-pink" />
                                    </div>
                                    <Input
                                        type="password"
                                        placeholder="NEW PASSWORD"
                                        className="pl-10 bg-indigo-900/40 border-synthwave-pink/30 text-white placeholder:text-synthwave-pink/50 focus:border-synthwave-cyan"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <Lock className="h-5 w-5 text-synthwave-pink" />
                                    </div>
                                    <Input
                                        type="password"
                                        placeholder="CONFIRM PASSWORD"
                                        className="pl-10 bg-indigo-900/40 border-synthwave-pink/30 text-white placeholder:text-synthwave-pink/50 focus:border-synthwave-cyan"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                {error && <div className="text-red-400 text-sm uppercase text-center">{error}</div>}

                                <div className="grid grid-cols-2 gap-4">
                                    <Button
                                        type="button"
                                        className="bg-indigo-900/40 border border-synthwave-pink/30 text-white font-bold tracking-wider py-5 uppercase hover:bg-indigo-900/60 transition-all duration-300"
                                        onClick={() => setStep(2)}
                                        disabled={isLoading}
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="bg-gradient-to-r from-synthwave-cyan to-synthwave-pink text-white font-bold tracking-wider py-5 uppercase shadow-[0_0_10px_rgba(232,121,249,0.5)] hover:shadow-[0_0_15px_rgba(232,121,249,0.7)] transition-all duration-300"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Updating..." : "Reset Password"}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    )}

                    {/* Step 4: Success (previously step 3) */}
                    {step === 4 && (
                        <div className="space-y-6 flex flex-col items-center">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-synthwave-cyan to-synthwave-pink p-0.5 animate-glow">
                                <div className="bg-indigo-950 rounded-full w-full h-full flex items-center justify-center">
                                    <Check className="w-10 h-10 text-synthwave-cyan" />
                                </div>
                            </div>

                            <div className="space-y-2 text-center">
                                <h2 className="text-xl font-bold text-synthwave-cyan uppercase tracking-wider">Password Reset Complete!</h2>
                                <p className="text-sm text-synthwave-pink uppercase">Your password has been successfully updated</p>
                            </div>

                            <Button
                                className="w-full bg-gradient-to-r from-synthwave-cyan to-synthwave-pink text-white font-bold tracking-wider py-5 uppercase shadow-[0_0_10px_rgba(232,121,249,0.5)] hover:shadow-[0_0_15px_rgba(232,121,249,0.7)] transition-all duration-300"
                                onClick={() => router.push("/auth/login/email")}
                            >
                                Return to Login
                            </Button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center text-xs text-synthwave-pink/70 uppercase px-2">
                    <div>Dreamster.io • Account Recovery</div>
                    <div className="flex items-center">
                        <span className="w-2 h-2 bg-synthwave-cyan rounded-full mr-2"></span>
                        <span>Secure Connection • {getCurrentTime()}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

