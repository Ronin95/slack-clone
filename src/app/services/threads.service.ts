import { Injectable, OnInit } from '@angular/core';
import { Observable, Subject, Subscription, of } from 'rxjs';
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

  closeThread() {
    this.closeSource.next();
  }

  accessSelectedMessage(): Observable<any> {
    // Retrieve IDs from local storage
    const selected_channelID = localStorage.getItem('selected_channelID');
    const selected_messageID = localStorage.getItem('selected_messageID');

    // Check if IDs are null
    if (!selected_channelID || !selected_messageID) {
      console.error('selected_ChannelID or selected_messageID is null');
      return of(null); // return an Observable of null
    }

    // Fetch the message from Firestore and return the Observable
    return this.firestore.collection('channels').doc(selected_channelID).collection('ChannelChat').doc(selected_messageID).valueChanges();
  }


}
