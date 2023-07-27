import { Injectable, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  Firestore,
  collection,
  collectionData,
  deleteDoc,
  doc,
} from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getDocs, getFirestore } from 'firebase/firestore';
import {
  Observable,
  Subscription,
  take,
  firstValueFrom,
  map,
  Subject,
  BehaviorSubject,
  of,
} from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class ChannelService implements OnInit {
  imageInsertedSubject: Subject<string> = new Subject<string>();
  db: any = getFirestore();
  firestore: Firestore = inject(Firestore);
  channels!: any;
  channel!: Array<any>;
  uid!: string;
  name!: string;
  photoURL!: string;
  userData!: Subscription;
  foundUser!: any; // in getUserNameAndImgFromFirebase()
  channelIDSource = new BehaviorSubject<string>('');
  currentChannelID$ = this.channelIDSource.asObservable();
  searchValue: string = '';
  isOpenThread: boolean = false;

  constructor(
    private afs: AngularFirestore,
    private storage: AngularFireStorage,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {}

  /**
   * The above code is a function definition that takes a string parameter called `channelID`. It is likely part of a larger
   * program or module and its purpose is to send the `channelID` to some other part of the program or to an external system.
   * However, without more context it is difficult to determine the exact functionality of this code.
   *
   * @method
   * @name sendChannelID
   * @kind method
   * @memberof ChannelService
   * @param {string} channelID
   * @returns {void}
   */
  sendChannelID(channelID: string) {
    this.channelIDSource.next(channelID);
    console.log(channelID);
  }

  /**
   * The above code is defining a method called `getAllChannels` that returns an Observable. The implementation of the method
   * is not shown in the code snippet.
   *
   * @method
   * @name getAllChannels
   * @kind method
   * @memberof ChannelService
   * @returns {Observable<any>}
   */
  getAllChannels(): Observable<any> {
    // Return type is now Observable<any>
    const channelColl = collection(this.firestore, 'channels');
    this.channels = collectionData(channelColl, { idField: 'channelId' });
    this.channels.subscribe((changes: any) => {
      this.channel = changes;
      // console.log(this.channel);
    });
    return this.channels; // Return the Observable
  }

  /**
   * The above code is likely part of a larger program or application and appears to be defining a function called
   * `deleteChannel` that takes in a parameter called `channelId`. The purpose of this function is not clear from the code
   * snippet alone, but it is likely that it is intended to delete a channel with the specified `channelId`.
   *
   * @method
   * @name deleteChannel
   * @kind method
   * @memberof ChannelService
   * @param {any} channelId
   * @returns {void}
   */
  deleteChannel(channelId: any) {
    const channelColl = collection(this.firestore, 'channels');
    const docRef = doc(channelColl, channelId);
    deleteDoc(docRef);
  }

  /**
   * The above code is defining a function called `onFileChange` that takes an event object as a parameter. The purpose of
   * this function is not clear from the provided code snippet alone, as the body of the function is represented by three
   * hash symbols (`
   *
   * @method
   * @name onFileChange
   * @kind method
   * @memberof ChannelService
   * @param {any} event
   * @returns {void}
   */
  channelImageUpload(event: any) {
    const file = event.target.files[0];
    let channelID = localStorage.getItem('selected_channelID');
    const filePath = `/channelImages/${channelID}/${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    // observe percentage changes
    task.percentageChanges().subscribe((percentage) => {
      console.log(percentage);
    });

    // get notified when the download URL is available
    task.snapshotChanges().subscribe((snapshot) => {
      if (snapshot && snapshot.state === 'success') {
        fileRef.getDownloadURL().subscribe((downloadURL) => {
          console.log('File available at', downloadURL);
          this.imageInsertedSubject.next(downloadURL); // Notify the component that an image has been inserted
          this.clearFileInput();
        });
      }
    });
  }

  /**
   * The above code is likely defining a function called `clearFileInput()`. The function clears the input from the
   * `fileInput` element by setting its value to an empty string.
   *
   * @method
   * @name clearFileInput
   * @kind method
   * @memberof ChannelService
   * @returns {void}
   */
  clearFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ''; // Wert des Eingabefelds zurücksetzen
    }
  }

  /**
   * `onButtonClick()` is a method in the `ChannelService` class that is triggered when a button is clicked. It retrieves the
   * HTML element with the ID "fileInput" and triggers a click event on it. This is used to open the file dialog when the
   * user clicks on a button, allowing them to select a file to upload.
   *
   * @method
   * @name onButtonClick
   * @kind method
   * @memberof ChannelService
   * @returns {void}
   */
  onButtonClick() {
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
      fileInput.click();
    } else {
      console.error('Could not find element with ID "fileInput"');
    }
  }

  /**
   * `async ChannelID(collection: string): Promise<string>` is a method in the `ChannelService` class that takes in a
   * `string` parameter `collection` and returns a `Promise` of a `string`. The method retrieves the first document ID from
   * the specified Firestore collection using the `snapshotChanges()` method and returns it as a `Promise`. If no documents
   * are found in the collection, an error is thrown.
   *
   * @async
   * @method
   * @name ChannelID
   * @kind method
   * @memberof ChannelService
   * @param {string} collection
   * @returns {Promise<string>}
   */
  async ChannelID(collection: string): Promise<string> {
    const snapshot$ = this.afs
      .collection(collection)
      .snapshotChanges()
      .pipe(take(1));
    const snapshot = await firstValueFrom(snapshot$);
    if (!snapshot || snapshot.length === 0) {
      throw new Error(`No documents found in collection: ${collection}`);
    }
    const returnChannelId = snapshot[0].payload.doc.id;
    return returnChannelId;
  }

  /**
   * `getFormattedDate(date: Date): string {` is a method in the `ChannelService` class that takes in a `Date` object as a
   * parameter and returns a formatted string representing the date and time. The method formats the date and time to display
   * the day of the week (e.g. "Mon"), the day of the month (e.g. "01"), the month (e.g. "Jan"), the year (e.g. "21"), and
   * the time in hours and minutes (e.g. "14:30"). The formatted string is returned as a `string` type.
   *
   * @method
   * @name getFormattedDate
   * @kind method
   * @memberof ChannelService
   * @param {Date} date
   * @returns {string}
   */
  getFormattedDate(date: Date): string {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const dayName = days[date.getDay()];
    const day = String(date.getDate()).padStart(2, '0');
    const month = months[date.getMonth()];
    const year = String(date.getFullYear()).slice(-2);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const formattedDate = `${dayName}, ${day}. ${month} ${year} | ${hours}:${minutes}`;
    return formattedDate;
  }

  /**
   * `async getUserNameAndImgFromFirebase()` is a method in the `ChannelService` class that retrieves the username and
   * photoURL of the currently logged-in user from Firebase Firestore. It first retrieves all the documents from the `users`
   * collection in Firestore, then loops through the documents to find the document that matches the `uid` of the currently
   * logged-in user. Once it finds the matching document, it sets the `name` and `photoURL` properties of the
   * `ChannelService` instance to the corresponding values from the document.
   *
   * @async
   * @method
   * @name getUserNameAndImgFromFirebase
   * @kind method
   * @memberof ChannelService
   * @returns {Promise<void>}
   */
  async getUserNameAndImgFromFirebase() {
    const userData = collection(this.db, 'users');
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

  /**
   * `async saveMessageToFirebase(message: string): Promise<void>` is a method in the `ChannelService` class that saves a
   * message to a specific channel in Firebase Firestore. It takes in a `message` parameter and returns a `Promise` of
   * `void`. The method first calls the `getUserNameAndImgFromFirebase()` method to get the username and photoURL of the user
   * who is posting the message. It then generates a unique ID for the message, gets the current date and time, and adds the
   * message, date, username, photoURL, and uploadedImgURL to the collection in Firestore. Finally, it resets the
   * `uploadedImgURL` property for the next upload.
   *
   * @async
   * @method
   * @name saveMessageToFirebase
   * @kind method
   * @memberof ChannelService
   * @param {string} message
   * @returns {Promise<void>}
   */
  async saveMessageToFirebase(message: string): Promise<void> {
    // Call the function to get the username and photoURL
    await this.getUserNameAndImgFromFirebase();
    // Now this.name and this.photoURL should have the username and photoURL
    const channelID = await this.ChannelID('channels');
    const channelChatRef = this.afs
      .collection('channels')
      .doc(channelID)
      .collection('ChannelChat');

    // Generate a unique ID for the message
    const messageId = this.afs.createId();

    const date = new Date();
    const formattedDate = this.getFormattedDate(date);
    // Add the message, the formatted date, username, photoURL, and uploadedImgURL to the collection
    channelChatRef.doc(messageId).set({
      messageId: messageId, // Adding the message ID to the document
      message: message,
      date: formattedDate,
      userName: this.name, // Adding username to the document
      userPhotoURL: this.photoURL, // Adding photoURL to the document
    });
  }

  /**
   * `fetchMessagesFromFirebase(channelId: string): Observable<any[]>` is a method in the `ChannelService` class that
   * retrieves messages from a specific channel in Firebase Firestore. It takes in a `channelId` parameter and returns an
   * `Observable` of an array of objects containing the messages. The messages are sorted by date from oldest to newest post.
   * The method uses the `snapshotChanges()` method to listen for changes in the Firestore collection and maps the changes to
   * an array of objects containing the message data.
   *
   * @method
   * @name fetchMessagesFromFirebase
   * @kind method
   * @memberof ChannelService
   * @param {string} channelId
   * @returns {Observable<any[]>}
   */
  fetchMessagesFromFirebase(channelId: string): Observable<any[]> {
    if (!channelId) {
      return of([]); // Return an empty observable if channelID is not set
    }

    return this.afs
      .collection('channels')
      .doc(channelId)
      .collection('ChannelChat', (ref) => ref.orderBy('date', 'asc')) // sorting by date from oldest to newest post
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }

  // this function deletes the message from the firestore database
  /**
   * The above code is defining an asynchronous function called `deleteMessageFromFirebase` that takes a string parameter
   * called `messageId`. The function likely deletes a message with the specified `messageId` from a Firebase database or
   * storage. However, without seeing the implementation of the function, it is not possible to determine the exact behavior.
   *
   * @async
   * @method
   * @name deleteMessageFromFirebase
   * @kind method
   * @memberof ChannelService
   * @param {string} messageId
   * @returns {Promise<void>}
   */
  async deleteMessageFromFirebase(messageId: string) {
    const channelId = await this.ChannelID('channels');
    const sfRef = this.afs
      .collection('channels')
      .doc(channelId)
      .collection('ChannelChat')
      .doc(messageId);
    await sfRef.delete();
  }

  /**
   * The above code is defining an asynchronous function called `getMessageId` that takes a `channelId` parameter of type
   * string and returns a Promise that resolves to a string. The implementation of the function is not provided in the code
   * snippet.
   *
   * @async
   * @method
   * @name getMessageId
   * @kind method
   * @memberof ChannelService
   * @param {string} channelId
   * @returns {Promise<string>}
   */
  async getMessageId(channelId: string): Promise<string> {
    const snapshot$ = this.afs
      .collection('channels')
      .doc(channelId)
      .collection('ChannelChat')
      .snapshotChanges()
      .pipe(take(1));
    const snapshot = await firstValueFrom(snapshot$);
    if (!snapshot || snapshot.length === 0) {
      throw new Error(`No documents found in collection: ChannelChat`);
    }
    const messageId = snapshot[0].payload.doc.id;
    return messageId;
  }

  /**
   * The above code is likely a TypeScript function that takes in an HTML string and returns a sanitized version of it as a
   * SafeHtml object. The function may also include logic to check the size of any images within the HTML and adjust them if
   * necessary to prevent any security vulnerabilities or performance issues. However, without seeing the full implementation
   * of the function, it is difficult to provide a more detailed explanation.
   *
   * @method
   * @name sanitizeHtmlWithImageSize
   * @kind method
   * @memberof ChannelService
   * @param {string} html
   * @returns {SafeHtml}
   */
  sanitizeHtmlWithImageSize(html: string): SafeHtml {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;

    const images = wrapper.querySelectorAll('img');

    images.forEach((image: HTMLImageElement) => {
      image.style.maxHeight = '200px';
    });
    const sanitizedHtml = this.sanitizer.bypassSecurityTrustHtml(
      wrapper.innerHTML
    );
    return sanitizedHtml;
  }
}
