import { Subscription } from 'rxjs';
import { Keyword } from './../../_models/keyword';
import { AuthService } from './../../auth/_services/auth.service';
import { Component, OnInit } from '@angular/core';
import { KeywordService } from '../../_services/keyword.services';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  keywords: Keyword [];
  app = 'dashboard';
  constructor(
    private _authService: AuthService,
    private _keywordService: KeywordService
  ) {
    this._keywordService.all(10).subscribe(
      (keywords: Keyword []) => {
        this.keywords = keywords;
      }
    );
  }

  ngOnInit() {
  }
}
