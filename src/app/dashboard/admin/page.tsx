"use client"

import { useState } from "react"
import {
    Users,
    Search,
    Filter,
    ArrowUpRight,
    Shield,
    BarChart3,
    UserPlus,
    ChevronDown,
    Eye,
    Edit,
    Trash2,
    Music,
    Headphones,
    CheckCircle,
} from "lucide-react"
import Image from "next/image"

export default function AdminDashboard() {
    const [searchQuery, setSearchQuery] = useState("")
    const [filterRole, setFilterRole] = useState<string>("all")
    const [showFilters, setShowFilters] = useState(false)

    // Sample user data
    const users = [
        {
            id: "USR001",
            name: "Alex Johnson",
            email: "alex@example.com",
            avatar: "/placeholder.svg?height=40&width=40",
            role: "musician",
            joined: "Jun 15, 2023",
            lastActive: "2 hours ago",
            tracks: 12,
            followers: 1240,
        },
        {
            id: "USR002",
            name: "Samantha Lee",
            email: "samantha@example.com",
            avatar: "/placeholder.svg?height=40&width=40",
            role: "fan",
            joined: "Aug 22, 2023",
            lastActive: "5 days ago",
            tracks: 0,
            followers: 35,
        },
        {
            id: "USR003",
            name: "Michael Chen",
            email: "michael@example.com",
            avatar: "/placeholder.svg?height=40&width=40",
            role: "musician",
            joined: "Mar 10, 2023",
            lastActive: "30 days ago",
            tracks: 5,
            followers: 320,
        },
        {
            id: "USR004",
            name: "Jessica Williams",
            email: "jessica@example.com",
            avatar: "/placeholder.svg?height=40&width=40",
            role: "admin",
            joined: "Jan 05, 2023",
            lastActive: "Just now",
            tracks: 0,
            followers: 0,
        },
        {
            id: "USR005",
            name: "David Rodriguez",
            email: "david@example.com",
            avatar: "/placeholder.svg?height=40&width=40",
            role: "fan",
            joined: "Sep 30, 2023",
            lastActive: "2 months ago",
            tracks: 0,
            followers: 12,
        },
    ]

    // Filter users based on search query and filters
    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            searchQuery === "" ||
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.id.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesRole = filterRole === "all" || user.role === filterRole

        return matchesSearch && matchesRole
    })

    const getRoleIcon = (role: string) => {
        switch (role) {
            case "admin":
                return <Shield className="h-4 w-4 text-amber-400" />
            case "musician":
                return <Music className="h-4 w-4 text-fuchsia-400" />
            case "fan":
                return <Headphones className="h-4 w-4 text-cyan-400" />
            default:
                return <Users className="h-4 w-4 text-gray-400" />
        }
    }

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
                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-cyan-400 to-fuchsia-500 p-0.5 shadow-[0_0_15px_rgba(255,44,201,0.5)]">
                            <div className="h-full w-full rounded-full overflow-hidden bg-indigo-950 flex items-center justify-center">
                                <Shield className="h-8 w-8 text-cyan-400" />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 tracking-wider">
                                ADMIN DASHBOARD
                            </h1>
                            <p className="text-cyan-300 opacity-80">Welcome back, Admin</p>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <button className="px-6 py-2.5 rounded font-bold tracking-wider bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white shadow-[0_0_10px_rgba(232,121,249,0.5)] hover:shadow-[0_0_15px_rgba(232,121,249,0.7)] transition-all flex items-center justify-center gap-2 flex-1 sm:flex-initial">
                            <UserPlus className="h-4 w-4" />
                            ADD NEW USER
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Total Users */}
                    <div className="bg-gradient-to-br from-gray-900 to-indigo-950 rounded-lg shadow-[0_0_15px_rgba(255,44,201,0.3)] border border-fuchsia-500/30 p-6 backdrop-blur-sm">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-cyan-300 font-medium">Total Users</span>
                            <div className="p-2 rounded-full bg-cyan-950/50 border border-cyan-500/30">
                                <Users className="h-5 w-5 text-cyan-400" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 mb-2">
                            5,234
                        </div>
                        <div className="flex items-center text-emerald-400 text-sm">
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                            <span>+12.5% from last month</span>
                        </div>
                    </div>

                    {/* Active Users */}
                    <div className="bg-gradient-to-br from-gray-900 to-indigo-950 rounded-lg shadow-[0_0_15px_rgba(255,44,201,0.3)] border border-fuchsia-500/30 p-6 backdrop-blur-sm">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-cyan-300 font-medium">Active Users</span>
                            <div className="p-2 rounded-full bg-fuchsia-950/50 border border-fuchsia-500/30">
                                <CheckCircle className="h-5 w-5 text-fuchsia-400" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 mb-2">
                            4,182
                        </div>
                        <div className="flex items-center text-emerald-400 text-sm">
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                            <span>+8.3% from last month</span>
                        </div>
                    </div>

                    {/* New Signups */}
                    <div className="bg-gradient-to-br from-gray-900 to-indigo-950 rounded-lg shadow-[0_0_15px_rgba(255,44,201,0.3)] border border-fuchsia-500/30 p-6 backdrop-blur-sm">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-cyan-300 font-medium">New Signups</span>
                            <div className="p-2 rounded-full bg-amber-950/50 border border-amber-500/30">
                                <BarChart3 className="h-5 w-5 text-amber-400" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 mb-2">
                            342
                        </div>
                        <div className="flex items-center text-emerald-400 text-sm">
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                            <span>+18.2% from last month</span>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-gradient-to-br from-gray-900 to-indigo-950 rounded-lg shadow-[0_0_15px_rgba(255,44,201,0.3)] border border-fuchsia-500/30 p-6 backdrop-blur-sm">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
                            USER MANAGEMENT
                        </h2>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cyan-300/50" />
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-indigo-950/50 border border-cyan-500/30 rounded-md py-2 pl-10 pr-4 text-cyan-100 placeholder-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                                />
                            </div>
                            <button
                                className="p-2 bg-indigo-950/50 border border-fuchsia-500/30 rounded-md text-fuchsia-400 hover:bg-indigo-900/50 transition-colors"
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <Filter className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Filters */}
                    {showFilters && (
                        <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 mb-6 p-4 bg-indigo-950/30 rounded-lg border border-indigo-800/50">
                            <div>
                                <label className="block text-sm text-cyan-300 mb-2">Filter by Role</label>
                                <select
                                    value={filterRole}
                                    onChange={(e) => setFilterRole(e.target.value)}
                                    className="w-full bg-indigo-950/50 border border-cyan-500/30 rounded-md py-2 px-3 text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                                >
                                    <option value="all">All Roles</option>
                                    <option value="admin">Admin</option>
                                    <option value="musician">Musician</option>
                                    <option value="fan">Fan</option>
                                </select>
                            </div>
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px]">
                            <thead>
                                <tr className="border-b border-indigo-800/50">
                                    <th className="py-3 px-4 text-left text-cyan-300 font-medium">User</th>
                                    <th className="py-3 px-4 text-left text-cyan-300 font-medium">Role</th>
                                    <th className="py-3 px-4 text-left text-cyan-300 font-medium">Joined</th>
                                    <th className="py-3 px-4 text-left text-cyan-300 font-medium">Last Active</th>
                                    <th className="py-3 px-4 text-right text-cyan-300 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="border-b border-indigo-800/30 hover:bg-indigo-900/20 transition-colors">
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-500 to-fuchsia-500 p-0.5 shadow-[0_0_10px_rgba(255,44,201,0.3)]">
                                                    <div className="h-full w-full rounded-full overflow-hidden">
                                                        <Image
                                                            src={user?.avatar || "/placeholder.svg"}
                                                            alt={user.name}
                                                            width={40}
                                                            height={40}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-medium text-fuchsia-400">{user.name}</div>
                                                    <div className="text-xs text-cyan-300/70">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-1.5">
                                                {getRoleIcon(user.role)}
                                                <span className="text-cyan-100 capitalize">{user.role}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-cyan-100">{user.joined}</td>
                                        <td className="py-4 px-4 text-cyan-100">{user.lastActive}</td>
                                        <td className="py-4 px-4">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    className="p-1.5 rounded-md hover:bg-indigo-800/50 transition-colors text-cyan-300 hover:text-cyan-100"
                                                    title="View User"
                                                >
                                                    <Eye className="h-5 w-5" />
                                                </button>
                                                <button
                                                    className="p-1.5 rounded-md hover:bg-indigo-800/50 transition-colors text-fuchsia-400 hover:text-fuchsia-300"
                                                    title="Edit User"
                                                >
                                                    <Edit className="h-5 w-5" />
                                                </button>
                                                <button
                                                    className="p-1.5 rounded-md hover:bg-indigo-800/50 transition-colors text-red-400 hover:text-red-300"
                                                    title="Delete User"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-between items-center mt-6">
                        <div className="text-sm text-cyan-300/70">
                            Showing <span className="text-cyan-300">{filteredUsers.length}</span> of{" "}
                            <span className="text-cyan-300">{users.length}</span> users
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

                {/* User Analytics Section */}
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* User Growth Chart */}
                    <div className="bg-gradient-to-br from-gray-900 to-indigo-950 rounded-lg shadow-[0_0_15px_rgba(255,44,201,0.3)] border border-fuchsia-500/30 p-6 backdrop-blur-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
                                USER GROWTH
                            </h3>
                            <button className="flex items-center gap-1 text-sm text-cyan-300 hover:text-cyan-100 transition-colors">
                                Last 6 Months <ChevronDown className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Placeholder for chart */}
                        <div className="h-64 bg-indigo-950/30 rounded-lg border border-indigo-800/30 flex items-center justify-center">
                            <div className="text-center">
                                <BarChart3 className="h-12 w-12 text-cyan-400 mx-auto mb-2 opacity-50" />
                                <p className="text-cyan-300">User Growth Chart</p>
                            </div>
                        </div>
                    </div>

                    {/* User Distribution */}
                    <div className="bg-gradient-to-br from-gray-900 to-indigo-950 rounded-lg shadow-[0_0_15px_rgba(255,44,201,0.3)] border border-fuchsia-500/30 p-6 backdrop-blur-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
                                USER DISTRIBUTION
                            </h3>
                            <button className="flex items-center gap-1 text-sm text-cyan-300 hover:text-cyan-100 transition-colors">
                                By Role <ChevronDown className="h-4 w-4" />
                            </button>
                        </div>

                        {/* User distribution stats */}
                        <div className="grid grid-cols-1 gap-4">
                            {/* Musicians */}
                            <div className="bg-indigo-950/30 rounded-lg border border-indigo-800/30 p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-2">
                                        <Music className="h-5 w-5 text-fuchsia-400" />
                                        <span className="font-medium text-fuchsia-400">Musicians</span>
                                    </div>
                                    <span className="text-lg font-bold text-cyan-300">2,450</span>
                                </div>
                                <div className="w-full h-2 bg-indigo-900/50 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-fuchsia-500 to-purple-600 rounded-full"
                                        style={{ width: "47%" }}
                                    ></div>
                                </div>
                                <div className="flex justify-between mt-1 text-xs text-cyan-300/70">
                                    <span>47% of users</span>
                                    <span>+12% this month</span>
                                </div>
                            </div>

                            {/* Fans */}
                            <div className="bg-indigo-950/30 rounded-lg border border-indigo-800/30 p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-2">
                                        <Headphones className="h-5 w-5 text-cyan-400" />
                                        <span className="font-medium text-cyan-400">Fans</span>
                                    </div>
                                    <span className="text-lg font-bold text-cyan-300">2,734</span>
                                </div>
                                <div className="w-full h-2 bg-indigo-900/50 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
                                        style={{ width: "52%" }}
                                    ></div>
                                </div>
                                <div className="flex justify-between mt-1 text-xs text-cyan-300/70">
                                    <span>52% of users</span>
                                    <span>+18% this month</span>
                                </div>
                            </div>

                            {/* Admins */}
                            <div className="bg-indigo-950/30 rounded-lg border border-indigo-800/30 p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-2">
                                        <Shield className="h-5 w-5 text-amber-400" />
                                        <span className="font-medium text-amber-400">Admins</span>
                                    </div>
                                    <span className="text-lg font-bold text-cyan-300">50</span>
                                </div>
                                <div className="w-full h-2 bg-indigo-900/50 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-amber-500 to-orange-600 rounded-full"
                                        style={{ width: "1%" }}
                                    ></div>
                                </div>
                                <div className="flex justify-between mt-1 text-xs text-cyan-300/70">
                                    <span>1% of users</span>
                                    <span>No change</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

