import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { ChannelService } from '../services/channel.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, map, switchMap } from 'rxjs';
import { Editor, Toolbar, Validators } from 'ngx-editor';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-channel-on-display',
  templateUrl: './channel-on-display.component.html',
  styleUrls: ['./channel-on-display.component.scss'],
})
export class ChannelOnDisplayComponent implements OnInit, OnChanges, OnDestroy {
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
    public channelService: ChannelService,
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  sanitizeHtml(html: string) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  ngOnChanges() {
    console.log('Test - 2');
  }

  sendMessage() {
    this.channelService.saveMessageToFirebase(this.messageText);
    this.messageText = '';
  }

  async onDeleteSelectedMessage(messageId: string) {
    await this.channelService.deleteMessageFromFirebase(messageId);
  }

  // make sure to destory the editor
  ngOnDestroy(): void {
    this.editor.destroy();
  }

  async ngOnInit() {
    this.editor = new Editor();
    let { channelName, channelId } = await this.displayChannelNameAndID();
    this.displayChannelName();
    this.messages = this.channelService.fetchMessagesFromFirebase(channelId);

    this.router.events.subscribe(async (event) => {
      if (event instanceof NavigationEnd) {
        let { channelName, channelId } = await this.displayChannelNameAndID();
        this.messages =
          this.channelService.fetchMessagesFromFirebase(channelId);
      }
    });
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
            console.log(this.channelName, this.channelId);
            resolve({ channelName, channelId });
          }
        });
    });
  }
}
