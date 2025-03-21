"use client"

import { useState, useEffect } from "react"
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
    Loader2,
    AlertCircle,
} from "lucide-react"
import Image from "next/image"
import adminService, { AdminStats, UserDistribution } from "@/services/adminService"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Line } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'
import { CustomProgress } from "@/components/ui/custom-progress"

interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
    role: string;
    joined: string;
    lastActive: string;
    tracks?: number;
    followers?: number;
}

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function AdminDashboard() {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")
    const [filterRole, setFilterRole] = useState<string>("all")
    const [showFilters, setShowFilters] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalUsers, setTotalUsers] = useState(0)
    const [pageSize] = useState(10)

    // State for API data
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [statsLoading, setStatsLoading] = useState(true)
    const [distributionLoading, setDistributionLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [stats, setStats] = useState<AdminStats | null>(null)
    const [distribution, setDistribution] = useState<UserDistribution | null>(null)

    // State for delete confirmation
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [userToDelete, setUserToDelete] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    // Add this state at the top of your component with other state variables
    const [chartRoleFilter, setChartRoleFilter] = useState('all');

    // Fetch users when search, filter, or page changes
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true)
                const response = await adminService.getUsers(
                    currentPage,
                    pageSize,
                    searchQuery,
                    filterRole
                )
                setUsers(response.users)
                setTotalPages(response.totalPages)
                setTotalUsers(response.totalUsers)
            } catch (err) {
                console.error("Failed to fetch users:", err)
                // setError("Failed to load users. Please try again.")
                // ({
                //     title: "Error",
                //     description: "Failed to load users. Please try again.",
                //     variant: "destructive",
                // })
            } finally {
                setLoading(false)
            }
        }

        fetchUsers()
    }, [searchQuery, filterRole, currentPage, pageSize])

    // Fetch dashboard stats
    useEffect(() => {
        const fetchStats = async () => {
            try {
                setStatsLoading(true)
                const statsData = await adminService.getDashboardStats()
                setStats(statsData)
            } catch (err) {
                console.error("Failed to fetch stats:", err)
                // toast({
                //     title: "Error",
                //     description: "Failed to load dashboard statistics.",
                //     variant: "destructive",
                // })
            } finally {
                setStatsLoading(false)
            }
        }

        fetchStats()
    }, [])

    // Fetch user distribution
    useEffect(() => {
        const fetchDistribution = async () => {
            try {
                setDistributionLoading(true)
                const distributionData = await adminService.getUserDistribution()
                setDistribution(distributionData)
            } catch (err) {
                console.error("Failed to fetch user distribution:", err)
            } finally {
                setDistributionLoading(false)
            }
        }

        fetchDistribution()
    }, [])

    // Handle pagination
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
        }
    }

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1)
        }
    }

    // Handle user deletion
    const confirmDelete = (userId: string) => {
        setUserToDelete(userId)
        setDeleteDialogOpen(true)
    }

    const handleDeleteUser = async () => {
        if (!userToDelete) return

        try {
            setIsDeleting(true)
            await adminService.deleteUser(userToDelete)

            // Refresh user list
            const response = await adminService.getUsers(
                currentPage,
                pageSize,
                searchQuery,
                filterRole
            )
            setUsers(response.users)
            setTotalPages(response.totalPages)
            setTotalUsers(response.totalUsers)

            // Refresh stats
            const statsData = await adminService.getDashboardStats()
            setStats(statsData)

            // Refresh distribution
            const distributionData = await adminService.getUserDistribution()
            setDistribution(distributionData)

            // toast({
            //     title: "Success",
            //     description: "User deleted successfully.",
            // })
        } catch (err) {
            console.error("Failed to delete user:", err)
            // toast({
            //     title: "Error",
            //     description: "Failed to delete user. Please try again.",
            //     variant: "destructive",
            // })
        } finally {
            setIsDeleting(false)
            setDeleteDialogOpen(false)
            setUserToDelete(null)
        }
    }

    const handleViewUser = (userId: string) => {
        // router.push(`/dashboard/admin/users/${userId}`)
    }

    const handleEditUser = (userId: string) => {
        // router.push(`/dashboard/admin/users/${userId}/edit`)
    }

    const handleAddUser = () => {
        // router.push('/dashboard/admin/users/new')
    }

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

    const getLastSixMonths = () => {
        const months = [];
        const today = new Date();

        for (let i = 5; i >= 0; i--) {
            const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
            months.push(month.toLocaleString('en-US', { month: 'short' }));
        }

        return months;
    };

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
                        <button
                            onClick={handleAddUser}
                            className="px-6 py-2.5 rounded font-bold tracking-wider bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white shadow-[0_0_10px_rgba(232,121,249,0.5)] hover:shadow-[0_0_15px_rgba(232,121,249,0.7)] transition-all flex items-center justify-center gap-2 flex-1 sm:flex-initial"
                        >
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
                        {statsLoading ? (
                            <div className="flex items-center justify-center h-16">
                                <Loader2 className="h-6 w-6 text-cyan-400 animate-spin" />
                            </div>
                        ) : (
                            <>
                                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 mb-2">
                                    {stats?.total_users.count || "0"}
                                </div>
                                <div className="flex items-center text-emerald-400 text-sm">
                                    <ArrowUpRight className="h-3 w-3 mr-1" />
                                    <span>+{stats?.total_users.growth || 0}% from last month</span>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Active Users */}
                    <div className="bg-gradient-to-br from-gray-900 to-indigo-950 rounded-lg shadow-[0_0_15px_rgba(255,44,201,0.3)] border border-fuchsia-500/30 p-6 backdrop-blur-sm">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-cyan-300 font-medium">Active Musicians</span>
                            <div className="p-2 rounded-full bg-fuchsia-950/50 border border-fuchsia-500/30">
                                <CheckCircle className="h-5 w-5 text-fuchsia-400" />
                            </div>
                        </div>
                        {statsLoading ? (
                            <div className="flex items-center justify-center h-16">
                                <Loader2 className="h-6 w-6 text-fuchsia-400 animate-spin" />
                            </div>
                        ) : (
                            <>
                                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 mb-2">
                                    {stats?.musicians.active.count || "0"}
                                </div>
                                <div className="flex items-center text-emerald-400 text-sm">
                                    <ArrowUpRight className="h-3 w-3 mr-1" />
                                    <span>+{stats?.musicians.active.growth || 0}% from last month</span>
                                </div>
                            </>
                        )}
                    </div>

                    {/* New Signups */}
                    <div className="bg-gradient-to-br from-gray-900 to-indigo-950 rounded-lg shadow-[0_0_15px_rgba(255,44,201,0.3)] border border-fuchsia-500/30 p-6 backdrop-blur-sm">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-cyan-300 font-medium">New Fans</span>
                            <div className="p-2 rounded-full bg-amber-950/50 border border-amber-500/30">
                                <BarChart3 className="h-5 w-5 text-amber-400" />
                            </div>
                        </div>
                        {statsLoading ? (
                            <div className="flex items-center justify-center h-16">
                                <Loader2 className="h-6 w-6 text-amber-400 animate-spin" />
                            </div>
                        ) : (
                            <>
                                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 mb-2">
                                    {stats?.new_signups.count || "0"}
                                </div>
                                <div className="flex items-center text-emerald-400 text-sm">
                                    <ArrowUpRight className="h-3 w-3 mr-1" />
                                    <span>+{stats?.new_signups.growth || 0}% from last month</span>
                                </div>
                            </>
                        )}
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
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value)
                                        setCurrentPage(1) // Reset to first page on search
                                    }}
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
                                    onChange={(e) => {
                                        setFilterRole(e.target.value)
                                        setUsers(users && users.filter((user) => user.role === e.target.value))
                                        setCurrentPage(1)
                                    }}
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
                        {loading ? (
                            <div className="flex justify-center items-center py-12">
                                <Loader2 className="h-8 w-8 text-cyan-400 animate-spin mr-2" />
                                <span className="text-cyan-300">Loading users...</span>
                            </div>
                        ) : error ? (
                            <div className="flex justify-center items-center py-12 text-red-400">
                                <AlertCircle className="h-6 w-6 mr-2" />
                                <span>{error}</span>
                            </div>
                        ) : (
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
                                    {users.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="py-8 text-center text-cyan-300/70">
                                                No users found matching your criteria
                                            </td>
                                        </tr>
                                    ) : (
                                        users.map((user) => (
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
                                                <td className="py-4 px-4 text-cyan-100">
                                                    {user.joined ? new Date(user.joined).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "-"}
                                                </td>
                                                <td className="py-4 px-4 text-cyan-100">{user.lastActive ?? 'Active'}</td>
                                                <td className="py-4 px-4">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            className="p-1.5 rounded-md hover:bg-indigo-800/50 transition-colors text-cyan-300 hover:text-cyan-100"
                                                            title="View User"
                                                            onClick={() => handleViewUser(user.id)}
                                                        >
                                                            <Eye className="h-5 w-5" />
                                                        </button>
                                                        <button
                                                            className="p-1.5 rounded-md hover:bg-indigo-800/50 transition-colors text-fuchsia-400 hover:text-fuchsia-300"
                                                            title="Edit User"
                                                            onClick={() => handleEditUser(user.id)}
                                                        >
                                                            <Edit className="h-5 w-5" />
                                                        </button>
                                                        <button
                                                            className="p-1.5 rounded-md hover:bg-indigo-800/50 transition-colors text-red-400 hover:text-red-300"
                                                            title="Delete User"
                                                            onClick={() => confirmDelete(user.id)}
                                                        >
                                                            <Trash2 className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-between items-center mt-6">
                        <div className="text-sm text-cyan-300/70">
                            {!loading && (
                                <>
                                    Showing <span className="text-cyan-300">{users.length}</span> of{" "}
                                    <span className="text-cyan-300">{totalUsers}</span> users
                                </>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                className={`px-3 py-1.5 rounded text-sm font-medium ${currentPage === 1
                                    ? 'bg-indigo-950/30 border border-cyan-500/10 text-cyan-300/50 cursor-not-allowed'
                                    : 'bg-indigo-950/50 border border-cyan-500/30 text-cyan-300 hover:bg-indigo-900/50 transition-colors'
                                    }`}
                                onClick={handlePreviousPage}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            <button
                                className={`px-3 py-1.5 rounded text-sm font-medium ${currentPage === totalPages
                                    ? 'bg-indigo-950/30 border border-fuchsia-500/10 text-fuchsia-400/50 cursor-not-allowed'
                                    : 'bg-indigo-950/50 border border-fuchsia-500/30 text-fuchsia-400 hover:bg-indigo-900/50 transition-colors'
                                    }`}
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                            >
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
                            <div className="flex items-center gap-3">
                                <select
                                    value={chartRoleFilter}
                                    onChange={(e) => setChartRoleFilter(e.target.value)}
                                    className="bg-indigo-950/50 border border-cyan-500/30 rounded-md py-1.5 px-3 text-sm text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                                >
                                    <option value="all">All Roles</option>
                                    <option value="musicians">Musicians Only</option>
                                    <option value="fans">Fans Only</option>
                                    <option value="admins">Admins Only</option>
                                </select>
                                <button className="flex items-center gap-1 text-sm text-cyan-300 hover:text-cyan-100 transition-colors">
                                    Last 6 Months <ChevronDown className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* Placeholder for chart */}
                        {statsLoading ? (
                            <div className="flex items-center justify-center h-64">
                                <Loader2 className="h-8 w-8 text-cyan-400 animate-spin" />
                            </div>
                        ) : (
                            <div className="h-64">
                                <Line
                                    data={{
                                        labels: getLastSixMonths(),
                                        datasets: [
                                            ...(chartRoleFilter === 'all' || chartRoleFilter === 'musicians' ? [
                                                {
                                                    label: 'Musicians',
                                                    data: [
                                                        Math.floor((stats?.musicians.total.count ?? 0) * 0.65),
                                                        Math.floor((stats?.musicians.total.count ?? 0) * 0.7),
                                                        Math.floor((stats?.musicians.total.count ?? 0) * 0.8),
                                                        Math.floor((stats?.musicians.total.count ?? 0) * 0.85),
                                                        Math.floor((stats?.musicians.total.count ?? 0) * 0.9),
                                                        Math.floor(stats?.musicians.total.count ?? 0),
                                                    ],
                                                    borderColor: 'rgba(255, 44, 201, 1)',
                                                    backgroundColor: 'rgba(255, 44, 201, 0.2)',
                                                    tension: 0.4,
                                                    fill: true,
                                                }
                                            ] : []),
                                            ...(chartRoleFilter === 'all' || chartRoleFilter === 'fans' ? [
                                                {
                                                    label: 'Fans',
                                                    data: [
                                                        Math.floor((stats?.new_signups.count ?? 0) * 0.6),
                                                        Math.floor((stats?.new_signups.count ?? 0) * 0.7),
                                                        Math.floor((stats?.new_signups.count ?? 0) * 0.75),
                                                        Math.floor((stats?.new_signups.count ?? 0) * 0.85),
                                                        Math.floor((stats?.new_signups.count ?? 0) * 0.95),
                                                        Math.floor(stats?.new_signups.count ?? 0),
                                                    ],
                                                    borderColor: 'rgba(0, 204, 255, 1)',
                                                    backgroundColor: 'rgba(0, 204, 255, 0.2)',
                                                    tension: 0.4,
                                                    fill: true,
                                                }
                                            ] : []),
                                            ...(chartRoleFilter === 'all' || chartRoleFilter === 'admins' ? [
                                                {
                                                    label: 'Admins',
                                                    data: [
                                                        Math.floor((stats?.admins.count ?? 0) * 0.8),
                                                        Math.floor((stats?.admins.count ?? 0) * 0.85),
                                                        Math.floor((stats?.admins.count ?? 0) * 0.9),
                                                        Math.floor((stats?.admins.count ?? 0) * 0.95),
                                                        Math.floor((stats?.admins.count ?? 0) * 0.98),
                                                        Math.floor(stats?.admins.count ?? 0),
                                                    ],
                                                    borderColor: 'rgba(251, 191, 36, 1)',
                                                    backgroundColor: 'rgba(251, 191, 36, 0.2)',
                                                    tension: 0.4,
                                                    fill: true,
                                                }
                                            ] : []),
                                            ...(chartRoleFilter === 'all' ? [
                                                {
                                                    label: 'Total Users',
                                                    data: [
                                                        Math.floor((stats?.total_users.count ?? 0) * 0.7),
                                                        Math.floor((stats?.total_users.count ?? 0) * 0.75),
                                                        Math.floor((stats?.total_users.count ?? 0) * 0.8),
                                                        Math.floor((stats?.total_users.count ?? 0) * 0.85),
                                                        Math.floor((stats?.total_users.count ?? 0) * 0.95),
                                                        Math.floor(stats?.total_users.count ?? 0),
                                                    ],
                                                    borderColor: 'rgba(139, 92, 246, 1)',
                                                    backgroundColor: 'rgba(139, 92, 246, 0.2)',
                                                    tension: 0.4,
                                                    fill: true,
                                                    borderDash: [5, 5],
                                                }
                                            ] : []),
                                        ],
                                    }}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                                min: 0,
                                                // max: (stats?.total_users.count ?? 0) * 1.2 || 0,
                                                grid: {
                                                    color: 'rgba(75, 85, 99, 0.2)',
                                                },
                                                ticks: {
                                                    color: 'rgba(0, 204, 255, 0.7)',
                                                    precision: 1,
                                                    callback: function (tickValue: string | number) {
                                                        if (typeof tickValue === 'number' && tickValue % 1 === 0) {
                                                            return tickValue;
                                                        }
                                                    }
                                                },
                                            },
                                            x: {
                                                grid: {
                                                    color: 'rgba(75, 85, 99, 0.2)',
                                                },
                                                ticks: {
                                                    color: 'rgba(0, 204, 255, 0.7)',
                                                },
                                            },
                                        },
                                        plugins: {
                                            legend: {
                                                position: 'top',
                                                labels: {
                                                    color: 'rgba(0, 204, 255, 0.7)',
                                                    font: {
                                                        size: 12,
                                                    },
                                                },
                                            },
                                            tooltip: {
                                                backgroundColor: 'rgba(17, 24, 39, 0.8)',
                                                titleColor: 'rgba(0, 204, 255, 1)',
                                                bodyColor: 'rgba(255, 255, 255, 0.8)',
                                                borderColor: 'rgba(255, 44, 201, 0.3)',
                                                borderWidth: 1,
                                            },
                                        },
                                    }}
                                />
                            </div>
                        )}
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
                        {distributionLoading ? (
                            <div className="flex items-center justify-center h-16">
                                <Loader2 className="h-6 w-6 text-cyan-400 animate-spin" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {/* Musicians */}
                                <div className="bg-indigo-950/30 rounded-lg border border-indigo-800/30 p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-2">
                                            <Music className="h-5 w-5 text-fuchsia-400" />
                                            <span className="font-medium text-fuchsia-400">Musicians</span>
                                        </div>
                                        <span className="text-lg font-bold text-cyan-300">
                                            {distribution?.musicians.count.toLocaleString() || "0"}
                                        </span>
                                    </div>
                                    <div className="w-full h-2 bg-indigo-900/50 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-fuchsia-500 to-purple-600 rounded-full"
                                            style={{ width: `${distribution?.musicians.percentage}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between mt-1 text-xs text-cyan-300/70">
                                        <span>{distribution?.musicians.percentage}% of users</span>
                                        <span>+{distribution?.musicians.growth}% this month</span>
                                    </div>
                                </div>

                                {/* Fans */}
                                <div className="bg-indigo-950/30 rounded-lg border border-indigo-800/30 p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-2">
                                            <Headphones className="h-5 w-5 text-cyan-400" />
                                            <span className="font-medium text-cyan-400">Fans</span>
                                        </div>
                                        <span className="text-lg font-bold text-cyan-300">
                                            {distribution?.fans.count.toLocaleString() || "0"}
                                        </span>
                                    </div>
                                    <div className="w-full h-2 bg-indigo-900/50 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
                                            style={{ width: `${distribution?.fans.percentage}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between mt-1 text-xs text-cyan-300/70">
                                        <span>{distribution?.fans.percentage}% of users</span>
                                        <span>+{distribution?.fans.growth}% this month</span>
                                    </div>
                                </div>

                                {/* Admins */}
                                <div className="bg-indigo-950/30 rounded-lg border border-indigo-800/30 p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-2">
                                            <Shield className="h-5 w-5 text-amber-400" />
                                            <span className="font-medium text-amber-400">Admins</span>
                                        </div>
                                        <span className="text-lg font-bold text-cyan-300">
                                            {distribution?.admins.count.toLocaleString() || "0"}
                                        </span>
                                    </div>
                                    <div className="w-full h-2 bg-indigo-900/50 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-amber-500 to-orange-600 rounded-full"
                                            style={{ width: `${distribution?.admins.percentage}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between mt-1 text-xs text-cyan-300/70">
                                        <span>{distribution?.admins.percentage}% of users</span>
                                        <span>+{distribution?.admins.growth}% this month</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Delete User Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="bg-indigo-950 border border-fuchsia-500/30 text-cyan-100">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
                            Confirm Deletion
                        </DialogTitle>
                    </DialogHeader>
                    <p className="py-4">
                        Are you sure you want to delete this user? This action cannot be undone.
                    </p>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialogOpen(false)}
                            className="border-cyan-500/30 text-cyan-300 hover:text-cyan-100 hover:bg-indigo-900/50"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteUser}
                            disabled={isDeleting}
                            className="bg-red-500/80 hover:bg-red-500 text-white"
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete User"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}


