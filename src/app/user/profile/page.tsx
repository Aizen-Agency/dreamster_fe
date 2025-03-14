"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { User, Key, Phone, Mail, Save, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useUserProfile } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/authStore"

export default function ProfilePage() {
    const router = useRouter()
    const [currentTime, setCurrentTime] = useState("")
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    const { isLoggedIn, user } = useAuthStore()
    const {
        data: userProfile,
        isLoading,
        isError,
        error
    } = useUserProfile()

    // Profile form state
    const [profile, setProfile] = useState({
        name: user?.username || "",
        email: user?.email || "",
        phone: "",
        password: "••••••••",
    })

    // Update profile when data is loaded
    useEffect(() => {
        if (userProfile) {
            setProfile({
                name: userProfile.name || user?.username || "",
                email: userProfile.email || user?.email || "",
                phone: userProfile.phone || "",
                password: "••••••••",
            })
        }
    }, [userProfile, user])

    // Redirect if not logged in
    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/auth/login')
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
        setProfile((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        // Simulate API call
        setTimeout(() => {
            setSaving(false)
            setSaved(true)

            // Update user in auth store
            useAuthStore.getState().updateUser({
                username: profile.name,
                email: profile.email
            })

            setTimeout(() => setSaved(false), 2000)
        }, 1500)
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
                    onClick={() => router.push('/dashboard')}
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

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="name" className="block text-sm text-pink-300">
                                DISPLAY NAME
                            </label>
                            <div className="relative">
                                <User className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-300" />
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={profile.name}
                                    onChange={handleChange}
                                    className="pl-9 bg-purple-800/50 border-pink-500/50 text-pink-100 focus:border-cyan-400 focus:ring-cyan-400/50"
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
                                    onChange={handleChange}
                                    className="pl-9 bg-purple-800/50 border-pink-500/50 text-pink-100 focus:border-cyan-400 focus:ring-cyan-400/50"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="phone" className="block text-sm text-pink-300">
                                PHONE NUMBER
                            </label>
                            <div className="relative">
                                <Phone className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-300" />
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    value={profile.phone}
                                    onChange={handleChange}
                                    className="pl-9 bg-purple-800/50 border-pink-500/50 text-pink-100 focus:border-cyan-400 focus:ring-cyan-400/50"
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
                                    type="password"
                                    value={profile.password}
                                    onChange={handleChange}
                                    className="pl-9 bg-purple-800/50 border-pink-500/50 text-pink-100 focus:border-cyan-400 focus:ring-cyan-400/50"
                                />
                            </div>
                            <p className="text-xs text-pink-300/70 mt-1">LEAVE BLANK TO KEEP CURRENT PASSWORD</p>
                        </div>

                        <Button
                            type="submit"
                            disabled={saving}
                            className="w-full bg-gradient-to-r from-pink-500 to-cyan-500 hover:from-cyan-500 hover:to-pink-500 mt-6 shadow-[0_0_15px_rgba(236,72,153,0.3)]"
                        >
                            {saving ? "SAVING..." : "SAVE PROFILE"}
                            {!saving && <Save className="ml-2 h-4 w-4" />}
                        </Button>
                    </form>
                </div>

                {/* Success Message */}
                {saved && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-purple-900/80 backdrop-blur-sm">
                        <div className="bg-gradient-to-br from-purple-800 to-fuchsia-900 border-2 border-pink-500 rounded-lg p-6 shadow-[0_0_30px_rgba(236,72,153,0.5)] max-w-sm w-full mx-4 animate-[pulse_2s_ease-in-out_infinite]">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-cyan-400 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(236,72,153,0.7)]">
                                    <Save className="h-6 w-6 text-white" />
                                </div>
                                <h2 className="text-xl font-bold text-cyan-300 mb-2 tracking-wider">PROFILE UPDATED!</h2>
                                <p className="text-pink-200 mb-4">YOUR PROFILE INFORMATION HAS BEEN SUCCESSFULLY SAVED.</p>
                            </div>
                        </div>
                    </div>
                )}

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

