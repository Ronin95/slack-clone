import { Injectable, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ThreadsService implements OnInit {
  private closeSource = new Subject<void>();
  close$ = this.closeSource.asObservable();

  constructor() {}

  ngOnInit() {
  }

  getCurrentChannelID() {
    console.log('Current Channel ID Accessed');
  }
  
  getCurrentThreadID() {
    console.log('Current Thread ID Accessed');
  }

  closeThread() {
    this.closeSource.next();
  }
  
  accessSelectedMessage() {
    console.log('Selected Message Accessed');
  }
}
