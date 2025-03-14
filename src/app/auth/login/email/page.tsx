"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ArrowRight, Eye, EyeOff, Lock, Mail, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { useLogin } from "@/hooks/useAuth"
import { useAuthStore } from "@/store/authStore"
import { useRouter } from "next/navigation"

export default function LoginScreen() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)

    const loginMutation = useLogin()
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
    const router = useRouter()

    // Redirect if already logged in
    useEffect(() => {
        if (isLoggedIn) {
            router.push('/dashboard')
        }
    }, [isLoggedIn, router])

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()

        loginMutation.mutate({
            email,
            password
        })
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
                <div className="space-y-8 text-white">
                    {/* Header */}
                    <div className="text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-fuchsia-500 rounded-full mx-auto flex items-center justify-center mb-4">
                            <Lock className="h-10 w-10 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 tracking-wider">
                            LOGIN TO DREAMSTER
                        </h2>
                        <p className="text-cyan-200">Enter your credentials to access your account</p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-fuchsia-300 font-semibold">
                                Email Address
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cyan-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your.email@example.com"
                                    required
                                    className="bg-indigo-950/50 border-indigo-700/50 focus:border-cyan-400 text-white placeholder:text-indigo-400 pl-10"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label htmlFor="password" className="text-fuchsia-300 font-semibold">
                                    Password
                                </Label>
                                <Link href="/user/account/recovery" className="text-xs text-cyan-300 hover:text-cyan-200">
                                    Forgot Password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cyan-400" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="bg-indigo-950/50 border-indigo-700/50 focus:border-cyan-400 text-white placeholder:text-indigo-400 pl-10 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-cyan-400" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-cyan-400" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="remember"
                                checked={rememberMe}
                                onCheckedChange={(checked) => setRememberMe(checked === true)}
                                className="border-cyan-400 data-[state=checked]:bg-cyan-400 data-[state=checked]:text-black"
                            />
                            <Label htmlFor="remember" className="text-sm text-cyan-200">
                                Remember me for 30 days
                            </Label>
                        </div>

                        {loginMutation.error && (
                            <div className="bg-red-900/30 border border-red-500/50 text-red-200 p-2 rounded text-sm">
                                {loginMutation.error instanceof Error
                                    ? loginMutation.error.message
                                    : "Login failed. Please check your credentials."}
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={loginMutation.isPending}
                            className="w-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white font-bold tracking-wider py-5 shadow-[0_0_10px_rgba(232,121,249,0.5)] hover:shadow-[0_0_15px_rgba(232,121,249,0.7)] transition-all duration-300"
                        >
                            {loginMutation.isPending ? (
                                <div className="flex items-center">
                                    <svg
                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    LOGGING IN...
                                </div>
                            ) : (
                                <>
                                    LOGIN <ArrowRight className="ml-2 h-5 w-5" />
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Security Note */}
                    <div className="bg-indigo-900/20 p-3 rounded-md border border-cyan-500/30">
                        <p className="text-xs text-cyan-200 flex items-start">
                            <Shield className="h-4 w-4 mr-2 flex-shrink-0 text-cyan-400" />
                            Your login is secured with end-to-end encryption. We never store your password in plain text.
                        </p>
                    </div>

                    {/* Sign Up Option */}
                    <div className="text-center pt-4">
                        <p className="text-sm text-cyan-200">
                            Don't have an account?{" "}
                            <Link href="/auth/register" className="text-fuchsia-400 hover:text-fuchsia-300 font-semibold">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

