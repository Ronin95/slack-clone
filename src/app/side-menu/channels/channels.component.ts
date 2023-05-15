import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogNewChannelComponent } from './dialog-new-channel/dialog-new-channel.component';
import {
  Firestore,
  collection,
  collectionData,
  deleteDoc,
  doc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Channel } from '../../../models/channels.model';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.scss'],
})
export class ChannelsComponent implements OnInit {
  firestore: Firestore = inject(Firestore);
  channels$!: Observable<any>;
  channel!: Array<any>;
  channelId!: any;
  openMenu: boolean = false;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private afs: AngularFirestore
  ) {}

  ngOnInit() {
    this.getAllChannels();
  }

  toggleChannels() {
    this.openMenu = !this.openMenu;
  }

  openDialogNewChannel() {
    this.dialog.open(DialogNewChannelComponent);
  }

  openChannel() {
    // the 'zNE6IVa1wqp4I76WgdSr' has to be replaced with the id of the channel
    // this.router.navigateByUrl('channel/' + 'zNE6IVa1wqp4I76WgdSr');
    console.log('Open');
  }

  getAllChannels() {
    const channelColl = collection(this.firestore, 'channels');
    this.channels$ = collectionData(channelColl, { idField: 'channelId' });
    this.channels$.subscribe((changes: any) => {
      this.channel = changes;
      console.log(this.channel);
    });
  }

  deleteChannel(channelId: any) {
    const channelColl = collection(this.firestore, 'channels');
    const docRef = doc(channelColl, channelId);
    deleteDoc(docRef);
  }
}
