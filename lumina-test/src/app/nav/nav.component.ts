import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  firstName: string = '';
  lastName: string = '';
  
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    if (this.userIsAuthenticated) {
      console.log(localStorage.getItem('firstName'));
      this.firstName = localStorage.getItem('firstName');
      this.lastName = localStorage.getItem('lastName');
    }
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      if (this.userIsAuthenticated) {
        this.firstName = localStorage.getItem('firstName');
        this.lastName = localStorage.getItem('lastName');
      }
    });
  }

  onLogout() {
    this.authService.onLogout();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }

}
