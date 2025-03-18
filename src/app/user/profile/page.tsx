"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { User, Key, Phone, Mail, Save, ArrowLeft, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useUpdateProfile, useUserProfile } from "@/hooks/useProfile"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/authStore"

export default function ProfilePage() {
    const router = useRouter()
    const [currentTime, setCurrentTime] = useState("")
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const { data: userProfile } = useUserProfile()

    const { isLoggedIn, user } = useAuthStore()
    const updateProfileMutation = useUpdateProfile()

    // Profile form state
    console.log(userProfile)
    const [profile, setProfile] = useState({
        username: userProfile?.username ?? user?.username,
        email: user?.email ?? "",
        phone_number: userProfile?.phone_number ?? '',
        password: userProfile?.password ?? "",
    })

    // Redirect if not logged in
    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/auth/login/email')
        }
    }, [isLoggedIn, router])

    useEffect(() => {
        const updateTime = () => {
            const now = new Date()
            setCurrentTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
        }

        updateTime()
        const interval = setInterval(updateTime, 60000)

        return () => clearInterval(interval)
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setProfile(prev => ({ ...prev, [name]: value }))
        // Clear any previous messages when form is changed
        setErrorMessage(null)
        setSuccessMessage(null)
        setSaved(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setErrorMessage(null)
        setSuccessMessage(null)

        // Prepare data for update (only include fields with values)
        const updateData: Record<string, string> = {}

        if (profile.username && profile.username.length >= 3) {
            updateData.username = profile.username
        }

        if (profile.phone_number) {
            updateData.phone_number = profile.phone_number
        }

        if (profile.password && profile.password.length >= 6) {
            updateData.password = profile.password
        }

        // Only submit if there are changes
        if (Object.keys(updateData).length > 0) {
            try {
                await updateProfileMutation.mutateAsync(updateData)
                setSuccessMessage("Profile updated successfully")
                setSaved(true)
                // Clear password field after successful update
                setProfile(prev => ({
                    ...prev,
                    password: ""
                }))
            } catch (error: any) {
                setErrorMessage(error.message || "Failed to update profile. Please try again.")
            } finally {
                setSaving(false)
            }
        } else {
            setErrorMessage("Please make changes before saving")
            setSaving(false)
        }
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

            {/* Content */}
            <div className="relative z-10 w-full max-w-md">
                {/* Back button */}
                <Button
                    onClick={() => user?.role === 'musician' ? router.push('/dashboard/musician') : router.push('/collection')}
                    variant="ghost"
                    className="mb-4 text-pink-300 hover:text-pink-100 hover:bg-pink-900/20"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                </Button>

                <div className="bg-gradient-to-br from-purple-900/80 to-indigo-900/80 rounded-lg border border-pink-500/30 p-6 backdrop-blur-sm">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-cyan-400 p-[2px] shadow-[0_0_15px_rgba(236,72,153,0.5)]">
                            <div className="w-full h-full rounded-full bg-purple-900 flex items-center justify-center">
                                <User className="w-8 h-8 text-pink-300" />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-400">
                                PROFILE SETTINGS
                            </h2>
                            <p className="text-pink-300 text-sm">Update your personal information</p>
                        </div>
                    </div>

                    {/* Error message display */}
                    {errorMessage && (
                        <div className="bg-red-900/30 border border-red-500/50 text-red-200 p-3 rounded text-sm mb-6">
                            {errorMessage}
                        </div>
                    )}

                    {/* Success message display */}
                    {successMessage && (
                        <div className="bg-green-900/30 border border-green-500/50 text-green-200 p-3 rounded text-sm mb-6">
                            {successMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="username" className="block text-sm text-pink-300">
                                DISPLAY NAME
                            </label>
                            <div className="relative">
                                <User className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-300" />
                                <Input
                                    id="username"
                                    name="username"
                                    type="text"
                                    value={profile.username}
                                    onChange={handleChange}
                                    className="pl-9 bg-purple-800/50 border-pink-500/50 text-pink-100 focus:border-cyan-400 focus:ring-cyan-400/50"
                                    minLength={3}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm text-pink-300">
                                EMAIL ADDRESS
                            </label>
                            <div className="relative">
                                <Mail className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-300" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={profile.email}
                                    disabled
                                    className="pl-9 bg-purple-800/50 border-pink-500/50 text-pink-100 opacity-70"
                                />
                            </div>
                            <p className="text-xs text-pink-300/70 mt-1">EMAIL CANNOT BE CHANGED</p>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="phone_number" className="block text-sm text-pink-300">
                                PHONE NUMBER
                            </label>
                            <div className="relative">
                                <Phone className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-300" />
                                <Input
                                    id="phone_number"
                                    name="phone_number"
                                    type="text"
                                    value={profile.phone_number}
                                    onChange={handleChange}
                                    className="pl-9 bg-purple-800/50 border-pink-500/50 text-pink-100 focus:border-cyan-400 focus:ring-cyan-400/50"
                                    placeholder="+1234567890"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm text-pink-300">
                                PASSWORD
                            </label>
                            <div className="relative">
                                <Key className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-300" />
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={profile.password}
                                    onChange={handleChange}
                                    className="pl-9 bg-purple-800/50 border-pink-500/50 text-pink-100 focus:border-cyan-400 focus:ring-cyan-400/50"
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4 text-pink-400" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-pink-400" />
                                    )}
                                </button>
                            </div>
                            <p className="text-xs text-pink-300/70 mt-1">LEAVE BLANK TO KEEP CURRENT PASSWORD</p>
                        </div>

                        <Button
                            type="submit"
                            disabled={saving}
                            className="w-full bg-gradient-to-r from-pink-500 to-cyan-500 hover:from-cyan-500 hover:to-pink-500 mt-6 shadow-[0_0_15px_rgba(236,72,153,0.3)]"
                        >
                            {saving ? "SAVING..." : saved ? "SAVED" : "SAVE PROFILE"}
                            {!saving && !saved && <Save className="ml-2 h-4 w-4" />}
                        </Button>
                    </form>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center text-xs text-pink-300/70 px-2">
                    <div>DREAMSTER.IO • USER PROFILE</div>
                    <div className="flex items-center">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full mr-1 shadow-[0_0_5px_rgba(45,212,191,0.7)]"></div>
                        <span>SECURE CONNECTION • {currentTime}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

