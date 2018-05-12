import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  signing: boolean;

  ngOnInit() {
    this.signing = false;
  }
  onSignin(f: NgForm) {
    this.signing = true;
    console.log(f);
  }
}
