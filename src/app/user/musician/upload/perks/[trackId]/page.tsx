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
import { usePerksManagement, useUploadPerkFiles, useUploadStemFiles } from "@/hooks/usePerksManagement"
import { Perk as APIPerk } from "@/services/perksService"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

interface Perk {
    id: string
    type: string
    enabled: boolean
    title: string
    description: string
    icon: React.ReactNode
    apiId?: string // To link with API perks
    perkType?: "text" | "url" | "file" | "audio"
    fileData?: File
    url?: string
    isDirty?: boolean
}

export default function PerksPage() {
    const router = useRouter()
    const params = useParams()
    const trackId = params.trackId as string
    const [error, setError] = useState<string | null>(null)

    const { data: trackData, isLoading: isTrackLoading, isError: isTrackError } = useGetTrack(trackId)

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

    const [customPerks, setCustomPerks] = useState<Perk[]>([])

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

    const handleFileUpload = (id: string, file: File | null) => {
        const allPerks = [...perks, ...customPerks];
        const perk = allPerks.find(p => p.id === id);

        if (!perk) return;

        // For stems, always set perkType to "audio"
        const updatedPerkType = id === "stems" ? "audio" : perk.perkType;

        // Update local state with file data
        if (perks.find(p => p.id === id)) {
            setPerks(perks?.map(p =>
                p.id === id ? {
                    ...p,
                    fileData: file || undefined,
                    perkType: updatedPerkType,
                    isDirty: true
                } : p
            ));
        } else {
            setCustomPerks(customPerks.map(p =>
                p.id === id ? {
                    ...p,
                    fileData: file || undefined,
                    perkType: updatedPerkType,
                    isDirty: true
                } : p
            ));
        }
    }

    const updatePerkUrl = (id: string, url: string) => {
        const allPerks = [...perks, ...customPerks];
        const perk = allPerks.find(p => p.id === id);

        if (!perk) return;

        // Update local state with URL
        if (perks.find(p => p.id === id)) {
            setPerks(perks.map(p =>
                p.id === id ? { ...p, url, isDirty: true } : p
            ));
        } else {
            setCustomPerks(customPerks.map(p =>
                p.id === id ? { ...p, url, isDirty: true } : p
            ));
        }
    }

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
                    active: true,
                    perkType: perk.perkType || "text",
                    s3_url: perk.url || ""
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

    // Modify your handlers to only update local state
    const handleTitleChange = (e: any) => {
        const newTitle = e.target.value;
        const perkId = e.target.id;

        // Only update local state, not the backend
        if (perks.find(p => p.id === perkId)) {
            setPerks(perks.map(p =>
                p.id === perkId ? { ...p, title: newTitle, isDirty: true } : p
            ));
        } else {
            setCustomPerks(customPerks.map(p =>
                p.id === perkId ? { ...p, title: newTitle, isDirty: true } : p
            ));
        }
    };

    const handleDescriptionChange = (e: any) => {
        const newDescription = e.target.value;
        const perkId = e.target.id;

        // Only update local state, not the backend
        if (perks.find(p => p.id === perkId)) {
            setPerks(perks.map(p =>
                p.id === perkId ? { ...p, description: newDescription, isDirty: true } : p
            ));
        } else {
            setCustomPerks(customPerks.map(p =>
                p.id === perkId ? { ...p, description: newDescription, isDirty: true } : p
            ));
        }
    };

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

    const updatePerkType = (id: string, perkType: "text" | "url" | "file" | "audio") => {
        console.log(`Updating perk type for ${id} to ${perkType}`);

        // Check if it's a predefined perk
        const predefinedPerkIndex = perks.findIndex(p => p.id === id);

        if (predefinedPerkIndex >= 0) {
            console.log(`Found predefined perk at index ${predefinedPerkIndex}`);
            // Update predefined perk
            const updatedPerks = [...perks];
            updatedPerks[predefinedPerkIndex] = {
                ...updatedPerks[predefinedPerkIndex],
                perkType,
                isDirty: true
            };
            setPerks(updatedPerks);
        } else {
            // Update custom perk
            const customPerkIndex = customPerks.findIndex(p => p.id === id);
            console.log(`Found custom perk at index ${customPerkIndex}`);
            if (customPerkIndex >= 0) {
                const updatedCustomPerks = [...customPerks];
                updatedCustomPerks[customPerkIndex] = {
                    ...updatedCustomPerks[customPerkIndex],
                    perkType,
                    isDirty: true
                };
                setCustomPerks(updatedCustomPerks);
            } else {
                console.warn(`Perk with ID ${id} not found in either perks or customPerks`);
            }
        }
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
        router.push(`/user/musician/upload/pricing/${trackId}`)
    }

    const uploadPerkFilesMutation = useUploadPerkFiles(trackId);

    const uploadStemFilesMutation = useUploadStemFiles(trackId);

    const handleFinalize = async () => {
        if (!trackId) {
            setError("No track ID found. Please go back and upload a track first.")
            return
        }

        try {
            // Get all enabled perks
            const allEnabledPerks = [...perks.filter(perk => perk.enabled), ...customPerks.filter(perk => perk.enabled)];

            // Create FormData for regular perk files
            const perkFormData = new FormData();
            perkFormData.append('perks', JSON.stringify([])); // Add empty perks array as expected by backend

            // Process each perk
            for (const perk of allEnabledPerks) {
                let perkId = perk.apiId;

                // Create or update perk based on whether it exists in API
                if (!perkId) {
                    // Create new perk
                    const perkData = {
                        title: perk.title,
                        description: perk.description,
                        active: true,
                        perkType: perk.id === "stems" ? "audio" : (perk.perkType || "text"),
                        s3_url: perk.url || ""
                    };

                    const newApiPerk = await createPerk(perkData);
                    perkId = newApiPerk.id;
                } else if (perk.isDirty) {
                    // Update existing perk if it's been modified
                    await updatePerk({
                        perkId: perk.apiId,
                        title: perk.title,
                        description: perk.description,
                        s3_url: perk.url
                    });
                }

                // Handle file upload if needed
                if (perk.fileData && perkId) {
                    if (perk.id === "stems") {
                        // Handle stem files separately
                        // Create a new FormData specifically for this stem file
                        const stemFormData = new FormData();

                        // Log the file object to verify it's valid
                        console.log("Stem file object:", perk.fileData);

                        // Add the file with the correct field name
                        stemFormData.append('file', perk.fileData);
                        stemFormData.append('perk_id', perkId);

                        // Log the FormData entries
                        console.log("Stem FormData entries:",
                            Array.from(stemFormData.entries()).map(entry => {
                                if (entry[1] instanceof File) {
                                    return [entry[0], `File: ${(entry[1] as File).name}`];
                                }
                                return entry;
                            })
                        );

                        // Upload this stem file immediately
                        await uploadStemFilesMutation.mutateAsync(stemFormData);
                    } else {
                        // Handle regular perk files
                        perkFormData.append('perkId', perkId);
                        perkFormData.append(`file_${perkId}_1`, perk.fileData);
                    }
                }
            }

            // Upload regular perk files if any
            if (perkFormData && Array.from(perkFormData.entries()).length > 1) {
                await uploadPerkFilesMutation.mutateAsync(perkFormData);
            }

            // Navigate to next step
            router.push(`/user/musician/profile`)
        } catch (err: any) {
            console.error("Error finalizing perks:", err);
            // More specific error message
            if (err.response?.data?.message) {
                setError(`Failed to save perks: ${err.response.data.message}`);
            } else {
                setError("Failed to save perks. Please try again.");
            }
        }
    }

    // Show loading state while fetching data
    const isLoading = isTrackLoading || isPerksLoading;
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-pink-500 flex items-center justify-center">
                <div className="text-white bg-[#1a0033] border border-[#6700af] p-6 rounded-md shadow-[0_0_15px_rgba(255,44,201,0.3)]">
                    <div className="flex items-center space-x-3">
                        <div className="animate-spin h-6 w-6 border-2 border-[#ff66cc] border-t-transparent rounded-full"></div>
                        <span>Loading data...</span>
                    </div>
                </div>
            </div>
        )
    }

    // Show error state if data fetch fails
    const isError = isTrackError || isPerksError;
    if (isError) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-pink-500 flex items-center justify-center">
                <div className="text-white bg-red-900/50 border border-red-500 p-6 rounded-md shadow-[0_0_15px_rgba(255,44,201,0.3)] max-w-md">
                    <h3 className="text-xl font-bold audiowide-regular text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 mb-3">Error Loading Data</h3>
                    <p className="mb-4">Unable to load track data. Please try again or go back to upload a new track.</p>
                    <div className="mt-4">
                        <Button
                            onClick={() => router.push("/user/musician/upload")}
                            className="bg-[#00ccff] text-white hover:bg-[#00ccff]/80"
                        >
                            Back to Upload
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    // Render the main UI
    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-pink-500 relative overflow-hidden">
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

            {/* Header - increased z-index */}
            <header className="bg-[#2a0052] w-full py-3 px-8 flex justify-between items-center relative z-10">
                <div className="flex items-center gap-2">
                    <Music className="h-6 w-6 text-[#00ccff]" />
                    <span className="audiowide-regular bg-gradient-to-r from-[#ff66cc] to-[#00ccff] text-transparent bg-clip-text font-bold text-xl">Dreamster</span>
                </div>
                <Button
                    variant="outline"
                    className="border-[#00ccff] text-[#00ccff] rounded-full hover:bg-[#00ccff]/10"
                >
                    Connect Wallet
                </Button>
            </header>

            {/* Main Content - increased z-index */}
            <main className="w-[60%] container mx-auto px-4 py-8 relative z-10">
                {/* Steps */}
                <div className="flex w-[100%] justify-around items-center mb-8">
                    <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-[#2a0052] border-2 border-[#6700af] flex items-center justify-center text-white mb-2">
                            1
                        </div>
                        <span className="text-white font-semibold">Upload</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-[#2a0052] border-2 border-[#6700af] flex items-center justify-center text-white mb-2">
                            2
                        </div>
                        <span className="text-white font-semibold">Pricing</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-[#ff66cc] border-2 border-[#ff33bb] flex items-center justify-center text-white mb-2">
                            3
                        </div>
                        <span className="text-[#ff33bb] font-bold">Perks</span>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-900/50 border border-red-500 text-white rounded-md">
                        {error}
                    </div>
                )}

                {/* Title */}
                <div className="text-center mb-8">
                    <h1 className="audiowide-regular text-transparent bg-clip-text bg-gradient-to-r  from-[#ff66cc] to-[#00ccff] text-2xl md:text-3xl font-bold mb-2">Add Exclusive Perks</h1>
                    <p className="text-gray-300">Offer special benefits to your NFT collectors to increase value</p>
                </div>

                {/* Perks Configuration and Preview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Collector Perks */}
                    <div className="bg-[#1a0033] border-2 border-[#6700af] rounded-lg p-6 relative z-20">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="audiowide-regular bg-gradient-to-r from-[#00ccff] to-[#ff66cc] text-transparent bg-clip-text text-xl font-semibold">Collector Perks</h2>
                            <Info className="h-5 w-5 text-[#00ccff]" />
                        </div>

                        {/* Predefined Perks */}
                        {perks.map(perk => (
                            <div key={perk.id} className="mb-6 border border-[#6700af] rounded-lg overflow-hidden bg-[#2a0052]/40">
                                <div className="flex justify-between items-center p-4 bg-[#2a0052]/60">
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
                                {perk.enabled && perk.id === "stems" && (
                                    <div className="p-4">
                                        <Input
                                            id={perk.id}
                                            value={perk.title}
                                            onChange={handleTitleChange}
                                            className="bg-[#1a0033] border-[#3a0062] text-white mb-3 focus:outline-none focus:ring-1 focus:ring-[#ff66cc]"
                                            placeholder={`${perk.type} Title`}
                                            disabled={isPending}
                                        />
                                        <Textarea
                                            id={perk.id}
                                            value={perk.description}
                                            onChange={handleDescriptionChange}
                                            className="bg-[#1a0033] border-[#3a0062] text-white h-20 mb-3 focus:outline-none focus:ring-1 focus:ring-[#ff66cc]"
                                            placeholder={`Describe your ${perk.type.toLowerCase()}`}
                                            disabled={isPending}
                                        />

                                        {/* File Upload for Stems - Always Audio Type */}
                                        <div className="mt-3 border-2 border-dashed border-[#3a0062] rounded-md p-4 text-center">
                                            <label className="block text-sm text-gray-300 mb-2">
                                                Upload Stems (MP3, WAV)
                                            </label>
                                            <div
                                                className="flex flex-col items-center justify-center cursor-pointer"
                                                onDragOver={(e) => e.preventDefault()}
                                                onDrop={(e) => {
                                                    e.preventDefault();
                                                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                                        // Force audio type for stems
                                                        handleFileUpload(perk.id, e.dataTransfer.files[0]);
                                                    }
                                                }}
                                            >
                                                {perk.fileData ? (
                                                    <div className="text-[#00ccff]">
                                                        {perk.fileData.name}
                                                    </div>
                                                ) : (
                                                    <div className="text-gray-400">
                                                        Drag and drop or click to upload
                                                    </div>
                                                )}
                                                <input
                                                    type="file"
                                                    accept=".mp3,.wav"
                                                    className="hidden"
                                                    id={`stems-upload-${perk.id}`}
                                                    onChange={(e) => {
                                                        if (e.target.files && e.target.files[0]) {
                                                            // Force audio type for stems
                                                            handleFileUpload(perk.id, e.target.files[0]);
                                                        }
                                                    }}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    className="mt-2 border-[#ff66cc] text-[#ff66cc] hover:bg-[#ff66cc]/10"
                                                    onClick={() => document.getElementById(`stems-upload-${perk.id}`)?.click()}
                                                >
                                                    Select File
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {perk.enabled && perk.id === "discord" && (
                                    <div className="p-4">
                                        <Input
                                            value={perk.title}
                                            onChange={handleTitleChange}
                                            className="bg-[#1a0033] border-[#3a0062] text-white mb-3 focus:outline-none focus:ring-1 focus:ring-[#ff66cc]"
                                            placeholder={`${perk.type} Title`}
                                            disabled={isPending}
                                        />
                                        <Textarea
                                            value={perk.description}
                                            onChange={handleDescriptionChange}
                                            className="bg-[#1a0033] border-[#3a0062] text-white h-20 mb-3 focus:outline-none focus:ring-1 focus:ring-[#ff66cc]"
                                            placeholder={`Describe your ${perk.type.toLowerCase()}`}
                                            disabled={isPending}
                                        />

                                        {/* Discord URL Input */}
                                        <div className="mt-3">
                                            <label className="block text-sm text-gray-300 mb-2">
                                                Discord Invite URL
                                            </label>
                                            <Input
                                                value={perk.url || ""}
                                                onChange={(e) => updatePerkUrl(perk.id, e.target.value)}
                                                className="bg-[#1a0033] border-[#3a0062] text-white focus:outline-none focus:ring-1 focus:ring-[#ff66cc]"
                                                placeholder="https://discord.gg/your-invite-code"
                                                disabled={isPending}
                                            />
                                        </div>
                                    </div>
                                )}
                                {perk.enabled && (
                                    <div className="p-4">
                                        <Input
                                            id={perk.id}
                                            value={perk.title}
                                            onChange={handleTitleChange}
                                            className="bg-[#1a0033] border-[#3a0062] text-white mb-3 focus:outline-none focus:ring-1 focus:ring-[#ff66cc]"
                                            placeholder="Custom Perk Title"
                                            disabled={isPending}
                                        />
                                        <Textarea
                                            id={perk.id}
                                            value={perk.description}
                                            onChange={handleDescriptionChange}
                                            className="bg-[#1a0033] border-[#3a0062] text-white h-20 mb-3 focus:outline-none focus:ring-1 focus:ring-[#ff66cc]"
                                            placeholder="Describe your custom perk"
                                            disabled={isPending}
                                        />

                                        {/* Perk Type Selection for Custom Perks */}
                                        <div className="mt-3">
                                            <label className="block text-sm text-gray-300 mb-2">
                                                Perk Type
                                            </label>
                                            <Select
                                                value={perk.perkType || "text"}
                                                onValueChange={(value) => updatePerkType(perk.id, value as "text" | "url" | "file" | "audio")}
                                            >
                                                <SelectTrigger className="bg-[#1a0033] border-[#3a0062] text-white">
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-[#1a0033] border-[#3a0062] text-white">
                                                    <SelectItem value="text">Text Only</SelectItem>
                                                    <SelectItem value="url">URL / Link</SelectItem>
                                                    <SelectItem value="file">File (PDF, DOC)</SelectItem>
                                                    <SelectItem value="audio">Audio File</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Conditional Input Based on Type */}
                                        {perk.perkType === "url" && (
                                            <div className="mt-3">
                                                <label className="block text-sm text-gray-300 mb-2">
                                                    URL
                                                </label>
                                                <Input
                                                    value={perk.url || ""}
                                                    onChange={(e) => updatePerkUrl(perk.id, e.target.value)}
                                                    className="bg-[#1a0033] border-[#3a0062] text-white focus:outline-none focus:ring-1 focus:ring-[#ff66cc]"
                                                    placeholder="https://example.com"
                                                    disabled={isPending}
                                                />
                                            </div>
                                        )}

                                        {(perk.perkType === "file" || perk.perkType === "audio") && (
                                            <div className="mt-3 border-2 border-dashed border-[#3a0062] rounded-md p-4 text-center">
                                                <label className="block text-sm text-gray-300 mb-2">
                                                    {perk.perkType === "file" ? "Upload File (PDF, DOC)" : "Upload Audio"}
                                                </label>
                                                <div
                                                    className="flex flex-col items-center justify-center cursor-pointer"
                                                    onDragOver={(e) => e.preventDefault()}
                                                    onDrop={(e) => {
                                                        e.preventDefault();
                                                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                                            handleFileUpload(perk.id, e.dataTransfer.files[0]);
                                                        }
                                                    }}
                                                >
                                                    {perk.fileData ? (
                                                        <div className="text-[#00ccff]">
                                                            {perk.fileData.name}
                                                        </div>
                                                    ) : (
                                                        <div className="text-gray-400">
                                                            Drag and drop or click to upload
                                                        </div>
                                                    )}
                                                    <input
                                                        type="file"
                                                        accept={perk.perkType === "file" ? ".pdf,.doc,.docx" : ".mp3,.wav"}
                                                        className="hidden"
                                                        id={`file-upload-${perk.id}`}
                                                        onChange={(e) => {
                                                            if (e.target.files && e.target.files[0]) {
                                                                handleFileUpload(perk.id, e.target.files[0]);
                                                            }
                                                        }}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        className="mt-2 border-[#ff66cc] text-[#ff66cc] hover:bg-[#ff66cc]/10"
                                                        onClick={() => document.getElementById(`file-upload-${perk.id}`)?.click()}
                                                    >
                                                        Select File
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Custom Perks */}
                        {customPerks.map(perk => (
                            <div key={perk.id} className="mb-6 border border-[#6700af] rounded-lg overflow-hidden bg-[#2a0052]/40">
                                <div className="flex justify-between items-center p-4 bg-[#2a0052]/60">
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
                                            id={perk.id}
                                            value={perk.title}
                                            onChange={handleTitleChange}
                                            className="bg-[#1a0033] border-[#3a0062] text-white mb-3 focus:outline-none focus:ring-1 focus:ring-[#ff66cc]"
                                            placeholder="Custom Perk Title"
                                            disabled={isPending}
                                        />
                                        <Textarea
                                            id={perk.id}
                                            value={perk.description}
                                            onChange={handleDescriptionChange}
                                            className="bg-[#1a0033] border-[#3a0062] text-white h-20 mb-3 focus:outline-none focus:ring-1 focus:ring-[#ff66cc]"
                                            placeholder="Describe your custom perk"
                                            disabled={isPending}
                                        />

                                        {/* Perk Type Selection for Custom Perks */}
                                        <div className="mt-3">
                                            <label className="block text-sm text-gray-300 mb-2">
                                                Perk Type
                                            </label>
                                            <Select
                                                value={perk.perkType || "text"}
                                                onValueChange={(value) => updatePerkType(perk.id, value as "text" | "url" | "file" | "audio")}
                                            >
                                                <SelectTrigger className="bg-[#1a0033] border-[#3a0062] text-white">
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-[#1a0033] border-[#3a0062] text-white">
                                                    <SelectItem value="text">Text Only</SelectItem>
                                                    <SelectItem value="url">URL / Link</SelectItem>
                                                    <SelectItem value="file">File (PDF, DOC)</SelectItem>
                                                    <SelectItem value="audio">Audio File</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Conditional Input Based on Type */}
                                        {perk.perkType === "url" && (
                                            <div className="mt-3">
                                                <label className="block text-sm text-gray-300 mb-2">
                                                    URL
                                                </label>
                                                <Input
                                                    value={perk.url || ""}
                                                    onChange={(e) => updatePerkUrl(perk.id, e.target.value)}
                                                    className="bg-[#1a0033] border-[#3a0062] text-white focus:outline-none focus:ring-1 focus:ring-[#ff66cc]"
                                                    placeholder="https://example.com"
                                                    disabled={isPending}
                                                />
                                            </div>
                                        )}

                                        {(perk.perkType === "file" || perk.perkType === "audio") && (
                                            <div className="mt-3 border-2 border-dashed border-[#3a0062] rounded-md p-4 text-center">
                                                <label className="block text-sm text-gray-300 mb-2">
                                                    {perk.perkType === "file" ? "Upload File (PDF, DOC)" : "Upload Audio"}
                                                </label>
                                                <div
                                                    className="flex flex-col items-center justify-center cursor-pointer"
                                                    onDragOver={(e) => e.preventDefault()}
                                                    onDrop={(e) => {
                                                        e.preventDefault();
                                                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                                            handleFileUpload(perk.id, e.dataTransfer.files[0]);
                                                        }
                                                    }}
                                                >
                                                    {perk.fileData ? (
                                                        <div className="text-[#00ccff]">
                                                            {perk.fileData.name}
                                                        </div>
                                                    ) : (
                                                        <div className="text-gray-400">
                                                            Drag and drop or click to upload
                                                        </div>
                                                    )}
                                                    <input
                                                        type="file"
                                                        accept={perk.perkType === "file" ? ".pdf,.doc,.docx" : ".mp3,.wav"}
                                                        className="hidden"
                                                        id={`file-upload-${perk.id}`}
                                                        onChange={(e) => {
                                                            if (e.target.files && e.target.files[0]) {
                                                                handleFileUpload(perk.id, e.target.files[0]);
                                                            }
                                                        }}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        className="mt-2 border-[#ff66cc] text-[#ff66cc] hover:bg-[#ff66cc]/10"
                                                        onClick={() => document.getElementById(`file-upload-${perk.id}`)?.click()}
                                                    >
                                                        Select File
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Add Another Perk Button */}
                        <Button
                            className="w-full bg-gradient-to-r from-[#ff66cc] to-[#00ccff] text-white hover:bg-[#ff66cc]/80 font-bold py-3 rounded-md mb-6"
                            onClick={addCustomPerk}
                            disabled={isPending}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Another Perk
                        </Button>

                        {/* Tier-Based Access */}
                        <div className="mb-6">
                            <h3 className="audiowide-regular text-[#ff66cc] text-lg font-semibold mb-4">Tier-Based Access</h3>

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
                    <div className="bg-[#1a0033] border-2 border-[#6700af] rounded-lg p-6 relative z-20">
                        <h2 className="audiowide-regular text-[#00ccff] text-xl font-semibold mb-4">Perks Preview</h2>

                        {/* Track Preview */}
                        <div className="bg-[#1a0033] border-2 border-[#6700af] rounded-lg p-4 mb-6 flex flex-col items-center">
                            <div className="w-16 h-16 bg-[#4a0072] rounded-lg flex items-center justify-center mb-4">
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
                            <h3 className="text-[#ff66cc] text-xl text-center mb-1 font-semibold">{trackData?.title || "Your Awesome Track"}</h3>
                            <p className="text-gray-400 text-sm text-center">
                                {trackData?.genre || "Synthwave"} • {trackData?.created_at
                                    ? new Date(trackData.created_at).getFullYear()
                                    : "2025"}
                            </p>
                        </div>

                        {/* Exclusive Perks */}
                        <div className="mb-6">
                            <h3 className="audiowide-regular text-[#00ccff] text-lg font-semibold mb-4">Exclusive Perks</h3>

                            {enabledPerks.length === 0 ? (
                                <p className="text-gray-400 text-sm italic">No perks selected yet</p>
                            ) : (
                                <div className="space-y-4">
                                    {enabledPerks.map((perk) => (
                                        <div key={perk.id} className="bg-[#2a0052]/40 rounded-lg p-4 flex items-start gap-3 border border-[#6700af]">
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
                        <div className="bg-[#2a0052]/40 rounded-md border border-[#6700af] p-4">
                            <h3 className="text-[#ff66cc] text-lg flex items-center gap-2 mb-4 font-semibold audiowide-regular">
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
                <div className="audiowide-regular mt-8 flex justify-between">
                    <Button
                        variant="outline"
                        className="border-[#ff66cc] text-[#ff66cc] hover:bg-[#ff66cc]/10"
                        onClick={handleBack}
                        disabled={isPending}
                    >
                        Previous Step
                    </Button>
                    <Button
                        className="bg-[#00ccff] text-white hover:bg-[#00ccff]/80"
                        onClick={handleFinalize}
                        disabled={isPending}
                    >
                        {isPending ? "Finalizing..." : "Next Step"}
                    </Button>
                </div>
            </main>

            {/* Footer - increased z-index */}
            <footer className="w-full py-3 px-6 text-center text-pink-700 text-sm relative z-10">
                © 2025 Dreamster. All rights reserved.
            </footer>
        </div>
    )
}

