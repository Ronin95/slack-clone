import { Injectable, OnInit, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
	Firestore,
	collection,
	collectionData,
	deleteDoc,
	doc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class ChannelService {
  firestore: Firestore = inject(Firestore);
  channels$!: Observable<any>;
  channel!: Array<any>;
  channelId!: any;

  constructor(private afs: AngularFirestore) {}

  getAllChannels(): Observable<any> {  // Return type is now Observable<any>
    const channelColl = collection(this.firestore, 'channels');
    this.channels$ = collectionData(channelColl, { idField: 'channelId' });
    this.channels$.subscribe((changes: any) => {
      this.channel = changes;
      console.log(this.channel);
    });
    return this.channels$;  // Return the Observable
  }

  deleteChannel(channelId: any) {
    const channelColl = collection(this.firestore, 'channels');
    const docRef = doc(channelColl, channelId);
    deleteDoc(docRef);
  }
}

