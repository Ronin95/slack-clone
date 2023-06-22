import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription, combineLatest, map, switchMap, tap } from 'rxjs';
import { Editor, Toolbar } from 'ngx-editor';
import { ChannelService } from '../services/channel.service';
import { PrivateChatService } from '../services/private-chat.service';
import { FormControl } from '@angular/forms';
import { ChatListControlService } from '../services/chat-list-control.service';
import { UsersService } from '../services/users.service';
import { privateMessage } from '../../models/private-chat';

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
  ) {
    this.displayUserName();
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  ngOnInit(): void {   
    this.editor = new Editor();
    this.imageInsertedSubscription =
      this.channelService.imageInsertedSubject.subscribe((url) => {
        this.insertImageToEditor(url);
      });
      this.messages$ = this.chatListControlService.chatListControl.valueChanges.pipe(
        map((value) => value[0]),
        tap((chatId) => {
          this.chatId = chatId; // Weise den Wert von chatId zu
        }),
        switchMap((chatId) => this.privateChatService.getChatMessages$(chatId)),
        tap(() => {

        })
      );
  }

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

  async deleteMessage(messageId: string) {
    await this.privateChatService.deleteChatMessage(messageId, this.chatId);
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

  messageMatchesSearch(message: any): boolean {
    const searchValue = this.channelService.searchValue.toLowerCase();
    return (
      (message.text && message.text.toLowerCase().includes(searchValue)) ||
      (message.displayName &&
        message.displayName.toLowerCase().includes(searchValue))
    );
  }
  
}
