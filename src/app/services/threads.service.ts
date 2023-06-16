import { Injectable, OnInit } from '@angular/core';
import { Observable, Subject, map, of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { DomSanitizer } from '@angular/platform-browser';


@Injectable({
  providedIn: 'root'
})
export class ThreadsService implements OnInit {
  private closeSource = new Subject<void>();
  close$ = this.closeSource.asObservable();

  constructor(private firestore: AngularFirestore, private sanitizer: DomSanitizer) {}

  ngOnInit() {
  }

  closeThread() {
    this.closeSource.next();
  }

  stripHtmlTags(str: string): string {
    // Create a new DOM div element
    const tmp = document.createElement('div');
    // Set its HTML to the string
    tmp.innerHTML = str;
    // Return the cleaned text
    return tmp.textContent || tmp.innerText || '';
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
    return this.firestore.collection('channels').doc(selected_channelID).collection('ChannelChat').doc(selected_messageID).valueChanges()
      .pipe(map(message => {
        // Check if message exists
        if (message) {
          // Sanitize message text
          message['message'] = this.stripHtmlTags(message['message']);
        }
        return message;
      }));
  }
  


}
