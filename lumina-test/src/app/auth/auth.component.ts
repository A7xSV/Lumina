import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  @Output() closePopup = new EventEmitter();
  loginFormGroup;
  signupFormGroup;
  currentStrength = 0;
  hide = true;
  showConditions = false;
  showLoader = false;

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar, private authService: AuthService) { }

  ngOnInit() {
    // Initiate forms
    this.loginFormGroup = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.signupFormGroup = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onLogin() {
    if (this.loginFormGroup.invalid) {
      return;
    }
    this.showLoader = true;
    console.log(this.loginFormGroup.value);
    this.authService.onLogin(this.loginFormGroup.value);
    this.closePopup.emit();
  }

  onStrengthChanged(strength: number) {
    // console.log('password strength = ', strength);
    if (strength != 100) {
      this.signupFormGroup.setErrors({ 'invalid': true });
    }
  }

  onSignup() {
    this.showLoader = true;
    console.log(this.signupFormGroup.value);
    this.authService.onSignup(this.signupFormGroup.value);
    this.closePopup.emit();
  }
}
