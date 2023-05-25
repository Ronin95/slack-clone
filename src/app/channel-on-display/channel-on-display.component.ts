import { Component, Input, OnInit } from '@angular/core';
import { ChannelService } from '../services/channel.service';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { updateDoc } from 'firebase/firestore';
import { Observable, switchMap, take } from 'rxjs';
import { Channel } from 'src/models/channels.model';

@Component({
  selector: 'app-channel-on-display',
  templateUrl: './channel-on-display.component.html',
  styleUrls: ['./channel-on-display.component.scss'],
})
export class ChannelOnDisplayComponent implements OnInit {
  channelArray: any[] = [];
  channelName: string = '';
  subscribedParam!: any;
  // @Input() control!: FormControl;
  // messageForm: FormGroup;
  messageText!: string;
  messages!: Observable<any[]>;

  constructor(
    public channelService: ChannelService,
    private route: ActivatedRoute,
    private firestore: AngularFirestore
  ) {
  }

  async sendMessage(): Promise<void> {
    if (this.messageText) {
      await this.channelService.saveMessageToFirebase(this.messageText);
      this.messageText = '';
    }
  }

  async ngOnInit() {
    this.displayChannelName();
    this.messages = await this.channelService.fetchMessagesFromFirebase();

  }


  displayChannelName() {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          this.subscribedParam = params.get('id');
          return this.firestore
            .collection('channels')
            .doc(this.subscribedParam)
            .valueChanges();
        })
      )
      .subscribe((channel: any) => {
        if (channel) {
          this.channelName = channel.channelName; // Annahme: Das Feld mit dem Namen ist 'channelName'
          console.log(this.channelName);
        }
      });
  }

  // sendMessage() {
  //   this.route.paramMap
  //     .pipe(
  //       switchMap((params) => {
  //         this.subscribedParam = params.get('id');
  //         return this.firestore
  //           .collection('channels')
  //           .doc(this.subscribedParam)
  //           .valueChanges()
  //           .pipe(take(1));
  //       })
  //     )
  //     .subscribe((channel: any) => {
  //       const message = {
  //         text: this.messageText, // Use "messageText" instead of "this.control.value"
  //         timestamp: new Date(),
  //       };
  //       const channelRef: AngularFirestoreDocument<any> = this.firestore
  //         .collection('channels')
  //         .doc(this.subscribedParam);
  //       channelRef
  //         .update({
  //           channelChat: [...channel.channelChat, message],
  //         })
  //         .then(() => {
  //           console.log('Message sent and saved.');
  //         })
  //         .catch((error) => {
  //           console.error('Error saving the message:', error);
  //         });
  //     });
  // }
}
