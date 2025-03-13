"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { User, Key, Phone, Mail, Save, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ProfilePage() {
    const [currentTime, setCurrentTime] = useState("")
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    // Profile form state
    const [profile, setProfile] = useState({
        name: "CYBER USER",
        email: "user@dreamster.io",
        phone: "555-123-4567",
        password: "••••••••••",
    })

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

        // Simulate saving
        setTimeout(() => {
            setSaving(false)
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
        }, 1500)
    }

    return (
        <div className="flex h-screen items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-fuchsia-900 text-pink-100 font-['VT323',_monospace]">
            {/* Background grid */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZGVmcz4KICA8cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgIDxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+CiAgPC9wYXR0ZXJuPgo8L2RlZnM+CjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiIC8+Cjwvc3ZnPg==')] opacity-20 pointer-events-none"></div>

            {/* Content */}
            <div className="relative flex flex-col w-full max-w-md mx-auto z-10 p-4">
                {/* Header */}
                <div className="p-4 bg-gradient-to-r from-pink-600/80 to-purple-600/80 border border-pink-500/30 rounded-lg shadow-[0_0_15px_rgba(236,72,153,0.5)] mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-cyan-400 p-[2px] shadow-[0_0_10px_rgba(236,72,153,0.5)] flex items-center justify-center">
                                <User className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold tracking-widest text-cyan-300">USER PROFILE</h1>
                                <p className="text-sm text-pink-300 flex items-center">
                                    <span className="w-2 h-2 bg-cyan-400 rounded-full mr-1 shadow-[0_0_5px_rgba(45,212,191,0.7)]"></span>
                                    EDIT YOUR INFORMATION
                                </p>
                            </div>
                        </div>
                        <Button variant="default" size="icon" className="rounded-full">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Profile Form */}
                <div className="bg-purple-900/30 backdrop-blur-sm border border-pink-500/30 rounded-lg p-6 mb-6 shadow-[0_0_15px_rgba(236,72,153,0.2)]">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label htmlFor="name" className="block text-sm text-pink-300">
                                DISPLAY NAME
                            </label>
                            <div className="relative">
                                <User className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-300" />
                                <Input
                                    id="name"
                                    name="name"
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

