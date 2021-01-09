export class Game {
  id: string;
  name: string;
  box_art_url: string;

  constructor(id: string, name: string, box_art_url: string) {
    this.id = id;
    this.name = name;
    this.box_art_url = box_art_url;
  }
}

export class Pagination {
  cursor: string;

  constructor(cursor: string) {
    this.cursor = cursor;
  }
}

export class GamesRequestDTO {
  data: Game[];
  pagination: Pagination;


  constructor(data: Game[], pagination: Pagination) {
    this.data = data
    this.pagination = pagination
  }

}
