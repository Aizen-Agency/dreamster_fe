'use client'
import type React from "react"
import { Music } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTrackUploadForm } from "@/hooks/useTrackUploadForm"
import { useRouter } from "next/navigation"

export default function UploadPage() {
    const router = useRouter();
    const { formState, handlers } = useTrackUploadForm();

    const {
        title,
        setTitle,
        description,
        setDescription,
        genre,
        setGenre,
        tags,
        setTags,
        audioFile,
        coverArt,
        isSubmitting,
        error,
    } = formState;

    const {
        handleAudioUpload,
        handleCoverUpload,
        handleDragOver,
        handleDrop,
        handleSubmit,
        resetForm,
    } = handlers;

    const handleCancel = () => {
        router.push("/user/musician/profile");
    };

    const handleNextStep = (e: React.FormEvent) => {
        handleSubmit(e, (uploadedTrackId: string) => {
            router.push(`/user/musician/upload/pricing/${uploadedTrackId}`);
        });
    };

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
            {/* Header - increased z-index */}
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

            {/* Main Content - increased z-index */}
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
                        <div className="w-10 h-10 rounded-full bg-[#2a0052] flex items-center justify-center text-white mb-2">
                            2
                        </div>
                        <span className="text-white">Pricing</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-[#2a0052] flex items-center justify-center text-white mb-2">
                            3
                        </div>
                        <span className="text-white">Publish</span>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-900/50 border border-red-500 text-white rounded-md">
                        {error}
                    </div>
                )}

                <form onSubmit={handleNextStep}>
                    <div className="flex flex-col md:flex-row gap-6 items-stretch justify-center h-full">
                        {/* Audio Upload */}
                        <div
                            className="bg-[#2a0052] border-2 border-[#ff66cc] p-6 flex flex-col items-center justify-center min-h-[400px] w-full md:w-1/2 flex-1 relative z-20"
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, "audio")}
                        >
                            <div className="mb-4">
                                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M19 18H6a4 4 0 01-4-4 4 4 0 014-4h.26a5 5 0 019.48 0H19a3 3 0 010 6z"
                                        stroke="#00ccff"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                            <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff66cc] to-[#00ccff] text-xl mb-4 text-center font-light">Upload Your Dream Track</h2>
                            <p className="text-white text-center mb-2">Drag and drop your audio or video file here</p>
                            <p className="text-gray-400 text-xs mb-6 text-center">
                                Supported formats: MP3, WAV, AAC, MP4, MOV, AVI, etc.
                            </p>
                            <label htmlFor="audio-upload">
                                <div className="bg-gradient-to-r from-[#ff66cc] to-[#00ccff] text-white px-4 py-2 rounded cursor-pointer hover:opacity-80 transition">
                                    Choose File
                                </div>
                                <input
                                    id="audio-upload"
                                    type="file"
                                    className="hidden"
                                    accept=".mp3,.wav,.aac,.mp4,.mov,.avi"
                                    onChange={handleAudioUpload}
                                />
                            </label>
                            {audioFile && <p className="mt-4 text-white">{audioFile.name}</p>}
                        </div>

                        {/* Form Fields - increased z-index */}
                        <div className="bg-[#2a0052] border-2 border-[#ff66cc] p-6 flex flex-col w-full md:w-1/2 flex-1 relative z-20">
                            <div className="mb-4">
                                <label htmlFor="title" className="block text-[#ff66cc] mb-2">
                                    Title
                                </label>
                                <input
                                    id="title"
                                    type="text"
                                    placeholder="Enter title"
                                    className="w-full bg-[#1a0033] border border-[#3a0062] rounded-md py-2 px-3 text-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#ff66cc]"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="genre" className="block text-[#ff66cc] mb-2">
                                    Genre
                                </label>
                                <select
                                    id="genre"
                                    className="w-full bg-[#1a0033] border border-[#3a0062] rounded-md py-2 px-3 text-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#ff66cc]"
                                    value={genre}
                                    onChange={(e) => setGenre(e.target.value)}
                                >
                                    <option value="">Select Genre</option>
                                    <option value="electronic">Electronic</option>
                                    <option value="hiphop">Hip Hop</option>
                                    <option value="rock">Rock</option>
                                    <option value="pop">Pop</option>
                                    <option value="ambient">Ambient</option>
                                    <option value="jazz">Jazz</option>
                                </select>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="description" className="block text-[#ff66cc] mb-2">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    placeholder="Enter description"
                                    className="w-full bg-[#1a0033] border border-[#3a0062] rounded-md py-2 px-3 text-white placeholder:text-gray-400 min-h-[100px] focus:outline-none focus:ring-1 focus:ring-[#ff66cc]"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-[#ff66cc] mb-2">Cover Art</label>
                                <div
                                    className="border-2 border-dashed border-[#00ccff] rounded-lg p-6 flex flex-col items-center justify-center"
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, "cover")}
                                >
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="3" y="3" width="18" height="18" rx="2" stroke="#00ccff" strokeWidth="2" />
                                        <circle cx="8.5" cy="8.5" r="1.5" fill="#00ccff" />
                                        <path
                                            d="M21 15L16 10L5 21"
                                            stroke="#00ccff"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    <p className="text-white text-center text-sm my-2">Drag and drop your cover art here</p>
                                    <p className="text-gray-400 text-xs mb-4 text-center">Supported formats: JPG, PNG, GIF</p>

                                    <label htmlFor="cover-upload">
                                        <div className="bg-[#00ccff] text-white px-3 py-1 rounded text-sm cursor-pointer hover:bg-[#00ccff]/80 transition">
                                            Choose Image
                                        </div>
                                        <input
                                            id="cover-upload"
                                            type="file"
                                            className="hidden"
                                            accept=".jpg,.jpeg,.png,.gif"
                                            onChange={handleCoverUpload}
                                        />
                                    </label>
                                    {coverArt && <p className="mt-2 text-white text-sm">{coverArt.name}</p>}
                                </div>
                            </div>

                            <div className="mb-6">
                                <label htmlFor="tags" className="block text-[#ff66cc] mb-2">
                                    Tags
                                </label>
                                <input
                                    id="tags"
                                    type="text"
                                    placeholder="Enter tags (comma-separated)"
                                    className="w-full bg-[#1a0033] border border-[#3a0062] rounded-md py-2 px-3 text-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#ff66cc]"
                                    value={tags}
                                    onChange={(e) => setTags(e.target.value)}
                                />
                            </div>

                            <div className="mt-auto flex justify-end gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="border-[#ff66cc] text-[#ff66cc] hover:bg-[#ff66cc]/10"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-[#00ccff] text-white hover:bg-[#00ccff]/80"
                                    disabled={isSubmitting || !audioFile || !title}
                                >
                                    {isSubmitting ? "Uploading..." : "Next Step"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </main>

            {/* Footer - increased z-index */}
            <footer className="w-full py-3 px-6 text-center text-gray-400 text-sm relative z-10">
                © 2025 Dreamster. All rights reserved.
            </footer>
        </div>
    );
}