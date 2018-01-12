import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class MessageService {
  onMessageAdd: EventEmitter<Object> = new EventEmitter<Object>();

  getMessages() {
    return this.onMessageAdd;
  }

  addMessage(value: Object) {
    this.onMessageAdd.emit(value);
  }
}
