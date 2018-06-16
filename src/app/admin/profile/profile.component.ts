import { OnInit, AfterViewInit, OnDestroy, Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit, AfterViewInit, OnDestroy {

  app = 'profile';
  ngOnInit() {}

  ngAfterViewInit() {}

  ngOnDestroy() {}
}
