import { useState } from "react";
import { useUploadTrack, TrackFormData } from "./useTrackManagement";
import { useRouter } from "next/navigation";

export const useTrackUploadForm = () => {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [genre, setGenre] = useState("");
    const [tags, setTags] = useState("");
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [coverArt, setCoverArt] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const uploadTrackMutation = useUploadTrack();

    const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAudioFile(e.target.files[0]);
        }
    };

    const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setCoverArt(e.target.files[0]);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, type: "audio" | "cover") => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            if (type === "audio") {
                setAudioFile(e.dataTransfer.files[0]);
            } else {
                setCoverArt(e.dataTransfer.files[0]);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!audioFile) {
            setError("Audio file is required");
            return;
        }

        if (!title) {
            setError("Title is required");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            // Parse tags from comma-separated string to array
            const parsedTags = tags
                ? tags.split(",").map(tag => tag.trim()).filter(tag => tag !== "")
                : [];

            const trackData: TrackFormData = {
                title,
                description,
                genre,
                tags: parsedTags,
                audio: audioFile,
            };

            if (coverArt) {
                trackData.artwork = coverArt;
            }

            await uploadTrackMutation.mutateAsync(trackData);

            // Navigate to the next step or show success
            router.push("/user/musician/profile");
        } catch (err) {
            console.error("Error uploading track:", err);
            setError("Failed to upload track. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setGenre("");
        setTags("");
        setAudioFile(null);
        setCoverArt(null);
        setError(null);
    };

    return {
        formState: {
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
        },
        handlers: {
            handleAudioUpload,
            handleCoverUpload,
            handleDragOver,
            handleDrop,
            handleSubmit,
            resetForm,
        },
    };
}; 