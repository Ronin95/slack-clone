import { Injectable, OnInit, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
	Firestore,
	collection,
	collectionData,
	deleteDoc,
	doc,
} from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap, take } from 'rxjs';
import { AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { updateDoc } from 'firebase/firestore';
import { AuthService } from './auth.service';

@Injectable({
	providedIn: 'root',
})
export class ChannelService implements OnInit {
  // db: any = getFirestore();
  firestore: Firestore = inject(Firestore);
  channels!: any;
  channel!: Array<any>;
  channelId!: any;
  subscribedParam!: any;
  control: any;

  constructor(private afs: AngularFirestore, private route: ActivatedRoute,) {
  }

  ngOnInit() {
  }

  getAllChannels(): Observable<any> {  // Return type is now Observable<any>
    const channelColl = collection(this.firestore, 'channels');
    this.channels = collectionData(channelColl, { idField: 'channelId' });
    this.channels.subscribe((changes: any) => {
      this.channel = changes;
      // console.log(this.channel);
    });
    return this.channels;  // Return the Observable
  }

  deleteChannel(channelId: any) {
    const channelColl = collection(this.firestore, 'channels');
    const docRef = doc(channelColl, channelId);
    deleteDoc(docRef);
  }

  postInChannel() {
    let uid = this.getUserID(); // get user id from local storage
    console.log(uid);
    let date = this.getDate(); // get date
    console.log(date);
    // debugger;
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

  getUserID() {
    let uidFromLocalStorage = JSON.parse(window.localStorage.getItem('user') || '{}');
    return uidFromLocalStorage.uid;
  }

  getDate() {
    return new Date()
  }
}

