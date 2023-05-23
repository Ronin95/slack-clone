import { Injectable, Input, OnInit, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  Firestore,
  collection,
  collectionData,
  deleteDoc,
  doc,
} from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription, finalize, switchMap, take, firstValueFrom  } from 'rxjs';
import { AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { getDocs, getFirestore, updateDoc } from 'firebase/firestore';
import { AuthService } from './auth.service';
import { FormControl } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Storage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';


@Injectable({
  providedIn: 'root',
})
export class ChannelService implements OnInit {
  db: any = getFirestore();
  firestore: Firestore = inject(Firestore);
  channels!: any;
  channel!: Array<any>;
  channelId!: any;
  subscribedParam!: any;
  @Input() control!: FormControl;
  name!: string;
  uid!: string;
  photoURL!: string;
  userData!: Subscription;
  foundUser!: any; // in getUserNameAndImgFromFirebase()
  textInput!: string;
  public file: any = [];

  constructor(
    private afs: AngularFirestore, 
    private route: ActivatedRoute, 
    private storage: AngularFireStorage
  ) {}

  ngOnInit() {}

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

  deleteChannel(channelId: any) {
    const channelColl = collection(this.firestore, 'channels');
    const docRef = doc(channelColl, channelId);
    deleteDoc(docRef);
  }

  async onFileChange(event: any) {
    const file = event.target.files[0];
    const documentId = await this.getDocumentId('channels');
    const filePath = `/channelImages/${documentId}/${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    // observe percentage changes
    task.percentageChanges().subscribe((percentage) => {
      console.log(percentage);
    });

    // get notified when the download URL is available
    task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(downloadURL => {
            console.log('File available at', downloadURL);
          });
        })
     )
    .subscribe();
  }

  async getDocumentId(collection: string): Promise<string> {
    const snapshot$ = this.afs.collection(collection).snapshotChanges().pipe(take(1));
    const snapshot = await firstValueFrom(snapshot$);
    
    if (!snapshot || snapshot.length === 0) {
      throw new Error(`No documents found in collection: ${collection}`);
    }
  
    const documentId = snapshot[0].payload.doc.id;
    return documentId;
  }
  
  

  onButtonClick() {
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
      fileInput.click();
    } else {
      console.error('Could not find element with ID "fileInput"');
    }
  }
  

  postInChannel() {
    this.getUserNameAndImgFromFirebase();
    this.getFormatedDate(new Date());
    this.saveTextInLocalStorage();
    // this.route.paramMap
    //   .pipe(
    //   switchMap((params) => {
    //     this.subscribedParam = params.get('id');
    //     debugger;
    //     return this.afs
    //       .collection('channels')
    //       .doc(this.subscribedParam)
    //       .valueChanges()
    //       .pipe(take(1));
    //   })
    //   ).subscribe((channel: any) => {
    //   const message = {
    //     text: this.control.value as string,
    //     timestamp: new Date(),
    //   };
    //   const channelRef: AngularFirestoreDocument<any> = this.afs
    //     .collection('channels')
    //     .doc(this.subscribedParam);

    //   updateDoc(channelRef.ref, {
    //     channelChat: [...channel.channelChat, message],
    //   })
    //     .then(() => {
    //     console.log('Nachricht gesendet und gespeichert.');
    //     })
    //     .catch((error) => {
    //     console.error('Fehler beim Speichern der Nachricht:', error);
    //     });
    //   });
  }

  getFormatedDate(date: Date) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dayName = days[date.getDay()];
    const day = String(date.getDate()).padStart(2, '0');
    const month = months[date.getMonth()];
    const year = String(date.getFullYear()).slice(-2);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const formattedDate = `${dayName}, ${day}. ${month} ${year} | ${hours}:${minutes}`;
    localStorage.setItem('ChannelMessageDate', formattedDate);
  }

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

  saveTextInLocalStorage() {
    const message = localStorage.setItem(
      'ChannelMessageText',
      this.control.value
    );
    console.log(message);
  }
}
