import { Injectable, OnInit } from '@angular/core';
import { Observable, Subject, map, of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ChannelService } from './channel.service';
import { collection } from '@angular/fire/firestore';
import { getDocs, getFirestore } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class ThreadsService implements OnInit {
  private closeSource = new Subject<void>();
  firestoreDB: any = getFirestore();
  close$ = this.closeSource.asObservable();
  foundUser!: any;
  name!: string;
  photoURL!: string;

  constructor(
    private firestore: AngularFirestore,
    private channelService: ChannelService
  ) {}

  ngOnInit() {}

  /**
   * The `closeThread()` method is used to emit a signal that indicates that the thread should be closed. It calls the
   * `next()` method on the `closeSource` subject, which emits a value to all subscribers of the `close$` observable. This
   * can be used to trigger any necessary actions when the thread is closed.
   *
   * @method
   * @name closeThread
   * @kind method
   * @memberof ThreadsService
   * @returns {void}
   */
  closeThread() {
    this.closeSource.next();
  }

  /**
   * The `stripHtmlTags` method is used to remove HTML tags from a given string. It takes a string as input and returns a new
   * string with all HTML tags removed. It does this by creating a temporary DOM div element, setting its HTML to the input
   * string, and then retrieving the text content of the div element, which does not include any HTML tags.
   *
   * @method
   * @name stripHtmlTags
   * @kind method
   * @memberof ThreadsService
   * @param {string} str
   * @returns {string}
   */
  stripHtmlTags(str: string): string {
    // Create a new DOM div element
    const tmp = document.createElement('div');
    // Set its HTML to the string
    tmp.innerHTML = str;
    // Return the cleaned text
    return tmp.textContent || tmp.innerText || '';
  }

  /**
   * The `retrieveFromLocalStorage()` method is used to retrieve the selected channel ID and selected message ID from the
   * local storage. It checks if the IDs are null and returns them as an object if they are not null. If either of the IDs is
   * null, it logs an error message and returns null.
   *
   * @method
   * @name retrieveFromLocalStorage
   * @kind method
   * @memberof ThreadsService
   * @returns {{ selected_channelID: string; selected_messageID: string; } | null}
   */
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

  /**
   * The `accessSelectedMessage()` method is used to retrieve a specific message from Firestore. It first retrieves the
   * selected channel ID and selected message ID from local storage. If either of these IDs is null, it returns an empty
   * observable. If the IDs are not null, it constructs the path to the specific message in Firestore and retrieves it using
   * the `valueChanges()` method. It then sanitizes the message text by removing any HTML tags and returns the message as an
   * observable.
   *
   * @method
   * @name accessSelectedMessage
   * @kind method
   * @memberof ThreadsService
   * @returns {Observable<any>}
   */
  accessSelectedMessage(): Observable<any> {
    const ids = this.retrieveFromLocalStorage();
    if (!ids) {
      // If ids are null, handle this scenario (perhaps by returning an empty Observable)
      return of({});
    }
    let { selected_channelID, selected_messageID } = ids;

    // Fetch the message from Firestore and return the Observable
    return this.firestore
      .collection('channels')
      .doc(selected_channelID)
      .collection('ChannelChat')
      .doc(selected_messageID)
      .valueChanges()
      .pipe(
        map((message) => {
          // Check if message exists
          if (message) {
            // Sanitize message text
            message['message'] = this.stripHtmlTags(message['message']);
          }
          return message;
        })
      );
  }

  /**
   * The `checkIfChannelChatThreadExists` method is used to check if a specific channel chat thread exists in Firestore. It
   * takes a `messageId` as input and returns an observable of type boolean.
   *
   * @method
   * @name checkIfChannelChatThreadExists
   * @kind method
   * @memberof ThreadsService
   * @param {string} messageId
   * @returns {Observable<boolean>}
   */
  checkIfChannelChatThreadExists(messageId: string): Observable<boolean> {
    const selected_channelID = localStorage.getItem('selected_channelID');
    if (!selected_channelID || !messageId) {
      // If either ID is null, return false
      return of(false);
    }

    // Construct the path to the possible ChannelChatThread collection
    const path = `channels/${selected_channelID}/ChannelChat/${messageId}/ChannelChatThread`;

    // Try to get the collection
    const collectionRef = this.firestore.collection(path);
    return collectionRef
      .snapshotChanges()
      .pipe(map((actions) => actions.length > 0));
  }

  /**
   * The `async accessUserData()` method is retrieving user data from the Firestore database. It first creates a reference to
   * the "users" collection in Firestore. Then, it retrieves all the documents in the collection using the `getDocs()`
   * function. It also retrieves the user ID from the local storage.
   *
   * @async
   * @method
   * @name accessUserData
   * @kind method
   * @memberof ThreadsService
   * @returns {Promise<void>}
   */
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

  /**
   * The `async sendMessageToThread(messageText: string): Promise<void>` method is used to send a message to a specific
   * thread in Firestore.
   *
   * @async
   * @method
   * @name sendMessageToThread
   * @kind method
   * @memberof ThreadsService
   * @param {string} messageText
   * @returns {Promise<void>}
   */
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

    // Remove <img> tags from the message
    const sanitizedMessage = this.channelService.removeImgTag(messageText);

    // Create a new document in the ChannelChatThread collection with your own ID
    this.firestore
      .collection(path)
      .doc(threadId)
      .set({
        threadId: threadId,
        message: sanitizedMessage,
        date: new Date(),
        userName: this.name,
        userPhotoURL: this.photoURL,
        uploadedImgURL: localStorage.getItem('lastImageUpload'),
      });

    // Delete the uploaded Image from localStorage
    localStorage.removeItem('lastImageUpload');
  }

  /**
   * The `fetchThreadMessages()` method is used to retrieve the messages from a specific thread in Firestore. It first
   * retrieves the selected channel ID and selected message ID from local storage. If either of these IDs is null, it returns
   * an empty observable array. If the IDs are not null, it constructs the path to the specific thread in Firestore and
   * retrieves the messages using the `snapshotChanges()` method. It then maps the retrieved data to an array of objects,
   * sanitizes the message text by removing any HTML tags, and returns the array as an observable.
   *
   * @method
   * @name fetchThreadMessages
   * @kind method
   * @memberof ThreadsService
   * @returns {Observable<any[]>}
   */
  fetchThreadMessages() {
    // Retrieve IDs from local storage
    const ids = this.retrieveFromLocalStorage();
    if (!ids) {
      // If ids are null, handle this scenario by returning an empty Observable array
      return of([]);
    }
    let { selected_channelID, selected_messageID } = ids;

    // Access the specific collection
    const collection = this.firestore
      .collection('channels')
      .doc(selected_channelID)
      .collection('ChannelChat')
      .doc(selected_messageID)
      .collection('ChannelChatThread', (ref) => ref.orderBy('date', 'asc')); // Order by date in ascending order

    return collection.snapshotChanges().pipe(
      map((actions) =>
        actions.map((a) => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          // Check if message exists
          if (data.message) {
            // Sanitize message text
            data.message = this.stripHtmlTags(data.message);
          }
          return { id, ...data };
        })
      )
    );
  }
}
