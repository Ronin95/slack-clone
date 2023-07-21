import { Component, OnInit } from '@angular/core';
import { ChannelService } from '../services/channel.service';
import { ActivatedRoute } from '@angular/router';
import { ThreadsService } from '../services/threads.service';
import { Editor, Toolbar } from 'ngx-editor';
import { Observable, Subscription } from 'rxjs';

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
  messageText: string = '';
  editor!: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic', 'underline', 'strike', 'code', 'blockquote'],
  ];
  router: any;
  hasChannelChatThread$: Observable<boolean> | undefined;

  constructor(
    private route: ActivatedRoute,
    private threadsService: ThreadsService,
    public channelService: ChannelService
  ) {}

  ngOnInit() {
    this.threadsService.fetchThreadMessages().subscribe((messages) => {
      this.threadMessages = messages;
      // Get the selected_messageID from local storage
      const selected_messageID = localStorage.getItem('selected_messageID');
      // If selected_messageID exists, use it to check if a thread exists
      if (selected_messageID) {
        this.hasChannelChatThread$ =
          this.threadsService.checkIfChannelChatThreadExists(
            selected_messageID
          );
      } else {
        // Handle the case where selected_messageID does not exist
        console.error('No selected message ID found in local storage');
      }
    });
    this.editor = new Editor();
    this.paramsSubscription = this.route.params.subscribe((params) => {
      this.threadsService.accessSelectedMessage().subscribe((message: any) => {
        if (message) {
          this.selectedMessage = message;
        } else {
          console.error('No message found');
        }
      });
    });
  }

  ngOnDestroy() {
    // Don't forget to unsubscribe to avoid memory leaks
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
  }

  insertImageToEditor(url: string) {
    this.messageText += `<img src="${url}" alt="Uploaded Image">`;
  }

  sendMessageToThread() {
    if (this.messageText) {
      this.threadsService.sendMessageToThread(this.messageText);
      this.messageText = '';
    }
  }

  onCloseIconClick() {
    this.threadsService.closeThread();
  }
}
