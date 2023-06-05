import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { Editor, Toolbar } from 'ngx-editor';
import { DomSanitizer } from '@angular/platform-browser';
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
  messages!: any[];
  messageText: string = '';
  editor!: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic', 'underline', 'strike', 'code', 'blockquote'],
  ];

  constructor(
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    private sanitizer: DomSanitizer,
    public channelService: ChannelService,
    public privateChat: PrivateChatService
  ) {
    this.displayUserName();
  }

  sanitizeHtml(html: string) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  ngOnInit(): void {
    this.editor = new Editor();
  }

  sendMessage(messageText: string) {
    const selectedUserId = this.route.snapshot.params['id'];
    this.privateChat.saveMessageToFirebase(this.messageText, selectedUserId);
    this.messageText = '';
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
