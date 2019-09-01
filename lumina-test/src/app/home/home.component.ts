import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { MoviesService } from '../movies.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  movieIds = [];
  likedMovieIds = [];
  movies = [];
  likedMovies = [];
  showLoader = true;
  userAuthenticated = false;
  private authListenerSubs: Subscription;

  constructor(private moviesService: MoviesService, private snackBar: MatSnackBar, private authService: AuthService) { }

  ngOnInit() {
    // Get user authentication status
    this.authService.autoAuthUser();
    this.userAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userAuthenticated = isAuthenticated;
    });
    if (this.userAuthenticated && localStorage.getItem('favourites') && localStorage.getItem('favourites') != '""') {
      this.likedMovieIds = JSON.parse(localStorage.getItem('favourites'));
      if (this.likedMovieIds.length == 1 && this.likedMovieIds[0] == '') {
        this.likedMovieIds = [];
      }
    }

    // Get all unique movie IDs from the database
    this.moviesService.getMovieIds().subscribe(res => {
      this.movieIds = res['data'];
      // Get data for the movie ID
      this.getMovies(this.movies, this.movieIds);
    }, err => {
      console.log(err);
      this.snackBar.open('No movies found!', 'OK', {
        duration: 4000
      });
    });
  }

  showFavourites(event) {
    if (this.userAuthenticated && event == 1) {
      // User clicked on Favourite Movies tab
      this.likedMovies = []; 
      // Get favourite movies data
      this.getMovies(this.likedMovies, this.likedMovieIds);
    }
  }

  getMovies(movies, movieIds) {
    // Fetch data for movieIds and push to movies array
    for (var i = 0; i < movieIds.length; i++) {
      this.moviesService.getMovieData(movieIds[i]).subscribe(res => {
        console.log(res);
        movies.push(res);
        if (movies.length == movieIds.length) {
          this.showLoader = false;
        }
      }, err => {
        console.log(err);
        this.snackBar.open('An error occured while getting movies', 'OK', {
          duration: 4000
        });
      });
    }
  }
}
