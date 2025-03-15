"use client"

import { BellIcon, HeartIcon, MusicIcon, PlayIcon, StarIcon, UserIcon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            artist: "Neon Pulse",
            avatar: "/placeholder.svg?height=40&width=40",
            action: "released a new track",
            title: "Midnight Synthwave",
            time: "2 hours ago",
            read: false,
            type: "new_release",
        },
        {
            id: 2,
            artist: "Cyber Dreamer",
            avatar: "/placeholder.svg?height=40&width=40",
            action: "posted a new remix",
            title: "Digital Horizon (Remix)",
            time: "Yesterday",
            read: false,
            type: "remix",
        },
        {
            id: 3,
            artist: "Quantum Beats",
            avatar: "/placeholder.svg?height=40&width=40",
            action: "is going live",
            title: "Creating beats in real-time",
            time: "Just now",
            read: false,
            type: "live",
        },
        {
            id: 4,
            artist: "Neon Pulse",
            avatar: "/placeholder.svg?height=40&width=40",
            action: "mentioned you",
            title: "Thanks for the support!",
            time: "3 days ago",
            read: true,
            type: "mention",
        },
        {
            id: 5,
            artist: "Retrowave Queen",
            avatar: "/placeholder.svg?height=40&width=40",
            action: "liked your comment",
            title: "on 'Neon Dreams'",
            time: "1 week ago",
            read: true,
            type: "like",
        },
        {
            id: 6,
            artist: "Future Funk",
            avatar: "/placeholder.svg?height=40&width=40",
            action: "is releasing an album",
            title: "Cybernetic Odyssey",
            time: "Coming in 2 days",
            read: false,
            type: "upcoming",
        },
    ])

    const markAsRead = (id: number) => {
        setNotifications(
            notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
        )
    }

    const markAllAsRead = () => {
        setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
    }

    const getIconForType = (type: string) => {
        switch (type) {
            case "new_release":
                return <MusicIcon className="h-5 w-5 text-[#ff00cc]" />
            case "remix":
                return <PlayIcon className="h-5 w-5 text-[#00ffff]" />
            case "live":
                return <BellIcon className="h-5 w-5 text-[#ff9900]" />
            case "mention":
                return <UserIcon className="h-5 w-5 text-[#3300ff]" />
            case "like":
                return <HeartIcon className="h-5 w-5 text-[#ff00cc]" />
            case "upcoming":
                return <StarIcon className="h-5 w-5 text-[#00ffff]" />
            default:
                return <BellIcon className="h-5 w-5 text-[#00ffff]" />
        }
    }

    return (
        <div className="relative min-h-screen flex flex-col overflow-hidden bg-[#0b0014]">
            {/* Grid background */}
            <div
                className="absolute inset-0 z-0 opacity-30"
                style={{
                    backgroundImage: `linear-gradient(#ff00cc 1px, transparent 1px), linear-gradient(90deg, #ff00cc 1px, transparent 1px)`,
                    backgroundSize: "40px 40px",
                    backgroundPosition: "-1px -1px",
                    perspective: "500px",
                    transform: "rotateX(60deg)",
                    transformOrigin: "center center",
                }}
            />

            {/* Sun/horizon effect */}
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#ff2975] via-[#ff9900] to-transparent opacity-20 z-0" />

            {/* Header */}
            <header className="relative z-10 flex items-center justify-between p-6 border-b border-purple-500/30">
                <div className="flex items-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#ff00cc] to-[#3300ff] shadow-[0_0_15px_rgba(255,0,204,0.7)]">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-white"
                        >
                            <path d="M9 18V5l12-2v13" />
                            <circle cx="6" cy="18" r="3" />
                            <circle cx="18" cy="16" r="3" />
                        </svg>
                    </div>
                    <h1
                        className="ml-4 text-2xl font-bold tracking-wider text-white"
                        style={{ textShadow: "0 0 10px #ff00cc, 0 0 20px #ff00cc" }}
                    >
                        Dreamster
                    </h1>
                </div>
                <div className="flex items-center space-x-4">
                    <button className="text-[#00ffff] hover:text-white transition-colors">
                        <UserIcon className="h-6 w-6" />
                    </button>
                    <div className="relative">
                        <BellIcon className="h-6 w-6 text-[#ff00cc]" />
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#ff9900] text-xs text-white">
                            {notifications.filter((n) => !n.read).length}
                        </span>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="relative z-10 flex-1 p-6 max-w-4xl mx-auto w-full">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold text-white" style={{ textShadow: "0 0 10px #00ffff, 0 0 20px #00ffff" }}>
                        Notifications
                    </h2>
                    <button
                        onClick={markAllAsRead}
                        className="px-4 py-2 rounded-md bg-black/50 border border-[#00ffff]/30 text-[#00ffff] hover:bg-black/70 hover:shadow-[0_0_10px_rgba(0,255,255,0.5)] transition-all"
                    >
                        Mark all as read
                    </button>
                </div>

                <div className="space-y-4">
                    {notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`relative p-4 rounded-xl backdrop-blur-sm ${notification.read ? "bg-black/30" : "bg-black/50"} border ${notification.read ? "border-purple-500/20" : "border-purple-500/50"} shadow-[0_0_10px_rgba(149,0,255,0.3)] transition-all hover:shadow-[0_0_15px_rgba(149,0,255,0.5)]`}
                        >
                            {!notification.read && (
                                <div className="absolute top-4 right-4 h-3 w-3 rounded-full bg-[#ff00cc] shadow-[0_0_10px_rgba(255,0,204,0.7)]"></div>
                            )}
                            <div className="flex items-start">
                                <div className="flex-shrink-0 mr-4">
                                    <div className="relative">
                                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#3300ff] to-[#ff00cc] flex items-center justify-center overflow-hidden">
                                            <img
                                                src={notification.avatar || "/placeholder.svg"}
                                                alt={notification.artist}
                                                className="h-11 w-11 rounded-full object-cover"
                                            />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-black/70 border border-[#00ffff]/30 flex items-center justify-center">
                                            {getIconForType(notification.type)}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center">
                                        <p className="font-bold text-[#ff00cc]" style={{ textShadow: "0 0 5px #ff00cc" }}>
                                            {notification.artist}
                                        </p>
                                        <p className="ml-2 text-[#00ffff]">{notification.action}</p>
                                    </div>
                                    <p className="text-white font-medium mt-1">{notification.title}</p>
                                    <div className="flex items-center justify-between mt-2">
                                        <p className="text-sm text-[#ff9900]">{notification.time}</p>
                                        {!notification.read && (
                                            <button
                                                onClick={() => markAsRead(notification.id)}
                                                className="text-xs text-[#00ffff] hover:text-white transition-colors"
                                            >
                                                Mark as read
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3 flex space-x-3">
                                {notification.type === "new_release" || notification.type === "remix" ? (
                                    <button className="flex items-center justify-center px-3 py-1 rounded-md bg-gradient-to-r from-[#ff00cc] to-[#3300ff] text-white text-sm shadow-[0_0_10px_rgba(255,0,204,0.3)] hover:shadow-[0_0_15px_rgba(255,0,204,0.5)] transition-all">
                                        <PlayIcon className="h-4 w-4 mr-1" /> Play
                                    </button>
                                ) : notification.type === "live" ? (
                                    <button className="flex items-center justify-center px-3 py-1 rounded-md bg-gradient-to-r from-[#ff9900] to-[#ff00cc] text-white text-sm shadow-[0_0_10px_rgba(255,153,0,0.3)] hover:shadow-[0_0_15px_rgba(255,153,0,0.5)] transition-all">
                                        <svg
                                            className="h-4 w-4 mr-1"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M23 7l-7 5 7 5V7z"></path>
                                            <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                                        </svg>{" "}
                                        Join
                                    </button>
                                ) : null}
                                <button className="flex items-center justify-center px-3 py-1 rounded-md bg-black/50 border border-[#00ffff]/30 text-[#00ffff] text-sm hover:bg-black/70 hover:shadow-[0_0_10px_rgba(0,255,255,0.3)] transition-all">
                                    View
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* Navigation */}
            <nav className="relative z-10 border-t border-purple-500/30 bg-black/30 backdrop-blur-sm p-4">
                <div className="max-w-4xl mx-auto flex items-center justify-around">
                    <Link href="/" className="flex flex-col items-center text-[#00ffff] hover:text-white transition-colors">
                        <svg
                            className="h-6 w-6"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                        <span className="text-xs mt-1">Home</span>
                    </Link>
                    <Link href="/collection" className="flex flex-col items-center text-[#00ffff] hover:text-white transition-colors">
                        <svg
                            className="h-6 w-6"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <span className="text-xs mt-1">Discover</span>
                    </Link>
                    <Link href="#" className="flex flex-col items-center text-[#ff00cc] hover:text-white transition-colors">
                        <BellIcon className="h-6 w-6" />
                        <span className="text-xs mt-1">Notifications</span>
                    </Link>
                    <Link href="/user/profile" className="flex flex-col items-center text-[#00ffff] hover:text-white transition-colors">
                        <UserIcon className="h-6 w-6" />
                        <span className="text-xs mt-1">Profile</span>
                    </Link>
                </div>
            </nav>

            {/* Decorative elements */}
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#ff00cc] via-[#00ffff] to-[#3300ff] z-10" />
            <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-gradient-to-r from-[#ff00cc] to-[#3300ff] blur-[50px] opacity-50" />
            <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-gradient-to-r from-[#00ffff] to-[#3300ff] blur-[60px] opacity-50" />
        </div>
    )
}

