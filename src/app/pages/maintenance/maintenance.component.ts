import { MetaService } from '@ngx-meta/core';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss']
})
export class MaintenanceComponent implements OnInit {

  constructor(
    private readonly _meta: MetaService
  ) { }

  ngOnInit() {
    this._meta.setTag('og:title', 'The page is under maintenance');
  }

}
