import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ChatListControlService {
  chatListControl = new FormControl();
  constructor() { }
}
