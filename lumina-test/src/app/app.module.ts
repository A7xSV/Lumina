import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MatToolbarModule, MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule, MatSnackBarModule, MatTabsModule, MatInputModule, MatFormFieldModule, MatBottomSheetModule, MatProgressBarModule, MatDialogModule, MatMenuModule } from '@angular/material';

import { NavComponent } from './nav/nav.component';
import { HomeComponent } from './home/home.component';
import { AuthComponent } from './auth/auth.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatPasswordStrengthModule } from '@angular-material-extensions/password-strength';
import { AuthPopupComponent } from './auth/auth-popup/auth-popup.component';
import { MovieDialogComponent } from './movie-dialog/movie-dialog.component';
import { MoviesComponent } from './movies/movies.component';


@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    AuthComponent,
    AuthPopupComponent,
    MovieDialogComponent,
    MoviesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatPasswordStrengthModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTabsModule,
    MatInputModule,
    MatBottomSheetModule,
    MatProgressBarModule,
    MatDialogModule,
    MatMenuModule,
    MatPasswordStrengthModule
  ],
  providers: [],
  entryComponents: [AuthPopupComponent, MovieDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
