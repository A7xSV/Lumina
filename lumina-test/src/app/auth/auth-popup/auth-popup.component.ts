import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material';

@Component({
  selector: 'app-auth-popup',
  templateUrl: './auth-popup.component.html',
  styleUrls: ['./auth-popup.component.css']
})
export class AuthPopupComponent implements OnInit {

  constructor(private bottomSheetRef: MatBottomSheetRef<AuthPopupComponent>) { }

  ngOnInit() { }

  onComplete() {
    this.bottomSheetRef.dismiss();
  }
}
