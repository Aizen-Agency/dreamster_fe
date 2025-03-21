import { create } from 'zustand';

interface ArtistState {
    currentArtistId: string | null;
    setCurrentArtistId: (id: string | null) => void;
}

export const useArtistStore = create<ArtistState>((set) => ({
    currentArtistId: null,
    setCurrentArtistId: (id) => set({ currentArtistId: id }),
})); 