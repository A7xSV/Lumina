import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private userId: string;
  private authStatusListener = new Subject<boolean>();
  likedMovies = [];
  
  constructor(private http: HttpClient, private router: Router, private snackBar: MatSnackBar) { }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  onSignup(signupParams) {
    this.http.post('http://localhost:3000/user/signup', signupParams).subscribe((res) => {
        this.snackBar.open('Signup Successful!', 'Close', {
          duration: 4000
        });
        console.log(res);
        this.onLogin({email: signupParams.email, password: signupParams.password});
      }, err => {
        this.snackBar.open('Signup failed', 'Close', {
          duration: 4000
        });
        if (this.router.url == '/auth') {
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
              this.router.navigate(['/auth']));
        }
        this.authStatusListener.next(false);
    });
  }

  onLogin(loginParams) {
    this.http.post<{ token: string; expiresIn: number; userId: string, firstName: string, lastName: string, favourites: string[] }>('http://localhost:3000/user/login', loginParams).subscribe((res) => {
      console.log(res);
      const token = res.token;
      this.token = token;
      if (token) {
        const expiresInDuration = res.expiresIn;
        this.setAuthTimer(expiresInDuration);
        this.isAuthenticated = true;
        this.userId = res.userId;
        
        const now = new Date();
        const expirationDate = new Date(
          now.getTime() + expiresInDuration * 1000
        );
        console.log(expirationDate);

        this.likedMovies = res.favourites;

        this.saveAuthData(token, expirationDate, this.userId, res.firstName, res.lastName, res.favourites);
        this.authStatusListener.next(true);
        // this.router.navigate(['/']);
        this.router.navigateByUrl('/auth', { skipLocationChange: true }).then(() =>
          this.router.navigate(['/']));
        this.snackBar.open('Logged in! You can now see and add favourites', 'Close', {
          duration: 4000
        });
      }
    }, err => {
      console.log(err);
      this.snackBar.open(err.error['error'], 'Close', {
        duration: 4000
      });
      if (this.router.url == '/auth') {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
            this.router.navigate(['/auth']));
      }
      this.authStatusListener.next(false);
    });
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  onLogout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigateByUrl('/auth', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/']));
  }

  private setAuthTimer(duration: number) {
    // console.log('Setting timer: ' + duration);
    this.tokenTimer = setTimeout(() => {
      this.onLogout();
    }, duration * 1000);
  }
  
  private saveAuthData(token: string, expirationDate: Date, userId: string, firstName: string, lastName: string, favourites: string[]) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("userId", userId);
    localStorage.setItem("firstName", firstName);
    localStorage.setItem("lastName", lastName);
    localStorage.setItem("favourites", JSON.stringify(favourites));
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    localStorage.removeItem("favourites");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    };
  }
}
