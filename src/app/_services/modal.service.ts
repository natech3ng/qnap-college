import { Output, EventEmitter } from '@angular/core';
export class ModalService {

  @Output() pop: EventEmitter<any> = new EventEmitter();
  @Output() close: EventEmitter<any> = new EventEmitter();

  popModal(youtubeRef: String) {
    this.pop.emit(youtubeRef);
  }

  closeModal() {
    this.close.emit();
  }
}
