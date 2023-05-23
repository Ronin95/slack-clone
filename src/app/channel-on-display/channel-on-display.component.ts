import { Component, Input, OnInit } from '@angular/core';
import { ChannelService } from '../services/channel.service';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { updateDoc } from 'firebase/firestore';
import { switchMap, take } from 'rxjs';
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

  constructor(
    public channelService: ChannelService,
    private route: ActivatedRoute,
    private firestore: AngularFirestore
  ) {
    // this.messageForm = new FormGroup({ textEditor: new FormControl('') });
  }

  async sendMessage(): Promise<void> {
    if (this.messageText) {
      await this.channelService.saveMessageToFirebase(this.messageText);
      this.messageText = '';
    }
  }

  ngOnInit() {
    this.displayChannelName();
    this.channelService.getUserNameAndImgFromFirebase();
    this.setTimeStampInHTML();
  }

  setTimeStampInHTML() {
    // Get the formatted date from localStorage
    const formattedDate = localStorage.getItem('ChannelMessageDate');
    // Select the span element by its class name
    const spanElement = document.querySelector('.time-stamp');
    // Check if the span element exists and the formattedDate is not null
    if (spanElement && formattedDate) {
      // Set the span element's text content to the formatted date
      spanElement.textContent = formattedDate;
    }
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
  onPostInChannel() {
    this.channelService.postInChannel();
  }

  // sendMessage() {
  //   this.route.paramMap
  //     .pipe(
  //     switchMap((params) => {
  //       this.subscribedParam = params.get('id');
  //       return this.firestore.collection('channels').doc(this.subscribedParam).valueChanges().pipe(take(1));
  //     })
  //     )
  //     .subscribe((channel: any) => {
  //     const message = {
  //       text: this.control.value as string,
  //       timestamp: new Date(),
  //     };
  //     const channelRef: AngularFirestoreDocument<any> = this.firestore
  //       .collection('channels')
  //       .doc(this.subscribedParam);

  //     updateDoc(channelRef.ref, {
  //       channelChat: [...channel.channelChat, message],
  //     })
  //       .then(() => {
  //       console.log('Nachricht gesendet und gespeichert.');
  //       })
  //       .catch((error) => {
  //       console.error('Fehler beim Speichern der Nachricht:', error);
  //       });
  //     });
  // }
}
