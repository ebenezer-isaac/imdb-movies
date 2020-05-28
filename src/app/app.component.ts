import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireDatabase } from '@angular/fire/database'
import { Movie } from './movie'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  title = 'IMDB Movies';
  currentYear = 0;
  page_count = 0;
  paginate_count = 0;
  total_count = 0;
  filterForm: FormGroup;
  movies: Movie[];
  filteredMovies: Movie[];
  @ViewChild('fform') feedbackFormDirective;

  constructor(db: AngularFireDatabase, private filter: FormBuilder) {
    this.filterForm = this.filter.group({
      search: [''], rating: [70], year: [1915],
      comedy: false, scifi: false, horror: false, romance: false,
      action: false, thriller: false, drama: false, mystery: false,
      crime: false, animation: false, adventure: false, fantasy: false,
      superhero: false, documentary: false,
    });
    let d = new Date();
    this.currentYear = d.getFullYear();
    db.list('/-M68gRLBtsTS4L7rtosp').valueChanges().subscribe(data => {
      data.sort((a, b) => (a["rating"] > b["rating"] ? -1 : 1));
      this.movies = [];
      for (var i = 0; i <= data.length - 1; i++) {
        var movie: Movie = new Movie(i, data[i]);
        this.movies.push(movie);
      }
      this.total_count = 100;
      this.filteredMovies = this.movies;
      this.filterForm.valueChanges.subscribe(data => {
        this.filterMovies(data);
      })
    })
  }

  filterMovies(filterForm: FormGroup) {
    this.filteredMovies = [];
    this.movies.forEach(movie => {
      if (movie.checkRating(filterForm["rating"])
        && movie.checkYear(filterForm["year"])
        && movie.search(filterForm["search"])
        && movie.matchGenres(this.extractSelectedGenres(filterForm))) {
        this.filteredMovies.push(movie);
      }
    });
    this.page_count = 0;
    this.total_count = this.calcTotalPage();
  }

  extractSelectedGenres(filterCopy: FormGroup): string[] {
    let keys = Object.keys(filterCopy);
    let selected = []
    keys.forEach(key => {
      if (filterCopy[key] == true) {
        selected.push(key);
      }
    });
    return selected;
  }

  calcTotalPage(): number {
    let temp = Math.round(this.filteredMovies.length / 50);
    while (this.filteredMovies.length > temp * 50) {
      temp++;
    }
    return temp;
  }

  formatRating(value: number) {
    return value / 10;
  }

  paginate(page_count: number) {
    let pagedMovies: Movie[] = [];
    for (var i = 0 + (50 * page_count); i <= 49 + (50 * page_count); i++) {
      if (this.filteredMovies[i]) {
        pagedMovies.push(this.filteredMovies[i]);
      }
    }
    this.paginate_count = pagedMovies.length;
    return pagedMovies;
  }

  nextPage() {
    this.page_count = this.page_count + 1;
  }

  prevPage() {
    this.page_count = this.page_count - 1;
  }

  page_change(page: number) {
    this.page_count = page - 1;
  }

}

function popper(array: string[], item: string): string[] {
  var index = array.indexOf(item);
  if (index !== -1) array.splice(index, 1);
  return array;
}