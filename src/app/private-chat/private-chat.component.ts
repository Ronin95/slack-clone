import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription, map, switchMap, tap } from 'rxjs';
import { Editor, Toolbar } from 'ngx-editor';
import { ChannelService } from '../services/channel.service';
import { PrivateChatService } from '../services/private-chat.service';
import { FormControl } from '@angular/forms';
import { ChatListControlService } from '../services/chat-list-control.service';
import { UsersService } from '../services/users.service';
import { privateMessage } from '../../models/private-chat';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-private-chat',
  templateUrl: './private-chat.component.html',
  styleUrls: ['./private-chat.component.scss'],
})
export class PrivateChatComponent implements OnInit, OnDestroy {
  subscribedParam!: any;
  userName: string = '';
  messageText: string = '';
  editor!: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic', 'underline', 'strike', 'code', 'blockquote'],
  ];
  imageInsertedSubscription!: Subscription;
  myChats$ = this.privateChatService.myChats$;
  messageControl = new FormControl('');
  messages$: Observable<privateMessage[]> | undefined;
  user$ = this.usersService.currentUserProfile$;
  chatId: string = '';

  constructor(
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    public channelService: ChannelService,
    public privateChatService: PrivateChatService,
    private chatListControlService: ChatListControlService,
    private usersService: UsersService,
    private datePipe: DatePipe
  ) {
    this.displayUserName();
  }

  getFormattedDate(timestamp: any): string {
    if (!timestamp || !timestamp.seconds) {
      return ''; // Return an empty string if the timestamp is invalid
    }
  
    const date = new Date(timestamp.seconds * 1000 + (timestamp.nanoseconds || 0) / 1000000);
    return this.datePipe.transform(date, 'dd.MM.yy | HH:mm') || '';
  }
  
  

  /**
   * The `ngOnDestroy()` method is a lifecycle hook in Angular that is called just before the component is destroyed. In this
   * specific component, the `ngOnDestroy()` method is used to perform cleanup tasks and unsubscribe from any subscriptions
   * or event listeners to prevent memory leaks.
   * 
   * @method
   * @name ngOnDestroy
   * @kind method
   * @memberof PrivateChatComponent
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.editor.destroy();
    localStorage.removeItem('currentChatId');
  }

  /**
   * The `ngOnInit()` method is a lifecycle hook in Angular that is called after the component has been initialized. In this
   * specific component, the `ngOnInit()` method is used to perform initialization tasks such as creating an instance of the
   * `Editor` class, subscribing to the `imageInsertedSubject` observable from the `channelService`, and retrieving chat
   * messages based on the selected chat ID. It also checks if there is a stored chat ID in the local storage and sets the
   * `chatListControl` value accordingly.
   * 
   * @method
   * @name ngOnInit
   * @kind method
   * @memberof PrivateChatComponent
   * @returns {void}
   */
  ngOnInit(): void {
    this.editor = new Editor();
    this.imageInsertedSubscription = this.channelService.imageInsertedSubject.subscribe((url) => {
      this.insertImageToEditor(url);
    });

    const storedChatId = localStorage.getItem('currentChatId');
    if (storedChatId) {
      this.chatListControlService.chatListControl.setValue([storedChatId]);
      this.chatId = storedChatId;
      this.messages$ = this.privateChatService.getChatMessages$(storedChatId);
    } else {
      this.messages$ = this.chatListControlService.chatListControl.valueChanges.pipe(
        map((value) => value[0]),
        tap((chatId) => {
          this.chatId = chatId;
        }),
        switchMap((chatId) => this.privateChatService.getChatMessages$(chatId)),
        tap(() => {})
      );
    }
  }

  /**
   * The `sendMessage()` method is responsible for sending a chat message. It retrieves the message text from the
   * `messageText` property and the selected chat ID from the `chatListControl` property. If both the message text and chat
   * ID are available, it calls the `addChatMessage()` method of the `privateChatService` to add the chat message to the
   * selected chat. After sending the message, it clears the `messageText` property.
   * 
   * @method
   * @name sendMessage
   * @kind method
   * @memberof PrivateChatComponent
   * @returns {void}
   */
  sendMessage() {
    const message = this.messageText;
    const selectedChatId = this.chatListControlService.chatListControl.value[0];
    if (message && selectedChatId) {
      this.privateChatService
        .addChatMessage(selectedChatId, message)
        .subscribe(() => {
        });
      this.messageText = '';
    }
  }

  /**
   * The `async deleteMessage(messageId: string)` method is responsible for deleting a chat message. It takes a `messageId`
   * parameter, which is the ID of the message to be deleted.
   * 
   * @async
   * @method
   * @name deleteMessage
   * @kind method
   * @memberof PrivateChatComponent
   * @param {string} messageId
   * @returns {Promise<void>}
   */
  async deleteMessage(messageId: string) {
    await this.privateChatService.deleteChatMessage(messageId, this.chatId);
  }

  /**
   * The `insertImageToEditor(url: string)` method is responsible for inserting an image into the editor. It takes a `url`
   * parameter, which is the URL of the image to be inserted. Inside the method, it appends an HTML `<img>` tag with the
   * provided URL to the `messageText` property. This allows the image to be displayed in the editor when the message is
   * sent.
   * 
   * @method
   * @name insertImageToEditor
   * @kind method
   * @memberof PrivateChatComponent
   * @param {string} url
   * @returns {void}
   */
  insertImageToEditor(url: string) {
    this.messageText += `<img src="${url}" alt="Uploaded Image">`;
  }

  /**
   * The `displayUserName()` method is responsible for retrieving the display name of a user based on the user ID provided in
   * the route parameters.
   * 
   * @method
   * @name displayUserName
   * @kind method
   * @memberof PrivateChatComponent
   * @returns {void}
   */
  displayUserName() {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          this.subscribedParam = params.get('id');
          return this.firestore
            .collection('users')
            .doc(this.subscribedParam)
            .valueChanges();
        })
      )
      .subscribe((user: any) => {
        if (user) {
          this.userName = user.displayName;
        }
      });
  }

  /**
   * The `messageMatchesSearch(message: any): boolean` method is a helper method that checks if a chat message matches the
   * search value entered by the user. It takes a `message` parameter, which represents a chat message object, and returns a
   * boolean value indicating whether the message matches the search value.
   * 
   * @method
   * @name messageMatchesSearch
   * @kind method
   * @memberof PrivateChatComponent
   * @param {any} message
   * @returns {boolean}
   */
  messageMatchesSearch(message: any): boolean {
    const searchValue = this.channelService.searchValue.toLowerCase();
    return (
      (message.text && message.text.toLowerCase().includes(searchValue)) ||
      (message.displayName &&
        message.displayName.toLowerCase().includes(searchValue))
    );
  }
  
}
