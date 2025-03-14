"use client"

import { useState } from "react"
import { ArrowRight, Eye, EyeOff, Mail, Lock, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useRegister } from "@/hooks/useAuth"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function RegisterEmailPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    })
    const [showPassword, setShowPassword] = useState(false)
    const [passwordError, setPasswordError] = useState("")

    const registerMutation = useRegister()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))

        // Clear password error when user types
        if (name === "password" || name === "confirmPassword") {
            setPasswordError("")
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setPasswordError("Passwords do not match")
            return
        }

        // Submit registration
        registerMutation.mutate({
            username: formData.username,
            email: formData.email,
            password: formData.password
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
                            <Mail className="h-10 w-10 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 tracking-wider">
                            REGISTER WITH EMAIL
                        </h2>
                        <p className="text-cyan-200">Create your account to get started</p>
                    </div>

                    {/* Registration Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-fuchsia-300 font-semibold">
                                Username
                            </Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cyan-400" />
                                <Input
                                    id="username"
                                    name="username"
                                    type="text"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="Choose a username"
                                    required
                                    className="bg-indigo-950/50 border-indigo-700/50 focus:border-cyan-400 text-white placeholder:text-indigo-400 pl-10"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-fuchsia-300 font-semibold">
                                Email Address
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cyan-400" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="your.email@example.com"
                                    required
                                    className="bg-indigo-950/50 border-indigo-700/50 focus:border-cyan-400 text-white placeholder:text-indigo-400 pl-10"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-fuchsia-300 font-semibold">
                                Password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cyan-400" />
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Create a strong password"
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

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-fuchsia-300 font-semibold">
                                Confirm Password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cyan-400" />
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm your password"
                                    required
                                    className="bg-indigo-950/50 border-indigo-700/50 focus:border-cyan-400 text-white placeholder:text-indigo-400 pl-10"
                                />
                            </div>
                            {passwordError && (
                                <p className="text-red-400 text-sm">{passwordError}</p>
                            )}
                        </div>

                        {registerMutation.error && (
                            <div className="bg-red-900/30 border border-red-500/50 text-red-200 p-2 rounded text-sm">
                                {registerMutation.error instanceof Error
                                    ? registerMutation.error.message
                                    : "Registration failed. Please try again."}
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={registerMutation.isPending}
                            className="w-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white font-bold tracking-wider py-5 shadow-[0_0_10px_rgba(232,121,249,0.5)] hover:shadow-[0_0_15px_rgba(232,121,249,0.7)] transition-all duration-300"
                        >
                            {registerMutation.isPending ? (
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
                                    CREATING ACCOUNT...
                                </div>
                            ) : (
                                <>
                                    REGISTER <ArrowRight className="ml-2 h-5 w-5" />
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Login Option */}
                    <div className="text-center pt-4">
                        <p className="text-sm text-cyan-200">
                            Already have an account?{" "}
                            <Link href="/auth/login/email" className="text-fuchsia-400 hover:text-fuchsia-300 font-semibold">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
} 