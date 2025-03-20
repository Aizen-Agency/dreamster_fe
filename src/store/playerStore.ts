import { create } from 'zustand';
import { Track } from '@/types/track';

interface PlayerState {
    currentTrack: Track | null;
    isPlaying: boolean;
    volume: number;
    currentTime: number;
    duration: number;
    streamUrl: string | null;
    queue: Track[];

    // Actions
    setCurrentTrack: (track: Track | null) => void;
    setIsPlaying: (isPlaying: boolean) => void;
    setVolume: (volume: number) => void;
    setCurrentTime: (time: number) => void;
    setDuration: (duration: number) => void;
    setStreamUrl: (url: string | null) => void;
    addToQueue: (track: Track) => void;
    removeFromQueue: (trackId: string) => void;
    clearQueue: () => void;
    playNext: () => void;
    playPrevious: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
    currentTrack: null,
    isPlaying: false,
    volume: 1,
    currentTime: 0,
    duration: 0,
    streamUrl: null,
    queue: [],

    setCurrentTrack: (track) => set({ currentTrack: track }),
    setIsPlaying: (isPlaying) => set({ isPlaying }),
    setVolume: (volume) => set({ volume }),
    setCurrentTime: (time) => set({ currentTime: time }),
    setDuration: (duration) => set({ duration }),
    setStreamUrl: (url) => set({ streamUrl: url }),

    addToQueue: (track) => set((state) => ({
        queue: [...state.queue, track]
    })),

    removeFromQueue: (trackId) => set((state) => ({
        queue: state.queue.filter(track => track.id !== trackId)
    })),

    clearQueue: () => set({ queue: [] }),

    playNext: () => {
        const { currentTrack, queue } = get();
        if (!currentTrack || queue.length === 0) return;

        const currentIndex = queue.findIndex(track => track.id === currentTrack.id);
        if (currentIndex === -1 || currentIndex === queue.length - 1) return;

        set({ currentTrack: queue[currentIndex + 1] });
    },

    playPrevious: () => {
        const { currentTrack, queue } = get();
        if (!currentTrack || queue.length === 0) return;

        const currentIndex = queue.findIndex(track => track.id === currentTrack.id);
        if (currentIndex <= 0) return;

        set({ currentTrack: queue[currentIndex - 1] });
    },
})); 