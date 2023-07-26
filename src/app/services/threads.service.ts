import { Injectable, OnInit } from '@angular/core';
import { Observable, Subject, map, of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ChannelService } from './channel.service';
import { collection } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getDocs, getFirestore } from 'firebase/firestore';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root'
})
export class ThreadsService implements OnInit {
  private closeSource = new Subject<void>();
  firestoreDB: any = getFirestore();
  close$ = this.closeSource.asObservable();
  foundUser!: any;
  uploadedImgURL: string = '';
  name!: string;
	photoURL!: string;

  constructor(
    private firestore: AngularFirestore,
    private channelService: ChannelService,
  ) {}

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

  retrieveFromLocalStorage() {
    // Retrieve IDs from local storage
    const selected_channelID = localStorage.getItem('selected_channelID');
    const selected_messageID = localStorage.getItem('selected_messageID');

    // Check if IDs are null
    if (!selected_channelID || !selected_messageID) {
      console.error('selected_ChannelID or selected_messageID is null');
      return null;
    }

    // return as an object
    return { selected_channelID, selected_messageID };
  }

  accessSelectedMessage(): Observable<any> {
    const ids = this.retrieveFromLocalStorage();
    if (!ids) {
      // If ids are null, handle this scenario (perhaps by returning an empty Observable)
      return of({});
    }
    let {selected_channelID, selected_messageID} = ids;

    // Fetch the message from Firestore and return the Observable
    return this.firestore
      .collection('channels')
      .doc(selected_channelID)
      .collection('ChannelChat')
      .doc(selected_messageID)
      .valueChanges()
      .pipe(map(message => {
        // Check if message exists
        if (message) {
          // Sanitize message text
          message['message'] = this.stripHtmlTags(message['message']);
        }
        return message;
      }));
  }

  checkIfChannelChatThreadExists(messageId: string): Observable<boolean> {
    const selected_channelID = localStorage.getItem('selected_channelID');
    console.log('selected Message Id is: ' ,messageId);
    if (!selected_channelID || !messageId) {
        // If either ID is null, return false
        return of(false);
    }

    // Construct the path to the possible ChannelChatThread collection
    const path = `channels/${selected_channelID}/ChannelChat/${messageId}/ChannelChatThread`;

    // Try to get the collection
    const collectionRef = this.firestore.collection(path);
    return collectionRef.snapshotChanges().pipe(
        map(actions => actions.length > 0)
    );
}


  async accessUserData() {
    const userData = collection(this.firestoreDB, 'users');
		const docsSnap = await getDocs(userData);
		const getUIDFromLocalStorage = localStorage.getItem('loggedInUser');
		const getArrayForm = docsSnap.docs.map((doc) => doc.data());
		for (let i = 0; i < getArrayForm.length; i++) {
			if (getArrayForm[i]['uid'] === getUIDFromLocalStorage?.slice(1, -1)) {
				this.foundUser = getArrayForm[i];
				break;
			}
		}
		if (this.foundUser !== null) {
			this.name = this.foundUser['displayName'];
			this.photoURL = this.foundUser['photoURL'];
		}
  }

  async sendMessageToThread(messageText: string): Promise<void> {
    // Get the user's name and image from Firebase
    await this.accessUserData();
    const ids = this.retrieveFromLocalStorage();
    // Check if IDs are null
    if (!ids) {
      console.error('Cannot send message: IDs are null');
      return;
    }
    const { selected_channelID, selected_messageID } = ids;
    // Construct the path to the new collection
    const path = `channels/${selected_channelID}/ChannelChat/${selected_messageID}/ChannelChatThread`;
    // Create a unique ID for the message
    const threadId = this.firestore.createId();
    const date = new Date();
    const formattedDate = this.channelService.getFormattedDate(date);
    // Create a new document in the ChannelChatThread collection with your own ID
    this.firestore.collection(path).doc(threadId).set({
      threadId: threadId,
      message: messageText,
      date: formattedDate,
      userName: this.name,
      userPhotoURL: this.photoURL,
      uploadedImgURL: this.uploadedImgURL,
    })
      .then(() => console.log('Message sent!'))
      .catch(err => console.error('Error sending message: ', err));

    // Reset the uploadedImgURL
    this.uploadedImgURL = '';
  }

  fetchThreadMessages() {
    // Retrieve IDs from local storage
    const ids = this.retrieveFromLocalStorage();
    if (!ids) {
      // If ids are null, handle this scenario by returning an empty Observable array
      return of([]);
    }
    let {selected_channelID, selected_messageID} = ids;

    // Access the specific collection
    const collection = this.firestore.collection('channels').doc(selected_channelID).collection('ChannelChat').doc(selected_messageID).collection('ChannelChatThread');

    return collection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        // Check if message exists
        if (data.message) {
          // Sanitize message text
          data.message = this.stripHtmlTags(data.message);
        }
        return { id, ...data };
      }))
    );
  }
}
