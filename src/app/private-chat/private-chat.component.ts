import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { Editor, Toolbar } from 'ngx-editor';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ChannelService } from '../services/channel.service';
import { PrivateChatService } from '../services/private-chat.service';

@Component({
  selector: 'app-private-chat',
  templateUrl: './private-chat.component.html',
  styleUrls: ['./private-chat.component.scss'],
})
export class PrivateChatComponent implements OnInit, OnDestroy {
  subscribedParam!: any;
  userName: string = '';
  messages: any[] = [];
  messageText: string = '';
  editor!: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic', 'underline', 'strike', 'code', 'blockquote'],
  ];
  imageInsertedSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    public channelService: ChannelService,
    public privateChatService: PrivateChatService
  ) {
    this.displayUserName();
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  ngOnInit(): void {
    this.editor = new Editor();
    this.loadMessages();
    this.imageInsertedSubscription =
      this.channelService.imageInsertedSubject.subscribe((url) => {
        this.insertImageToEditor(url);
      });
  }

  sendMessage(messageText: string) {
    const selectedUserId = this.route.snapshot.params['id'];
    this.privateChatService.saveMessageToFirebase(
      this.messageText,
      selectedUserId
    );
    this.messageText = '';
  }

  loadMessages() {
    this.route.params
      .pipe(
        switchMap((params) => {
          const selectedUserId = params['id'];
          return this.privateChatService.getMessagesFromFirebase(
            selectedUserId
          );
        })
      )
      .subscribe((messages) => {
        this.messages = messages;
        console.log(this.messages);
      });
  }

  insertImageToEditor(url: string) {
    this.messageText += `<img src="${url}" alt="Uploaded Image">`;
  }

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
          console.log(this.userName);
        }
      });
  }
}
