import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class MessageService {
  onMessageAdd: EventEmitter<Object> = new EventEmitter<Object>();
  onCompanyDetailsChange: EventEmitter<Object> = new EventEmitter<Object>();
  getMessages() {
    return this.onMessageAdd;
  }

  addMessage(value: Object) {
    this.onMessageAdd.emit(value);
  }

  getCompanyDetails() {
    return this.onCompanyDetailsChange;
  }

  updateCompanyDetails(value: Object) {
    this.onCompanyDetailsChange.emit(value);
  }

}
