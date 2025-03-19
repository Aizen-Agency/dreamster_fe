"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Music, Plus, Info, ChevronDown, MessageSquare, FileMusic, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter, useParams } from "next/navigation"
import { useGetTrack } from "@/hooks/useTrackManagement"
import { usePerksManagement } from "@/hooks/usePerksManagement"
import { Perk as APIPerk } from "@/services/perksService"

interface Perk {
    id: string
    type: string
    enabled: boolean
    title: string
    description: string
    icon: React.ReactNode
    apiId?: string // To link with API perks
}

export default function PerksPage({
    onNext,
    onBack,
}: {
    onNext?: () => void
    onBack?: () => void
}) {
    const router = useRouter()
    const params = useParams()
    const trackId = params.trackId as string
    const [error, setError] = useState<string | null>(null)

    // Fetch track details
    const { data: trackData, isLoading: isTrackLoading, isError: isTrackError } = useGetTrack(trackId)

    // Get perks management hooks
    const {
        perks: apiPerks,
        isLoading: isPerksLoading,
        isError: isPerksError,
        createPerk,
        updatePerk,
        deletePerk,
        togglePerkStatus,
        isPending
    } = usePerksManagement(trackId)

    // Default perks with UI configuration
    const [perks, setPerks] = useState<Perk[]>([
        {
            id: "exclusive-track",
            type: "Exclusive Track",
            enabled: false,
            title: "Exclusive Bonus Track",
            description: "Get access to an unreleased bonus track",
            icon: <FileMusic className="h-5 w-5 text-[#00ccff]" />,
        },
        {
            id: "stems",
            type: "Downloadable Stems",
            enabled: false,
            title: "Downloadable Stems",
            description: "Download individual track stems for remixing",
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="#ff66cc" strokeWidth="2" />
                    <path d="M7 12L12 17L17 12" stroke="#ff66cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 7V17" stroke="#ff66cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
        },
        {
            id: "discord",
            type: "Discord Access",
            enabled: false,
            title: "Discord Access",
            description: "Join our private Discord community",
            icon: <MessageSquare className="h-5 w-5 text-[#00ccff]" />,
        },
    ])

    // Custom perks (added by user)
    const [customPerks, setCustomPerks] = useState<Perk[]>([])

    // Sync API perks with local state when data is loaded
    useEffect(() => {
        if (apiPerks) {
            // Map API perks to our UI perks
            const updatedPerks = [...perks];
            const newCustomPerks: Perk[] = [];

            apiPerks.forEach((apiPerk: APIPerk) => {
                // Try to match with predefined perks
                const matchingPerkIndex = updatedPerks.findIndex(p =>
                    p.title.toLowerCase() === apiPerk.title.toLowerCase() ||
                    p.apiId === apiPerk.id
                );

                if (matchingPerkIndex >= 0) {
                    // Update existing perk
                    updatedPerks[matchingPerkIndex] = {
                        ...updatedPerks[matchingPerkIndex],
                        enabled: apiPerk.active,
                        title: apiPerk.title,
                        description: apiPerk.description,
                        apiId: apiPerk.id
                    };
                } else {
                    // Add as custom perk
                    newCustomPerks.push({
                        id: `custom-${apiPerk.id}`,
                        type: "Custom Perk",
                        enabled: apiPerk.active,
                        title: apiPerk.title,
                        description: apiPerk.description,
                        icon: <Info className="h-5 w-5 text-[#00ccff]" />,
                        apiId: apiPerk.id
                    });
                }
            });

            setPerks(updatedPerks);
            setCustomPerks(newCustomPerks);
        }
    }, [apiPerks]);

    const togglePerk = async (id: string) => {
        const allPerks = [...perks, ...customPerks];
        const perk = allPerks.find(p => p.id === id);

        if (!perk) return;

        try {
            if (perk.apiId) {
                // If perk exists in API, toggle its status
                await togglePerkStatus(perk.apiId);
            } else {
                // If perk doesn't exist in API yet, create it
                const newApiPerk = await createPerk({
                    title: perk.title,
                    description: perk.description,
                    active: true
                });

                // Update local state with the new API ID
                if (perks.find(p => p.id === id)) {
                    setPerks(perks.map(p =>
                        p.id === id ? { ...p, enabled: true, apiId: newApiPerk.id } : p
                    ));
                } else {
                    setCustomPerks(customPerks.map(p =>
                        p.id === id ? { ...p, enabled: true, apiId: newApiPerk.id } : p
                    ));
                }
                return;
            }

            // Update local state
            if (perks.find(p => p.id === id)) {
                setPerks(perks.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p));
            } else {
                setCustomPerks(customPerks.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p));
            }
        } catch (err) {
            console.error("Error toggling perk:", err);
            setError("Failed to update perk status. Please try again.");
        }
    }

    const updatePerkTitle = async (id: string, title: string) => {
        const allPerks = [...perks, ...customPerks];
        const perk = allPerks.find(p => p.id === id);

        if (!perk) return;

        // Update local state first for responsive UI
        if (perks.find(p => p.id === id)) {
            setPerks(perks.map(p => p.id === id ? { ...p, title } : p));
        } else {
            setCustomPerks(customPerks.map(p => p.id === id ? { ...p, title } : p));
        }

        // If perk exists in API, update it
        if (perk.apiId) {
            try {
                await updatePerk({
                    perkId: perk.apiId,
                    title
                });
            } catch (err) {
                console.error("Error updating perk title:", err);
                setError("Failed to update perk title. Please try again.");
            }
        }
    }

    const updatePerkDescription = async (id: string, description: string) => {
        const allPerks = [...perks, ...customPerks];
        const perk = allPerks.find(p => p.id === id);

        if (!perk) return;

        // Update local state first for responsive UI
        if (perks.find(p => p.id === id)) {
            setPerks(perks.map(p => p.id === id ? { ...p, description } : p));
        } else {
            setCustomPerks(customPerks.map(p => p.id === id ? { ...p, description } : p));
        }

        // If perk exists in API, update it
        if (perk.apiId) {
            try {
                await updatePerk({
                    perkId: perk.apiId,
                    description
                });
            } catch (err) {
                console.error("Error updating perk description:", err);
                setError("Failed to update perk description. Please try again.");
            }
        }
    }

    const addCustomPerk = () => {
        const newId = `custom-${Date.now()}`;
        const newPerk: Perk = {
            id: newId,
            type: "Custom Perk",
            enabled: false,
            title: "New Custom Perk",
            description: "Describe your custom perk here",
            icon: <Info className="h-5 w-5 text-[#00ccff]" />
        };

        setCustomPerks([...customPerks, newPerk]);
    }

    const removeCustomPerk = async (id: string) => {
        const perk = customPerks.find(p => p.id === id);

        if (!perk) return;

        // If perk exists in API, delete it
        if (perk.apiId) {
            try {
                await deletePerk(perk.apiId);
            } catch (err) {
                console.error("Error deleting perk:", err);
                setError("Failed to delete perk. Please try again.");
                return;
            }
        }

        // Remove from local state
        setCustomPerks(customPerks.filter(p => p.id !== id));
    }

    const enabledPerks = [...perks.filter(perk => perk.enabled), ...customPerks.filter(perk => perk.enabled)];

    const handleBack = () => {
        if (onBack) {
            onBack()
        } else {
            router.push(`/user/musician/upload/pricing/${trackId}`)
        }
    }

    const handleFinalize = async () => {
        if (!trackId) {
            setError("No track ID found. Please go back and upload a track first.")
            return
        }

        try {
            // Ensure all enabled perks are saved to the API
            for (const perk of enabledPerks) {
                if (!perk.apiId) {
                    // Create perk if it doesn't exist in API
                    await createPerk({
                        title: perk.title,
                        description: perk.description,
                        active: true
                    });
                }
            }

            // Navigate to next step
            if (onNext) {
                onNext()
            } else {
                router.push(`/user/musician/profile`)
            }
        } catch (err) {
            console.error("Error finalizing perks:", err)
            setError("Failed to save perks. Please try again.")
        }
    }

    // Show loading state while fetching data
    const isLoading = isTrackLoading || isPerksLoading;
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-pink-500 flex items-center justify-center">
                <div className="text-white">Loading data...</div>
            </div>
        )
    }

    // Show error state if data fetch fails
    const isError = isTrackError || isPerksError;
    if (isError) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-pink-500 flex items-center justify-center">
                <div className="text-white bg-red-900/50 border border-red-500 p-4 rounded-md">
                    Error loading data. Please try again or go back to upload a new track.
                    <div className="mt-4">
                        <Button onClick={() => router.push("/user/musician/upload")}>
                            Back to Upload
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    // Render the main UI
    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-pink-500 p-4 md:p-8 relative overflow-hidden">
            {/* Background grid - lowered z-index */}
            <div
                className="fixed inset-0 opacity-20 z-0"
                style={{
                    backgroundImage: `linear-gradient(#ff2cc9 1px, transparent 1px), linear-gradient(90deg, #ff2cc9 1px, transparent 1px)`,
                    backgroundSize: "40px 40px",
                    backgroundPosition: "-1px -1px",
                    perspective: "500px",
                    transform: "rotateX(60deg)",
                    transformOrigin: "center top",
                }}
            />

            {/* Header */}
            <header className="w-full py-3 px-6 flex justify-between items-center relative z-10">
                <div className="flex items-center gap-2">
                    <Music className="h-6 w-6 text-[#ff66cc]" />
                    <span className="text-[#ff66cc] font-bold text-xl">Dreamster</span>
                </div>
                <Button
                    variant="outline"
                    className="bg-transparent border-[#00ccff] text-[#00ccff] hover:bg-[#00ccff]/10 rounded-full"
                >
                    Create Music
                </Button>
            </header>

            {/* Main Content */}
            <main className="flex-1 container mx-auto py-8 px-4 relative z-10">
                {/* Steps */}
                <div className="flex justify-center mb-8 gap-16">
                    <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-[#ff66cc] flex items-center justify-center text-white mb-2">
                            1
                        </div>
                        <span className="text-white">Upload</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-[#ff66cc] flex items-center justify-center text-white mb-2">
                            2
                        </div>
                        <span className="text-white">Pricing</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-[#ff66cc] flex items-center justify-center text-white mb-2">
                            3
                        </div>
                        <span className="text-white">Perks</span>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-900/50 border border-red-500 text-white rounded-md">
                        {error}
                    </div>
                )}

                {/* Title */}
                <div className="text-center mb-8">
                    <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff66cc] to-[#00ccff] text-2xl md:text-3xl font-light mb-2">Add Exclusive Perks</h1>
                    <p className="text-gray-300">Offer special benefits to your NFT collectors to increase value</p>
                </div>

                {/* Perks Configuration and Preview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Collector Perks */}
                    <div className="bg-[#2a0052] border-2 border-[#ff66cc] p-6 relative z-20">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-[#00ccff] text-xl">Collector Perks</h2>
                            <Info className="h-5 w-5 text-[#00ccff]" />
                        </div>

                        {/* Predefined Perks */}
                        {perks.map(perk => (
                            <div key={perk.id} className="mb-6 border border-[#3a0062] rounded-lg overflow-hidden">
                                <div className="flex justify-between items-center p-4 bg-[#1a0033]">
                                    <div className="flex items-center gap-2">
                                        {perk.icon}
                                        <span className="text-white">{perk.type}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            checked={perk.enabled}
                                            onCheckedChange={() => togglePerk(perk.id)}
                                            className="data-[state=checked]:bg-[#00ccff]"
                                            disabled={isPending}
                                        />
                                        <ChevronDown className="h-5 w-5 text-white" />
                                    </div>
                                </div>

                                {perk.enabled && (
                                    <div className="p-4">
                                        <Input
                                            value={perk.title}
                                            onChange={(e) => updatePerkTitle(perk.id, e.target.value)}
                                            className="bg-[#1a0033] border-[#3a0062] text-white mb-3"
                                            placeholder={`${perk.type} Title`}
                                            disabled={isPending}
                                        />
                                        <Textarea
                                            value={perk.description}
                                            onChange={(e) => updatePerkDescription(perk.id, e.target.value)}
                                            className="bg-[#1a0033] border-[#3a0062] text-white h-20"
                                            placeholder={`Describe your ${perk.type.toLowerCase()}`}
                                            disabled={isPending}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Custom Perks */}
                        {customPerks.map(perk => (
                            <div key={perk.id} className="mb-6 border border-[#3a0062] rounded-lg overflow-hidden">
                                <div className="flex justify-between items-center p-4 bg-[#1a0033]">
                                    <div className="flex items-center gap-2">
                                        {perk.icon}
                                        <span className="text-white">{perk.type}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            checked={perk.enabled}
                                            onCheckedChange={() => togglePerk(perk.id)}
                                            className="data-[state=checked]:bg-[#00ccff]"
                                            disabled={isPending}
                                        />
                                        <Trash2
                                            className="h-5 w-5 text-red-400 cursor-pointer hover:text-red-300"
                                            onClick={() => removeCustomPerk(perk.id)}
                                        />
                                    </div>
                                </div>

                                {perk.enabled && (
                                    <div className="p-4">
                                        <Input
                                            value={perk.title}
                                            onChange={(e) => updatePerkTitle(perk.id, e.target.value)}
                                            className="bg-[#1a0033] border-[#3a0062] text-white mb-3"
                                            placeholder="Custom Perk Title"
                                            disabled={isPending}
                                        />
                                        <Textarea
                                            value={perk.description}
                                            onChange={(e) => updatePerkDescription(perk.id, e.target.value)}
                                            className="bg-[#1a0033] border-[#3a0062] text-white h-20"
                                            placeholder="Describe your custom perk"
                                            disabled={isPending}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Add Another Perk Button */}
                        <Button
                            className="w-full bg-gradient-to-r from-[#ff66cc] to-[#00ccff] text-white hover:opacity-90 mb-6"
                            onClick={addCustomPerk}
                            disabled={isPending}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Another Perk
                        </Button>

                        {/* Tier-Based Access */}
                        <div className="mb-6">
                            <h3 className="text-[#00ccff] text-lg mb-4">Tier-Based Access</h3>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Checkbox
                                        id="common-tier"
                                        className="border-[#00ccff] data-[state=checked]:bg-[#00ccff] data-[state=checked]:text-[#2a0052] mt-1"
                                    />
                                    <div>
                                        <label htmlFor="common-tier" className="text-white font-medium block">
                                            Common Tier (1-10 tokens)
                                        </label>
                                        <p className="text-gray-400 text-sm">Basic perks for all collectors</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Checkbox
                                        id="rare-tier"
                                        className="border-[#00ccff] data-[state=checked]:bg-[#00ccff] data-[state=checked]:text-[#2a0052] mt-1"
                                    />
                                    <div>
                                        <label htmlFor="rare-tier" className="text-white font-medium block">
                                            Rare Tier (11-50 tokens)
                                        </label>
                                        <p className="text-gray-400 text-sm">Enhanced perks for early collectors</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Checkbox
                                        id="legendary-tier"
                                        className="border-[#00ccff] data-[state=checked]:bg-[#00ccff] data-[state=checked]:text-[#2a0052] mt-1"
                                    />
                                    <div>
                                        <label htmlFor="legendary-tier" className="text-white font-medium block">
                                            Legendary Tier (51-100 tokens)
                                        </label>
                                        <p className="text-gray-400 text-sm">Premium perks for top collectors</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Perks Preview */}
                    <div className="bg-[#2a0052] border-2 border-[#00ccff] p-6 relative z-20">
                        <h2 className="text-[#00ccff] text-xl mb-6">Perks Preview</h2>

                        {/* Track Preview */}
                        <div className="bg-[#3a0062] rounded-lg p-6 mb-6">
                            <div className="w-full aspect-square bg-[#4a0072] rounded-lg flex items-center justify-center mb-4">
                                {trackData?.artwork_url ? (
                                    <img
                                        src={trackData.artwork_url}
                                        alt={trackData.title}
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                ) : (
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M9 18V6L21 3V15"
                                            stroke="#00ccff"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <circle
                                            cx="6"
                                            cy="18"
                                            r="3"
                                            stroke="#00ccff"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <circle
                                            cx="18"
                                            cy="15"
                                            r="3"
                                            stroke="#00ccff"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                )}
                            </div>
                            <h3 className="text-[#ff66cc] text-xl text-center mb-1">{trackData?.title || "Your Awesome Track"}</h3>
                            <p className="text-gray-400 text-sm text-center">
                                {trackData?.genre || "Synthwave"} • {trackData?.created_at
                                    ? new Date(trackData.created_at).getFullYear()
                                    : "2025"}
                            </p>
                        </div>

                        {/* Exclusive Perks */}
                        <div className="mb-6">
                            <h3 className="text-[#00ccff] text-lg mb-4">Exclusive Perks</h3>

                            {enabledPerks.length === 0 ? (
                                <p className="text-gray-400 text-sm italic">No perks selected yet</p>
                            ) : (
                                <div className="space-y-4">
                                    {enabledPerks.map((perk) => (
                                        <div key={perk.id} className="bg-[#3a0062] rounded-lg p-4 flex items-start gap-3">
                                            <div className="mt-1">{perk.icon}</div>
                                            <div>
                                                <p className="text-[#00ccff] text-sm font-medium">{perk.title}</p>
                                                <p className="text-gray-400 text-xs">{perk.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Why Perks Matter */}
                        <div className="bg-[#3a0062] rounded-lg p-4">
                            <h3 className="text-[#ff66cc] text-lg flex items-center gap-2 mb-4">
                                <Info className="h-4 w-4" />
                                Why Perks Matter
                            </h3>
                            <ul className="text-gray-300 text-sm space-y-3">
                                <li className="flex items-start gap-2">
                                    <span className="text-[#ff66cc] font-bold">•</span>
                                    <span>
                                        Exclusive perks increase the perceived value of your NFT and give collectors a reason to buy.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[#ff66cc] font-bold">•</span>
                                    <span>
                                        Digital perks like bonus tracks and stems are easy to deliver and highly valued by music fans.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[#ff66cc] font-bold">•</span>
                                    <span>
                                        Community access creates long-term engagement and builds a loyal fanbase around your music.
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                    <Button
                        variant="outline"
                        className="border-[#ff66cc] text-[#ff66cc] hover:bg-[#ff66cc]/10"
                        onClick={handleBack}
                        disabled={isPending}
                    >
                        Back to Pricing
                    </Button>
                    <Button
                        className="bg-[#00ccff] text-white hover:bg-[#00ccff]/80"
                        onClick={handleFinalize}
                        disabled={isPending}
                    >
                        {isPending ? "Finalizing..." : "Finalize & Mint"}
                    </Button>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full py-3 px-6 text-center text-gray-400 text-sm relative z-10">
                © 2025 Dreamster. All rights reserved.
            </footer>
        </div>
    )
}

