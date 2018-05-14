import { AuthService } from './../../auth/_services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  app = 'dashboard';
  constructor(private _authService: AuthService) { }

  ngOnInit() {
  }
}
