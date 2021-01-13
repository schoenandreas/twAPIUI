export interface Streamer {
    broadcaster_language: string;
    display_name: string;
    game_id: string;
    id: string;
    is_live: boolean;
    tag_ids: string[];
    thumbnail_url: string;
    title: string;
    started_at: any;
}

export interface Pagination {
    cursor: string;
}

export interface StreamerRequestDTO {
    data: Streamer[];
    pagination: Pagination;
}