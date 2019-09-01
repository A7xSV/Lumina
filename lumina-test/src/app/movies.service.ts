import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const baseUrl = 'http://localhost:3000';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  constructor(private http: HttpClient) { }

  getMovieIds() {
    // Get all movies in database
    return this.http.get(baseUrl + '/movies');
  }

  getMovieData(id) {
    // Get movie data for id from OMDB api
    return this.http.get(baseUrl + '/movieData?id=' + id);
  }

  getMovieTrailer(id) {
    // Get movie trailer from myapifilms api for movie id
    // const dummyUrl = 'https://cors-anywhere.herokuapp.com/'; // Prepend to baseUrl for a CORS issue workaround
    return this.http.get(baseUrl + '/movieTrailer?id=' + id);
  }

  putFavourites(movies, userId) {
    // Update favourite_movies in the database
    localStorage.setItem("favourites", JSON.stringify(movies));
    return this.http.put(baseUrl + '/favourites', {favourites: movies, userId: userId});
  }
}
