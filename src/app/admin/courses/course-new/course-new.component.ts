import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-course-new',
  templateUrl: './course-new.component.html',
  styleUrls: ['./course-new.component.scss']
})
export class CourseNewComponent implements OnInit {

  app = 'add course';

  constructor() { }

  ngOnInit() {
  }

}
