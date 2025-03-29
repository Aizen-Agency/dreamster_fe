"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { User, Key, Phone, Mail, Save, ArrowLeft, Eye, EyeOff, Check, Shield, Upload, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUpdateProfile, useUserProfile, useUploadProfilePicture } from "@/hooks/useProfile"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/authStore"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export default function ProfilePage() {
    const router = useRouter()
    const [currentTime, setCurrentTime] = useState("")
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const [isHoveringAvatar, setIsHoveringAvatar] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const { data: userProfile } = useUserProfile()
    const { isLoggedIn, user } = useAuthStore()
    const updateProfileMutation = useUpdateProfile()
    const uploadProfilePictureMutation = useUploadProfilePicture()

    // Profile form state
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

    const handleProfilePictureClick = () => {
        fileInputRef.current?.click()
    }

    const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
        if (!validTypes.includes(file.type)) {
            setErrorMessage("Please select a valid image file (JPG, PNG, or GIF)")
            return
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setErrorMessage("Image size should be less than 5MB")
            return
        }

        setErrorMessage(null)
        setSuccessMessage(null)

        try {
            await uploadProfilePictureMutation.mutateAsync(file)
            setSuccessMessage("Profile picture updated successfully")
        } catch (error: any) {
            setErrorMessage(error.message || "Failed to upload profile picture. Please try again.")
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

            {/* Sun/horizon glow */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-fuchsia-600 to-transparent opacity-20" />

            <div className="bg-gradient-to-br from-gray-900 to-indigo-950 rounded-lg shadow-[0_0_15px_rgba(255,44,201,0.5)] border border-fuchsia-500/30 max-w-md w-full p-6 backdrop-blur-sm relative z-10">
                <div className="space-y-8 text-white">
                    <button onClick={() => user?.role === 'musician' ? router.push('/dashboard/musician') : router.push('/collection')}
                        className="p-2 rounded-full bg-indigo-950/70 border border-cyan-500/30 text-cyan-400 hover:bg-indigo-900/70 transition-colors">
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div className="text-center">
                        <div
                            className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-fuchsia-500 rounded-full mx-auto flex items-center justify-center mb-4 relative cursor-pointer overflow-hidden"
                            onMouseEnter={() => setIsHoveringAvatar(true)}
                            onMouseLeave={() => setIsHoveringAvatar(false)}
                            onClick={handleProfilePictureClick}
                        >
                            {user?.avatar ? (
                                <Avatar className="w-full h-full">
                                    <AvatarImage src={user.avatar} alt={user.username} className="object-cover" />
                                    <AvatarFallback className="bg-indigo-950">
                                        <User className="h-10 w-10 text-white" />
                                    </AvatarFallback>
                                </Avatar>
                            ) : (
                                <User className="h-10 w-10 text-white" />
                            )}

                            {/* Overlay on hover */}
                            {isHoveringAvatar && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                    <Camera className="h-8 w-8 text-white" />
                                </div>
                            )}

                            {/* Hidden file input */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/jpeg,image/png,image/gif"
                                onChange={handleProfilePictureChange}
                            />
                        </div>
                        <h2 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 tracking-wider">
                            EDIT PROFILE
                        </h2>
                        <p className="text-fuchsia-300">Edit your personal information</p>
                    </div>
                    {errorMessage && (
                        <div className="bg-red-900/30 border border-red-500/50 text-red-200 p-3 rounded text-sm mb-4">
                            {errorMessage}
                        </div>
                    )}

                    {/* Success message display */}
                    {successMessage && (
                        <div className="bg-green-900/30 border border-green-500/50 text-green-200 p-3 rounded text-sm mb-4">
                            {successMessage}
                        </div>
                    )}

                    {/* Profile Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-fuchsia-300 font-semibold">
                                DISPLAY NAME
                            </Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cyan-400" />
                                <Input
                                    id="username"
                                    name="username"
                                    type="text"
                                    value={profile.username}
                                    onChange={handleChange}
                                    className="bg-indigo-950/50 border-indigo-700/50 focus:border-cyan-400 text-white placeholder:text-indigo-400 pl-10"
                                    minLength={3}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-fuchsia-300 font-semibold">
                                EMAIL ADDRESS
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cyan-400" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={profile.email}
                                    disabled
                                    className="bg-indigo-950/50 border-indigo-700/50 text-white placeholder:text-indigo-400 pl-10 opacity-70"
                                />
                            </div>
                            <p className="text-xs text-cyan-200/70">Email cannot be changed</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone_number" className="text-fuchsia-300 font-semibold">
                                PHONE NUMBER
                            </Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cyan-400" />
                                <Input
                                    id="phone_number"
                                    name="phone_number"
                                    type="text"
                                    value={profile.phone_number}
                                    onChange={handleChange}
                                    className="bg-indigo-950/50 border-indigo-700/50 focus:border-cyan-400 text-white placeholder:text-indigo-400 pl-10"
                                    placeholder="+1234567890"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label htmlFor="password" className="text-fuchsia-300 font-semibold">
                                    PASSWORD
                                </Label>
                                <a href="/user/account/recovery" className="text-xs text-cyan-300 hover:text-cyan-200">
                                    Forgot Password?
                                </a>
                            </div>
                            <div className="relative">
                                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cyan-400" />
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={profile.password}
                                    onChange={handleChange}
                                    className="bg-indigo-950/50 border-indigo-700/50 focus:border-cyan-400 text-white placeholder:text-indigo-400 pl-10 pr-10"
                                    minLength={6}
                                    placeholder="••••••••"
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
                            <p className="text-xs text-cyan-200/70">Leave blank to keep current password</p>
                        </div>

                        <Button
                            type="submit"
                            disabled={saving}
                            className="w-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white font-bold tracking-wider py-5 shadow-[0_0_10px_rgba(232,121,249,0.5)] hover:shadow-[0_0_15px_rgba(232,121,249,0.7)] transition-all duration-300"
                        >
                            {saving ? (
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
                                    SAVING...
                                </div>
                            ) : saved ? (
                                <>
                                    SAVED <Check className="ml-2 h-5 w-5" />
                                </>
                            ) : (
                                <>
                                    SAVE PROFILE <Save className="ml-2 h-5 w-5" />
                                </>
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </div >
    )
}

