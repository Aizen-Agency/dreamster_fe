"use client"

import { MessageSquare, Music, Video, Headphones, Star, Gift, Zap, Shield } from "lucide-react"

export default function PerksShowcase() {
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

            <div className="max-w-6xl w-full mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 tracking-wider mb-4">
                        EXCLUSIVE MEMBER PERKS
                    </h1>
                    <p className="text-cyan-300 text-lg max-w-2xl mx-auto opacity-80">
                        Unlock premium benefits and elevate your music experience with our exclusive membership perks
                    </p>
                </div>

                {/* Main perks grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {/* Discord Access Perk */}
                    <div className="bg-gradient-to-br from-gray-900 to-indigo-950 rounded-lg shadow-[0_0_15px_rgba(255,44,201,0.4)] border border-fuchsia-500/30 p-6 backdrop-blur-sm hover:shadow-[0_0_20px_rgba(255,44,201,0.6)] transition-all duration-300 group">
                        <div className="flex flex-col items-center text-center">
                            <div className="p-4 rounded-full mb-5 bg-gradient-to-br from-indigo-500 to-purple-600 shadow-[0_0_10px_rgba(99,102,241,0.7)] group-hover:shadow-[0_0_15px_rgba(99,102,241,0.9)] transition-all duration-300">
                                <MessageSquare className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-fuchsia-400 mb-3">Discord Community Access</h3>
                            <p className="text-cyan-100/80 mb-5">
                                Join our exclusive Discord server where you can connect directly with artists, participate in private
                                listening sessions, and engage with a community of passionate music lovers.
                            </p>
                            <div className="flex flex-wrap gap-2 justify-center">
                                <span className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-900/50 text-cyan-300 border border-cyan-500/30">
                                    Private Channels
                                </span>
                                <span className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-900/50 text-cyan-300 border border-cyan-500/30">
                                    Artist AMAs
                                </span>
                                <span className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-900/50 text-cyan-300 border border-cyan-500/30">
                                    Community Events
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Exclusive Tracks Perk */}
                    <div className="bg-gradient-to-br from-gray-900 to-indigo-950 rounded-lg shadow-[0_0_15px_rgba(255,44,201,0.4)] border border-fuchsia-500/30 p-6 backdrop-blur-sm hover:shadow-[0_0_20px_rgba(255,44,201,0.6)] transition-all duration-300 group">
                        <div className="flex flex-col items-center text-center">
                            <div className="p-4 rounded-full mb-5 bg-gradient-to-br from-cyan-500 to-blue-600 shadow-[0_0_10px_rgba(34,211,238,0.7)] group-hover:shadow-[0_0_15px_rgba(34,211,238,0.9)] transition-all duration-300">
                                <Music className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-fuchsia-400 mb-3">Exclusive Tracks</h3>
                            <p className="text-cyan-100/80 mb-5">
                                Get access to unreleased tracks, demos, and limited edition releases from your favorite artists before
                                anyone else. New exclusive content added weekly.
                            </p>
                            <div className="flex flex-wrap gap-2 justify-center">
                                <span className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-900/50 text-cyan-300 border border-cyan-500/30">
                                    Pre-releases
                                </span>
                                <span className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-900/50 text-cyan-300 border border-cyan-500/30">
                                    Rare Remixes
                                </span>
                                <span className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-900/50 text-cyan-300 border border-cyan-500/30">
                                    B-Sides
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Extra Media Perk */}
                    <div className="bg-gradient-to-br from-gray-900 to-indigo-950 rounded-lg shadow-[0_0_15px_rgba(255,44,201,0.4)] border border-fuchsia-500/30 p-6 backdrop-blur-sm hover:shadow-[0_0_20px_rgba(255,44,201,0.6)] transition-all duration-300 group">
                        <div className="flex flex-col items-center text-center">
                            <div className="p-4 rounded-full mb-5 bg-gradient-to-br from-fuchsia-500 to-pink-600 shadow-[0_0_10px_rgba(232,121,249,0.7)] group-hover:shadow-[0_0_15px_rgba(232,121,249,0.9)] transition-all duration-300">
                                <Video className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-fuchsia-400 mb-3">Extra Media Content</h3>
                            <p className="text-cyan-100/80 mb-5">
                                Enjoy behind-the-scenes footage, music videos, studio sessions, and exclusive interviews with artists.
                                Experience the creative process firsthand.
                            </p>
                            <div className="flex flex-wrap gap-2 justify-center">
                                <span className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-900/50 text-cyan-300 border border-cyan-500/30">
                                    Behind the Scenes
                                </span>
                                <span className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-900/50 text-cyan-300 border border-cyan-500/30">
                                    Exclusive Interviews
                                </span>
                                <span className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-900/50 text-cyan-300 border border-cyan-500/30">
                                    Studio Sessions
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Early Access Perk */}
                    <div className="bg-gradient-to-br from-gray-900 to-indigo-950 rounded-lg shadow-[0_0_15px_rgba(255,44,201,0.4)] border border-fuchsia-500/30 p-6 backdrop-blur-sm hover:shadow-[0_0_20px_rgba(255,44,201,0.6)] transition-all duration-300 group">
                        <div className="flex flex-col items-center text-center">
                            <div className="p-4 rounded-full mb-5 bg-gradient-to-br from-amber-500 to-orange-600 shadow-[0_0_10px_rgba(251,191,36,0.7)] group-hover:shadow-[0_0_15px_rgba(251,191,36,0.9)] transition-all duration-300">
                                <Headphones className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-fuchsia-400 mb-3">Early Access</h3>
                            <p className="text-cyan-100/80 mb-5">
                                Be the first to access new platform features, upcoming releases, and special events. Members get
                                priority access to concert tickets and virtual events.
                            </p>
                            <div className="flex flex-wrap gap-2 justify-center">
                                <span className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-900/50 text-cyan-300 border border-cyan-500/30">
                                    Pre-sale Tickets
                                </span>
                                <span className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-900/50 text-cyan-300 border border-cyan-500/30">
                                    Beta Features
                                </span>
                                <span className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-900/50 text-cyan-300 border border-cyan-500/30">
                                    VIP Events
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Exclusive Merch Perk */}
                    <div className="bg-gradient-to-br from-gray-900 to-indigo-950 rounded-lg shadow-[0_0_15px_rgba(255,44,201,0.4)] border border-fuchsia-500/30 p-6 backdrop-blur-sm hover:shadow-[0_0_20px_rgba(255,44,201,0.6)] transition-all duration-300 group">
                        <div className="flex flex-col items-center text-center">
                            <div className="p-4 rounded-full mb-5 bg-gradient-to-br from-emerald-500 to-green-600 shadow-[0_0_10px_rgba(16,185,129,0.7)] group-hover:shadow-[0_0_15px_rgba(16,185,129,0.9)] transition-all duration-300">
                                <Gift className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-fuchsia-400 mb-3">Exclusive Merchandise</h3>
                            <p className="text-cyan-100/80 mb-5">
                                Get access to limited edition merchandise, collectibles, and member-only items. Receive special
                                discounts on all merchandise in our store.
                            </p>
                            <div className="flex flex-wrap gap-2 justify-center">
                                <span className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-900/50 text-cyan-300 border border-cyan-500/30">
                                    Limited Editions
                                </span>
                                <span className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-900/50 text-cyan-300 border border-cyan-500/30">
                                    Member Discounts
                                </span>
                                <span className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-900/50 text-cyan-300 border border-cyan-500/30">
                                    Collectibles
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Premium Support Perk */}
                    <div className="bg-gradient-to-br from-gray-900 to-indigo-950 rounded-lg shadow-[0_0_15px_rgba(255,44,201,0.4)] border border-fuchsia-500/30 p-6 backdrop-blur-sm hover:shadow-[0_0_20px_rgba(255,44,201,0.6)] transition-all duration-300 group">
                        <div className="flex flex-col items-center text-center">
                            <div className="p-4 rounded-full mb-5 bg-gradient-to-br from-purple-500 to-violet-600 shadow-[0_0_10px_rgba(139,92,246,0.7)] group-hover:shadow-[0_0_15px_rgba(139,92,246,0.9)] transition-all duration-300">
                                <Shield className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-fuchsia-400 mb-3">Premium Support</h3>
                            <p className="text-cyan-100/80 mb-5">
                                Enjoy dedicated customer support with priority response times. Get personalized recommendations and
                                assistance from our music experts.
                            </p>
                            <div className="flex flex-wrap gap-2 justify-center">
                                <span className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-900/50 text-cyan-300 border border-cyan-500/30">
                                    Priority Support
                                </span>
                                <span className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-900/50 text-cyan-300 border border-cyan-500/30">
                                    Personalized Recs
                                </span>
                                <span className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-900/50 text-cyan-300 border border-cyan-500/30">
                                    Expert Assistance
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Membership tiers */}
                <div className="bg-gradient-to-br from-gray-900 to-indigo-950 rounded-lg shadow-[0_0_15px_rgba(255,44,201,0.4)] border border-fuchsia-500/30 p-8 backdrop-blur-sm mb-12">
                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 tracking-wider mb-6 text-center">
                        MEMBERSHIP TIERS
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Basic Tier */}
                        <div className="border border-cyan-500/30 rounded-lg p-6 bg-indigo-950/50 hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all duration-300">
                            <div className="text-center mb-4">
                                <h3 className="text-xl font-bold text-cyan-400 mb-2">BASIC</h3>
                                <div className="text-3xl font-bold text-white mb-1">
                                    $9.99<span className="text-sm text-cyan-300/70">/month</span>
                                </div>
                                <p className="text-cyan-300/70 text-sm">Perfect for casual listeners</p>
                            </div>
                            <ul className="space-y-3 mb-6">
                                <li className="flex items-center text-cyan-100">
                                    <Star className="h-4 w-4 text-cyan-400 mr-2 flex-shrink-0" />
                                    <span>Discord community access</span>
                                </li>
                                <li className="flex items-center text-cyan-100">
                                    <Star className="h-4 w-4 text-cyan-400 mr-2 flex-shrink-0" />
                                    <span>5 exclusive tracks per month</span>
                                </li>
                                <li className="flex items-center text-cyan-100">
                                    <Star className="h-4 w-4 text-cyan-400 mr-2 flex-shrink-0" />
                                    <span>Basic media content</span>
                                </li>
                            </ul>
                            <button className="w-full py-2.5 rounded font-bold tracking-wider bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_10px_rgba(34,211,238,0.5)] hover:shadow-[0_0_15px_rgba(34,211,238,0.7)] transition-all">
                                GET STARTED
                            </button>
                        </div>

                        {/* Premium Tier */}
                        <div className="border-2 border-fuchsia-500/50 rounded-lg p-6 bg-indigo-950/50 relative shadow-[0_0_15px_rgba(232,121,249,0.5)] hover:shadow-[0_0_20px_rgba(232,121,249,0.7)] transition-all duration-300">
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white text-xs font-bold uppercase py-1 px-3 rounded-full">
                                Most Popular
                            </div>
                            <div className="text-center mb-4">
                                <h3 className="text-xl font-bold text-fuchsia-400 mb-2">PREMIUM</h3>
                                <div className="text-3xl font-bold text-white mb-1">
                                    $19.99<span className="text-sm text-cyan-300/70">/month</span>
                                </div>
                                <p className="text-cyan-300/70 text-sm">For dedicated music enthusiasts</p>
                            </div>
                            <ul className="space-y-3 mb-6">
                                <li className="flex items-center text-cyan-100">
                                    <Star className="h-4 w-4 text-fuchsia-400 mr-2 flex-shrink-0" />
                                    <span>All Basic tier perks</span>
                                </li>
                                <li className="flex items-center text-cyan-100">
                                    <Star className="h-4 w-4 text-fuchsia-400 mr-2 flex-shrink-0" />
                                    <span>Unlimited exclusive tracks</span>
                                </li>
                                <li className="flex items-center text-cyan-100">
                                    <Star className="h-4 w-4 text-fuchsia-400 mr-2 flex-shrink-0" />
                                    <span>Full media library access</span>
                                </li>
                                <li className="flex items-center text-cyan-100">
                                    <Star className="h-4 w-4 text-fuchsia-400 mr-2 flex-shrink-0" />
                                    <span>Early access to new features</span>
                                </li>
                                <li className="flex items-center text-cyan-100">
                                    <Star className="h-4 w-4 text-fuchsia-400 mr-2 flex-shrink-0" />
                                    <span>10% merchandise discount</span>
                                </li>
                            </ul>
                            <button className="w-full py-2.5 rounded font-bold tracking-wider bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white shadow-[0_0_10px_rgba(232,121,249,0.5)] hover:shadow-[0_0_15px_rgba(232,121,249,0.7)] transition-all">
                                UPGRADE NOW
                            </button>
                        </div>

                        {/* Ultimate Tier */}
                        <div className="border border-amber-500/30 rounded-lg p-6 bg-indigo-950/50 hover:shadow-[0_0_15px_rgba(251,191,36,0.5)] transition-all duration-300">
                            <div className="text-center mb-4">
                                <h3 className="text-xl font-bold text-amber-400 mb-2">ULTIMATE</h3>
                                <div className="text-3xl font-bold text-white mb-1">
                                    $39.99<span className="text-sm text-cyan-300/70">/month</span>
                                </div>
                                <p className="text-cyan-300/70 text-sm">The complete VIP experience</p>
                            </div>
                            <ul className="space-y-3 mb-6">
                                <li className="flex items-center text-cyan-100">
                                    <Star className="h-4 w-4 text-amber-400 mr-2 flex-shrink-0" />
                                    <span>All Premium tier perks</span>
                                </li>
                                <li className="flex items-center text-cyan-100">
                                    <Star className="h-4 w-4 text-amber-400 mr-2 flex-shrink-0" />
                                    <span>VIP Discord channels</span>
                                </li>
                                <li className="flex items-center text-cyan-100">
                                    <Star className="h-4 w-4 text-amber-400 mr-2 flex-shrink-0" />
                                    <span>Virtual meet & greets with artists</span>
                                </li>
                                <li className="flex items-center text-cyan-100">
                                    <Star className="h-4 w-4 text-amber-400 mr-2 flex-shrink-0" />
                                    <span>Exclusive NFT drops</span>
                                </li>
                                <li className="flex items-center text-cyan-100">
                                    <Star className="h-4 w-4 text-amber-400 mr-2 flex-shrink-0" />
                                    <span>25% merchandise discount</span>
                                </li>
                            </ul>
                            <button className="w-full py-2.5 rounded font-bold tracking-wider bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-[0_0_10px_rgba(251,191,36,0.5)] hover:shadow-[0_0_15px_rgba(251,191,36,0.7)] transition-all">
                                GO ULTIMATE
                            </button>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 tracking-wider mb-6">
                        READY TO ELEVATE YOUR MUSIC EXPERIENCE?
                    </h2>
                    <p className="text-cyan-300 text-lg max-w-2xl mx-auto mb-8 opacity-80">
                        Join thousands of music lovers who have already unlocked these exclusive perks
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="px-8 py-3 rounded font-bold tracking-wider bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white shadow-[0_0_10px_rgba(232,121,249,0.5)] hover:shadow-[0_0_15px_rgba(232,121,249,0.7)] transition-all flex items-center justify-center gap-2">
                            <Zap className="h-5 w-5" />
                            JOIN DREAMSTER NOW
                        </button>
                        <button className="px-8 py-3 rounded font-bold tracking-wider border border-cyan-400/50 text-cyan-300 hover:bg-cyan-950/30 transition-all">
                            LEARN MORE
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

