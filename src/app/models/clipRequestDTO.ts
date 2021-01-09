

export class Clip {
    id: string;
    url: string;
    embed_url: string;
    broadcaster_id: string;
    broadcaster_name: string;
    creator_id: string;
    creator_name: string;
    video_id: string;
    game_id: string;
    language: string;
    title: string;
    view_count: number;
    created_at: Date;
    thumbnail_url: string;

  constructor(
    id: string, 
    url: string, 
    embed_url: string, 
    broadcaster_id: string, 
    broadcaster_name: string, 
    creator_id: string, 
    creator_name: string, 
    video_id: string, 
    game_id: string, 
    language: string, 
    title: string, 
    view_count: number, 
    created_at: Date, 
    thumbnail_url: string
) {
    this.id = id
    this.url = url
    this.embed_url = embed_url
    this.broadcaster_id = broadcaster_id
    this.broadcaster_name = broadcaster_name
    this.creator_id = creator_id
    this.creator_name = creator_name
    this.video_id = video_id
    this.game_id = game_id
    this.language = language
    this.title = title
    this.view_count = view_count
    this.created_at = created_at
    this.thumbnail_url = thumbnail_url
  }

}

export class Pagination {
    cursor: string;

    constructor(cursor: string) {
        this.cursor = cursor
    }  
}

export class clipRequestDTO {
    data: Clip[];
    pagination: Pagination;

    constructor(data: Clip[], pagination: Pagination) {
        this.data = data
        this.pagination = pagination
    }
}


