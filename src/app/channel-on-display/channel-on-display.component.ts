import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChannelService } from '../services/channel.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, switchMap, Subscription } from 'rxjs';
import { Editor, Toolbar } from 'ngx-editor';
import { ThreadsService } from '../services/threads.service';

@Component({
  selector: 'app-channel-on-display',
  templateUrl: './channel-on-display.component.html',
  styleUrls: ['./channel-on-display.component.scss'],
})
export class ChannelOnDisplayComponent implements OnInit, OnDestroy {
  imageInsertedSubscription!: Subscription;
  showThreadContainer = false;
  private closeSub!: Subscription;
  channelArray: any[] = [];
  channelName: string = '';
  subscribedParam!: any;
  messageText: string = '';
  messages!: Observable<any[]>;
  messages$!: Observable<any[]>;
  data = '';
  editor!: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic', 'underline', 'strike', 'code', 'blockquote'],
  ];
  channelId: string = '';

  constructor(
    private threadsService: ThreadsService,
    public channelService: ChannelService,
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    private router: Router
  ) {}

  /**
   * The `sendMessage()` method is responsible for sending a message to the Firebase database. It first checks if the
   * `messageText` variable is not empty. If it is not empty, it calls the `saveMessageToFirebase()` method from the
   * `channelService` to save the message to Firebase. After that, it resets the `messageText` variable to an empty string.
   *
   * @method
   * @name sendMessage
   * @kind method
   * @memberof ChannelOnDisplayComponent
   * @returns {void}
   */
  sendMessage() {
    if (this.messageText) {
      // Delete the uploaded Image from localStorage
      localStorage.removeItem('lastImageUpload');
      this.channelService.saveMessageToFirebase(this.messageText);
      this.messageText = '';
    }
  }

  async onDeleteSelectedMessage(messageId: string) {
    await this.channelService.deleteMessageFromFirebase(messageId);
    this.channelService.isOpenThread = false;
    this.showThreadContainer = false;
  }

  // make sure to destory the editor
  ngOnDestroy(): void {
    this.editor.destroy();
    this.imageInsertedSubscription.unsubscribe();
    this.closeSub.unsubscribe();
  }

  async ngOnInit() {
    this.editor = new Editor();
    let { channelName, channelId } = await this.displayChannelNameAndID();
    this.displayChannelName();
    this.messages = this.channelService.fetchMessagesFromFirebase(channelId);
    this.imageInsertedSubscription =
      this.channelService.imageInsertedSubject.subscribe((url) => {
        this.insertImageToEditor(url);
      });

    this.router.events.subscribe(async (event) => {
      if (event instanceof NavigationEnd) {
        let { channelName, channelId } = await this.displayChannelNameAndID();
        this.messages =
          this.channelService.fetchMessagesFromFirebase(channelId);
        this.channelService.sendChannelID(channelId);
      }
    });

    this.closeSub = this.threadsService.close$.subscribe(() => {
      this.showThreadContainer = false;
    });
  }

  /**
   * The `insertImageToEditor(url: string)` method is responsible for inserting an image into the editor. It takes a `url`
   * parameter, which is the URL of the image to be inserted. Inside the method, it appends an HTML `<img>` tag with the
   * `src` attribute set to the provided `url` to the `messageText` variable. This allows the image to be displayed in the
   * editor when the message is sent.
   *
   * @method
   * @name insertImageToEditor
   * @kind method
   * @memberof ChannelOnDisplayComponent
   * @param {string} url
   * @returns {void}
   */
  insertImageToEditor(url: string) {
    if (!this.showThreadContainer) {
      this.messageText += `<img src="${url}" alt="Uploaded Image">`;
    }
  }

  onChatIconClick(messageId: string) {
    const currentMessageID = localStorage.getItem('selected_messageID');

    if (currentMessageID !== messageId) {
      this.showThreadContainer = false;
      // this line is to ensure Angular's change detection recognizes the change
      // setTimeout would let the value change in the next JavaScript VM turn
      setTimeout(() => {
        this.showThreadContainer = true;
      }, 0);
      this.channelService.isOpenThread = true;
    } else if (currentMessageID == messageId) {
      this.showThreadContainer = true;
      this.channelService.isOpenThread = true;
    }

    localStorage.setItem('selected_messageID', messageId);
  }

  /**
   * The `displayChannelName()` method is responsible for retrieving the channel name from the Firebase database and
   * assigning it to the `channelName` variable in the component. It uses the `route.paramMap` to get the `id` parameter from
   * the URL, which represents the channel ID. Then, it uses the `AngularFirestore` service to fetch the channel document
   * from the `channels` collection in Firebase based on the `id`. Once the channel document is retrieved, it extracts the
   * `channelName` field from the document and assigns it to the `channelName` variable in the component.
   *
   * @method
   * @name displayChannelName
   * @kind method
   * @memberof ChannelOnDisplayComponent
   * @returns {void}
   */
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

  /**
   * The `displayChannelNameAndID()` method is a promise-based method that retrieves the channel name and ID from the
   * Firebase database. It uses the `route.paramMap` to get the `id` parameter from the URL, which represents the channel ID.
   * Then, it uses the `AngularFirestore` service to fetch the channel document from the `channels` collection in Firebase
   * based on the `id`. Once the channel document is retrieved, it extracts the `channelName` and `channelId` fields from the
   * document and returns them as a resolved promise.
   *
   * @method
   * @name displayChannelNameAndID
   * @kind method
   * @memberof ChannelOnDisplayComponent
   * @returns {Promise<{ channelName: string; channelId: string; }>}
   */
  displayChannelNameAndID(): Promise<{
    channelName: string;
    channelId: string;
  }> {
    return new Promise((resolve) => {
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
            const { channelName, channelId } = channel;
            this.channelId = channelId;
            this.channelName = channelName;
            // console.log(this.channelName, this.channelId);
            resolve({ channelName, channelId });
          }
        });
    });
  }
}
