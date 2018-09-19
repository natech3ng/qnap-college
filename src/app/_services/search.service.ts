import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable()
export class SearchService {

  @Output() search: EventEmitter<any> = new EventEmitter();

  emit(keywords: String) {
    this.search.emit(keywords);
  }
}
