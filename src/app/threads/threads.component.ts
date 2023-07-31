import { Component, OnInit } from '@angular/core';
import { ChannelService } from '../services/channel.service';
import { ActivatedRoute } from '@angular/router';
import { ThreadsService } from '../services/threads.service';
import { Editor, Toolbar } from 'ngx-editor';
import { Observable, Subscription } from 'rxjs';
import { DatePipe, Location } from '@angular/common';

@Component({
  selector: 'app-threads',
  templateUrl: './threads.component.html',
  styleUrls: ['./threads.component.scss'],
})
export class ThreadsComponent implements OnInit {
  threadMessages: any[] = [];
  selectedMessage: any;
  private paramsSubscription!: Subscription;
  channel!: Observable<any>;
  thread!: Observable<any>;
  messageTextThread: string = '';
  editorThread!: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic', 'underline', 'strike', 'code', 'blockquote'],
  ];
  router: any;
  hasChannelChatThread$: Observable<boolean> | undefined;
  imageInsertedSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private threadsService: ThreadsService,
    public channelService: ChannelService,
    private location: Location,
    private datePipe: DatePipe
  ) {}

  /**
   * The `ngOnInit()` method is a lifecycle hook in Angular that is called after the component has been initialized. It is
   * used to perform any necessary initialization tasks for the component.
   * 
   * @method
   * @name ngOnInit
   * @kind method
   * @memberof ThreadsComponent
   * @returns {void}
   */
  ngOnInit() {
    this.threadsService.fetchThreadMessages().subscribe((messages) => {
      this.threadMessages = messages;
      // Get the selected_messageID from local storage
      const selected_messageID = localStorage.getItem('selected_messageID');
      // If selected_messageID exists, use it to check if a thread exists
      if (selected_messageID) {
        this.hasChannelChatThread$ = this.threadsService.checkIfChannelChatThreadExists(selected_messageID);
      } else {
        // Handle the case where selected_messageID does not exist
        console.error('No selected message ID found in local storage');
      }
    });
    this.editorThread = new Editor();
    this.paramsSubscription = this.route.params.subscribe((params) => {
      this.threadsService.accessSelectedMessage().subscribe((message: any) => {
        if (message) {
          this.selectedMessage = message;
        } else {
          console.error('No message found');
        }
      });
    });
    this.imageInsertedSubscription =
    this.channelService.imageInsertedSubject.subscribe((url) => {
      this.insertImageToEditor(url);
    });
  }

  getFormattedDate(timestamp: any): string {
    if (!timestamp || !timestamp.seconds) {
      return ''; // Return an empty string if the timestamp is invalid
    }

    const date = new Date(
      timestamp.seconds * 1000 + (timestamp.nanoseconds || 0) / 1000000
    );
    return this.datePipe.transform(date, 'E, dd. MMM yy | HH:mm') || '';
  }

  /**
   * The `ngOnDestroy()` method is a lifecycle hook in Angular that is called when a component is about to be destroyed. It
   * is used to perform any necessary cleanup tasks before the component is removed from the DOM.
   * 
   * @method
   * @name ngOnDestroy
   * @kind method
   * @memberof ThreadsComponent
   * @returns {void}
   */
  ngOnDestroy() {
    // Don't forget to unsubscribe to avoid memory leaks
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    this.imageInsertedSubscription.unsubscribe();
    // localStorage.removeItem('selected_messageID');
  }

  /**
   * The `insertImageToEditor(url: string)` method is responsible for inserting an image into the editor. It takes a `url`
   * parameter, which is the URL of the image to be inserted.
   * 
   * @method
   * @name insertImageToEditor
   * @kind method
   * @memberof ThreadsComponent
   * @param {string} url
   * @returns {void}
   */
  insertImageToEditor(url: string) {
    this.messageTextThread += `<img src="${url}" alt="Uploaded Image">`;
  }

  /**
   * The `sendMessageToThread()` method is responsible for sending a message to a thread. It first checks if there is any
   * text in the `messageTextThread` variable. If there is, it calls the `sendMessageToThread()` method of the
   * `threadsService` and passes the `messageTextThread` as the message to be sent. After sending the message, it resets the
   * `messageTextThread` variable to an empty string.
   * 
   * @method
   * @name sendMessageToThread
   * @kind method
   * @memberof ThreadsComponent
   * @returns {void}
   */
  sendMessageToThread() {
    if (this.messageTextThread) {
      this.threadsService.sendMessageToThread(this.messageTextThread);
      this.messageTextThread = '';
    }
  }

  /**
   * The `onCloseIconClick()` method is called when the close icon is clicked in the UI. It is responsible for closing the
   * thread by calling the `closeThread()` method of the `threadsService`. It also sets the `isOpenThread` property of the
   * `channelService` to `false` and calls the `resetURL()` method to modify the URL by removing the portion related to the
   * thread.
   * 
   * @method
   * @name onCloseIconClick
   * @kind method
   * @memberof ThreadsComponent
   * @returns {void}
   */
  onCloseIconClick() {
    this.threadsService.closeThread();
    this.channelService.isOpenThread = false;
    this.resetURL();
  }

  /**
   * The `resetURL()` method is used to modify the URL by removing a portion related to the thread. It is called when the
   * thread is closed.
   * 
   * @method
   * @name resetURL
   * @kind method
   * @memberof ThreadsComponent
   * @returns {void}
   */
  resetURL() {
    // Get the current path
    let path = this.location.path();
    // Remove a portion of the URL
    path = this.removeThreadPortion(path);
    // Update the URL
    this.location.go(path);
  }

  /**
   * The `removeThreadPortion(url: string): string` method is a helper method that is used to remove a portion of the URL
   * related to the thread. It takes a `url` parameter, which is the current URL, and returns a modified URL with the thread
   * portion removed.
   * 
   * @method
   * @name removeThreadPortion
   * @kind method
   * @memberof ThreadsComponent
   * @param {string} url
   * @returns {string}
   */
  removeThreadPortion(url: string): string {
    // This regular expression matches '/thread/' followed by exactly 20 alphanumeric characters
    const regex = /\/thread\/[a-zA-Z0-9]{20}/;
    // Replace the matched portion with an empty string
    return url.replace(regex, '');
  }
}
