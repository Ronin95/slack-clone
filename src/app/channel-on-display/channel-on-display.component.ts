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
  threadMessages: any[] = [];

  constructor(
    public threadsService: ThreadsService,
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
      this.channelService.saveMessageToFirebase(this.messageText);
      this.messageText = '';
    }
  }

  /**
   * The `onDeleteSelectedMessage()` method is an asynchronous method that is responsible for deleting a selected message
   * from Firebase. It takes a `messageId` parameter, which represents the ID of the message to be deleted.
   * 
   * @async
   * @method
   * @name onDeleteSelectedMessage
   * @kind method
   * @memberof ChannelOnDisplayComponent
   * @param {string} messageId
   * @returns {Promise<void>}
   */
  async onDeleteSelectedMessage(messageId: string) {
    await this.channelService.deleteMessageFromFirebase(messageId);
    this.channelService.isOpenThread = false;
    this.showThreadContainer = false;
  }

  /**
   * The `ngOnDestroy()` method is a lifecycle hook in Angular that is called when a component is about to be destroyed. In
   * this specific component, the `ngOnDestroy()` method is used to perform cleanup tasks before the component is destroyed.
   * 
   * @method
   * @name ngOnDestroy
   * @kind method
   * @memberof ChannelOnDisplayComponent
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.editor.destroy();
    this.imageInsertedSubscription.unsubscribe();
    this.closeSub.unsubscribe();
  }

  /**
   * The `async ngOnInit() {` method is the initialization method of the Angular component. It is called when the component
   * is being initialized.
   * 
   * @async
   * @method
   * @name ngOnInit
   * @kind method
   * @memberof ChannelOnDisplayComponent
   * @returns {Promise<void>}
   */
  async ngOnInit() {
    this.editor = new Editor();
    let { channelName, channelId } = await this.displayChannelNameAndID();
    this.threadsService.fetchThreadMessages().subscribe((messages) => {
      this.threadMessages = messages;
    });
    // this.displayChannelName();
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

  /**
   * The `onChatIconClick(messageId: string)` method is a click event handler that is triggered when a chat icon is clicked.
   * It takes a `messageId` parameter, which represents the ID of the message associated with the clicked chat icon.
   * 
   * @method
   * @name onChatIconClick
   * @kind method
   * @memberof ChannelOnDisplayComponent
   * @param {string} messageId
   * @returns {void}
   */
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
  displayChannelNameAndID(): Promise<{ channelName: string; channelId: string; }> {
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
            resolve({ channelName, channelId });
          }
        });
    });
  }
}
