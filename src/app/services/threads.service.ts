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

  closeThread() {
    this.closeSource.next();
  }

  accessSelectedMessage() {
    console.log('Selected Message Accessed');
    // Retrieve IDs from local storage
    const selected_channelID = localStorage.getItem('selected_channelID');
    const selected_messageID = localStorage.getItem('selected_messageID');

    // Check if IDs are null
    if (!selected_channelID || !selected_messageID) {
      console.error('selected_ChannelID or selected_messageID is null');
      return;
    }

    // Fetch the message from Firestore and log its date
    this.firestore.collection('channels').doc(selected_channelID).collection('ChannelChat').doc(selected_messageID).valueChanges()
    .subscribe(message => {
      if (message && 'date' in message) {
        console.log(message['date']);
      } else {
        console.error('message is undefined or does not contain a date');
      }
      }, error => console.log(error));
    }
}
