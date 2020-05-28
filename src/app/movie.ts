export class Movie {

    id: number;
    actors: string[];
    desc: string;
    director: string;
    genres: string[];
    image: string;
    rating: number;
    runtime: string;
    shortTitle: string;
    title: string;
    year: number;

    constructor(id: number, movie: Object) {
        this.id = id;
        this.actors = movie["actors"];
        this.desc = movie["desc"];
        this.director = movie["director"];
        this.genres = movie["genre"];
        this.image = movie["image"];
        this.rating = movie["rating"];
        this.runtime = movie["runtime"];
        this.title = movie["title"];
        this.shortTitle = this.title;
        this.year = movie["year"];
        if (this.shortTitle.length > 15 && window.screen.width === 360) {
            this.shortTitle = this.shortTitle.substring(0, 12) + "...";
        }
    }

    public search(search_text: string): boolean {
        let result = false;
        let texts: string[] = search_text.toLowerCase().split(" ");
        texts.forEach(text => {
            if (this.title !== undefined && this.title !== null) {
                if (this.title.toLowerCase().search(text) != -1) {
                    result = true;
                    return result;
                }
            }
            if (this.director !== undefined && this.director !== null) {
                if (this.director.toLowerCase().search(text) != -1) {
                    result = true;
                    return result;
                }
            }
            if (this.desc !== undefined && this.desc !== null) {
                if (this.desc.toLowerCase().search(text) != -1) {
                    result = true;
                    return result;
                }
            }
            if (this.actors !== undefined && this.actors !== null) {
                this.actors.forEach(actor => {
                    if (text.indexOf(actor) != -1) {
                        result = true;
                        return result;
                    }
                });
            }
        });
        return result;
    }

    public checkYear(minYear: number): boolean {
        if (minYear <= this.year) {
            return true;
        } else {
            return false;
        }
    }

    public checkRating(minRating: number): boolean {
        let rating = parseInt((this.rating * 10).toFixed(1));
        if (minRating <= rating) {
            return true;
        } else {
            return false;
        }
    }

    public matchGenres(data: string[]): boolean {
        let max_true_genre = data.length;
        let true_genre_count = 0;
        data.forEach(dt => {
            this.genres.forEach(element => {
                if (dt.indexOf(element.toLowerCase().replace("-", "")) != -1) {
                    true_genre_count++;
                    return;
                }
            });
        });
        if (max_true_genre == true_genre_count) {
            return true;
        } else {
            return false;
        }
    }
}
