import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { MoviesService } from '../movies.service';

@Component({
  selector: 'app-movie-dialog',
  templateUrl: './movie-dialog.component.html',
  styleUrls: ['./movie-dialog.component.css']
})
export class MovieDialogComponent implements OnInit {
  movie;
  trailerUrl = '';
  showLoader = true;

  constructor(private dialogRef: MatDialogRef<MovieDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private moviesService: MoviesService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    console.log('Opened dialog');
    this.movie = this.data.movieData;
    console.log(this.movie);
    this.moviesService.getMovieTrailer(this.movie.imdbID).subscribe(res => {
      console.log(res);
      const trailers = res['data'].movies[0].trailer.qualities;
      if (!trailers) {
        this.closeDialog();
        return;
      }
      for (var i = 0; i < trailers.length; i++) {
        if (trailers[i].quality == '720p' || trailers[i].quality == '1080p') {
          this.trailerUrl = trailers[i].videoURL;
          this.showLoader = false;
          return;
        }
      }
      if (this.trailerUrl == '' && trailers.length > 0) {
        this.trailerUrl = trailers[0].videoURL;
      } 
      else {
        this.closeDialog();
      }
      this.showLoader = false;
    }, err => {
      console.log(err);
      this.closeDialog();
    });
  }

  closeDialog() {
    this.snackBar.open('Trailer not available', 'OK', {
      duration: 4000
    });
    this.dialogRef.close();
  }
}
