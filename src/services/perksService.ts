import apiClient from "@/lib/apiClient";

export interface Perk {
    id: string;
    title: string;
    category: string;
    description: string;
    active: boolean;
    perkType?: "text" | "url" | "file" | "audio";
    s3_url?: string;
    additionalUrls?: Record<string, string>;
    created_at?: string;
    updated_at?: string;
    track_id?: string;
}

export interface CreatePerkRequest {
    title: string;
    category: string;
    description: string;
    s3_url?: string;
    active?: boolean;
    perkType?: "text" | "url" | "file" | "audio";
}

export interface UpdatePerkRequest {
    title?: string;
    description?: string;
    s3_url?: string;
    active?: boolean;
    perkType?: "text" | "url" | "file" | "audio";
}

export const perksService = {
    // Get all perks for a track
    getTrackPerks: async (trackId: string): Promise<Perk[]> => {
        const response = await apiClient.get(`/musician/tracks/${trackId}/perks`);
        return response.data;
    },

    // Get a single perk
    getPerk: async (trackId: string, perkId: string): Promise<Perk> => {
        const response = await apiClient.get(`/musician/tracks/${trackId}/perks/${perkId}`);
        return response.data;
    },

    // Create a new perk
    createPerk: async (trackId: string, perkData: CreatePerkRequest): Promise<Perk> => {
        const response = await apiClient.post(`/musician/tracks/${trackId}/perks`, perkData);
        return response.data.perk;
    },

    // Update an existing perk
    updatePerk: async (trackId: string, perkId: string, perkData: UpdatePerkRequest): Promise<Perk> => {
        const response = await apiClient.put(`/musician/tracks/${trackId}/perks/${perkId}`, perkData);
        return response.data.perk;
    },

    // Delete a perk
    deletePerk: async (trackId: string, perkId: string): Promise<void> => {
        await apiClient.delete(`/musician/tracks/${trackId}/perks/${perkId}`);
    },

    // Toggle perk active status
    togglePerkStatus: async (trackId: string, perkId: string): Promise<{ active: boolean }> => {
        const response = await apiClient.patch(`/musician/tracks/${trackId}/perks/${perkId}/toggle`);
        return { active: response.data.active };
    },



    // Upload perk files (for custom perks)
    uploadPerkFiles: async (trackId: string, formData: FormData): Promise<void> => {
        // Create a new FormData object with the correct structure
        const newFormData = new FormData();

        // Add perks field as an empty array if not present
        newFormData.append('perks', JSON.stringify([]));

        // Check if perkId is provided in the original formData
        const perkId = formData.get('perkId') as string;

        if (!perkId) {
            throw new Error("perkId is required for uploading perk files");
        }

        // Find the file in the formData
        let file: File | null = null;
        for (const key of Array.from(formData.keys())) {
            const value = formData.get(key);
            if (value instanceof File) {
                file = value;
                break;
            }
        }

        if (!file) {
            throw new Error("No file found in FormData");
        }

        // Add file with the correct naming convention expected by the backend
        newFormData.append(`file_${perkId}_1`, file);

        // Send the request to the bulk endpoint
        await apiClient.post(`/musician/tracks/${trackId}/perks/bulk`, newFormData);
    },

    // Prepare FormData for perk files with optimized naming
    preparePerkFilesFormData: (trackId: string, perkFiles: Map<string, File[]>): FormData => {
        const formData = new FormData();

        // Track counters for each perk and file type
        const counters: Record<string, { audio: number, file: number }> = {};

        perkFiles.forEach((files, perkId) => {
            // Initialize counters for this perk if not exists
            if (!counters[perkId]) {
                counters[perkId] = { audio: 1, file: 1 };
            }

            files.forEach(file => {
                const fileExtension = file.name.split('.').pop() || '';
                const isAudio = /^(mp3|wav|aac|m4a)$/i.test(fileExtension);

                // Determine file type counter to use
                const counter = isAudio ? counters[perkId].audio++ : counters[perkId].file++;
                const fileType = isAudio ? 'audio' : 'file';

                // Create optimized filename: perks/{perkId}/{fileType}{counter}.{extension}
                const optimizedName = `perks/${perkId}/${fileType}${counter}.${fileExtension}`;

                // Add to formData with the optimized name and metadata
                formData.append(`perk_${perkId}_${fileType}`, file);
                formData.append(`perk_${perkId}_${fileType}_path`, optimizedName);
            });
        });

        return formData;
    },

    // Bulk update perks with files
    bulkUpdatePerks: async (trackId: string, perks: any[], files: Map<string, File[]>): Promise<any> => {
        const formData = new FormData();

        // Add perks data as JSON
        formData.append('perks', JSON.stringify(perks));

        // Add files with optimized naming
        const counters: Record<string, { audio: number, file: number }> = {};

        files.forEach((fileList, perkId) => {
            // Initialize counters for this perk if not exists
            if (!counters[perkId]) {
                counters[perkId] = { audio: 1, file: 1 };
            }

            fileList.forEach(file => {
                const fileExtension = file.name.split('.').pop() || '';
                const isAudio = /^(mp3|wav|aac|m4a)$/i.test(fileExtension);

                // Determine file type counter to use
                const counter = isAudio ? counters[perkId].audio++ : counters[perkId].file++;
                const fileType = isAudio ? 'audio' : 'file';

                // Add file to formData with perk ID reference
                formData.append(`file_${perkId}_${counter}`, file);
            });
        });

        const response = await apiClient.post(`/musician/tracks/${trackId}/perks/bulk`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data;
    },

    uploadStemFiles: async (trackId: string, formData: FormData): Promise<void> => {
        console.log("Original FormData entries:",
            Array.from(formData.entries()).map(entry => {
                if (entry[1] instanceof File) {
                    return [entry[0], `File: ${(entry[1] as File).name} (${(entry[1] as File).type})`];
                }
                return entry;
            })
        );

        const fileEntry = formData.get('file');
        if (!fileEntry || !(fileEntry instanceof File) || !fileEntry.size) {
            console.error("File is empty or invalid:", fileEntry);
            throw new Error("The file is empty or invalid. Please select a valid audio file.");
        }

        await apiClient.post(`/musician/tracks/${trackId}/files/stem`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }
}; 