import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../auth.service';
import { MatDialogConfig, MatDialog, MatBottomSheet } from '@angular/material';
import { MovieDialogComponent } from '../movie-dialog/movie-dialog.component';
import { Subscription } from 'rxjs';
import { MoviesService } from '../movies.service';
import { AuthPopupComponent } from '../auth/auth-popup/auth-popup.component';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css']
})
export class MoviesComponent implements OnInit {
  @Input() movies;
  @Input() likedMovieIds;
  @Input() showLoader;
  userAuthenticated = false;
  private authListenerSubs: Subscription;

  constructor(private authService: AuthService, private bottomSheet: MatBottomSheet, private dialog: MatDialog, private moviesService: MoviesService) { }

  ngOnInit() {
    // Get user authentication status
    this.authService.autoAuthUser();
    this.userAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userAuthenticated = isAuthenticated;
    });
  }

  isLiked(movie) {
    // Add coloured favourite icon if movie.imdbID is in likedMovieIds
    if (this.likedMovieIds.indexOf(movie.imdbID) != -1) {
      return true;
    }
    return false;
  }

  toggleLike(movie, isLiked) {
    // Toggle movie favourite status
    if (!this.userAuthenticated) {
      // If logged out user, show popup to login/register
      this.bottomSheet.open(AuthPopupComponent);
      return;
    }

    // console.log(this.likedMovieIds);
    // console.log(movie.imdbID);
    if (isLiked) {
      this.likedMovieIds.splice(this.likedMovieIds.indexOf(movie.imdbID), 1);
    }
    else {
      this.likedMovieIds.push(movie.imdbID);
    }

    const userId = this.authService.getUserId();
    this.moviesService.putFavourites(this.likedMovieIds, userId).subscribe(res => {
      console.log(res);
    });
  }

  onViewMore(movie) {
    // Show movie trailer in a dialog
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      movieData: movie
    };
    dialogConfig.height = '600px';
    dialogConfig.width = '800px';
    this.dialog.open(MovieDialogComponent, dialogConfig);
  }
}
