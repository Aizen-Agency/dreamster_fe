export interface Artist {
    id: string;
    name: string;
    username: string;
}

export interface Track {
    id: string;
    title: string;
    description?: string;
    genre?: string;
    tags?: string[];
    starting_price?: number;
    exclusive?: boolean;
    duration?: number;
    stream_count?: number;
    likes?: number;
    comments?: number;
    views?: number;
    shares?: number;
    created_at: string;
    artwork_url?: string;
    audio_url?: string;
    artist: Artist;
    approved: boolean;
    status: string
}

export interface TrackListResponse {
    tracks: Track[];
    total: number;
    pages: number;
    current_page: number;
}

export interface StreamResponse {
    stream_url: string;
    track_id: string;
    duration: number;
    file_format: string;
    file_size_mb: number;
    content_type: string;
}

export interface TrackListParams {
    page?: number;
    per_page?: number;
    genre?: string;
    sort_by?: 'popular' | 'newest' | 'created_at';
} 