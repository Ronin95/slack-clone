import { Injectable, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class ThreadsService implements OnInit {
  private closeSource = new Subject<void>();
  close$ = this.closeSource.asObservable();

  constructor(private firestore: AngularFirestore) {}

  ngOnInit() {
  }

  accessCurrentChannelID() {
    console.log('Current Channel ID Accessed');
    // get current channel id from local storage
    let channelId = localStorage.getItem('selected_channelId');
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
