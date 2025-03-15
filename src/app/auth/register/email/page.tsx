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
                    backgroundImage: `linear-gradient(#00ffff 1px, transparent 1px), linear-gradient(90deg, #00ffff 1px, transparent 1px)`,
                    backgroundSize: "40px 40px",
                    backgroundPosition: "-1px -1px",
                    perspective: "500px",
                    transform: "rotateX(60deg)",
                    transformOrigin: "center top",
                }}
            />

            {/* Sun/horizon glow */}
            <div className="absolute bottom-0 left-0 right-0 h-60 bg-gradient-to-t from-fuchsia-600 via-purple-600 to-transparent opacity-30" />

            {/* Main content container */}
            <div className="bg-gradient-to-br from-gray-950 to-indigo-950 rounded-lg shadow-[0_0_30px_rgba(255,0,255,0.7)] border border-fuchsia-400/50 max-w-md w-full p-8 backdrop-blur-sm relative z-10">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-fuchsia-300 tracking-wider">
                        Create Your Account
                    </h1>
                    <p className="text-cyan-200 mt-2">Join the future of music discovery</p>
                </div>

                {/* Error message display */}
                {registerMutation.error && (
                    <div className="bg-red-900/30 border border-red-500/50 text-red-200 p-3 rounded text-sm mb-6">
                        {registerMutation.error?.response?.data?.message || "Registration failed. Please try again."}
                    </div>
                )}

                {/* Registration Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Username Field */}
                    <div className="space-y-2">
                        <Label htmlFor="username" className="text-cyan-200 flex items-center gap-2">
                            <User className="h-4 w-4 text-fuchsia-400" />
                            Username
                        </Label>
                        <div className="relative">
                            <Input
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Enter your username"
                                required
                                className="bg-indigo-950/50 border-indigo-700 focus:border-fuchsia-400 text-cyan-100 placeholder:text-indigo-400/70 py-5"
                            />
                        </div>
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-cyan-200 flex items-center gap-2">
                            <Mail className="h-4 w-4 text-fuchsia-400" />
                            Email
                        </Label>
                        <div className="relative">
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                                className="bg-indigo-950/50 border-indigo-700 focus:border-fuchsia-400 text-cyan-100 placeholder:text-indigo-400/70 py-5"
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-cyan-200 flex items-center gap-2">
                            <Lock className="h-4 w-4 text-fuchsia-400" />
                            Password
                        </Label>
                        <div className="relative">
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Create a password"
                                required
                                className="bg-indigo-950/50 border-indigo-700 focus:border-fuchsia-400 text-cyan-100 placeholder:text-indigo-400/70 py-5 pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-400 hover:text-cyan-300"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password Field */}
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-cyan-200 flex items-center gap-2">
                            <Lock className="h-4 w-4 text-fuchsia-400" />
                            Confirm Password
                        </Label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showPassword ? "text" : "password"}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm your password"
                                required
                                className="bg-indigo-950/50 border-indigo-700 focus:border-fuchsia-400 text-cyan-100 placeholder:text-indigo-400/70 py-5 pr-10"
                            />
                        </div>
                        {passwordError && (
                            <p className="text-red-400 text-sm mt-1">{passwordError}</p>
                        )}
                    </div>

                    {/* Submit Button */}
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
    )
} 