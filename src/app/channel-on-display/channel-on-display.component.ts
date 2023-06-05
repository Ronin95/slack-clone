import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { ChannelService } from '../services/channel.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, switchMap, Subscription  } from 'rxjs';
import { Editor, Toolbar, Validators } from 'ngx-editor';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-channel-on-display',
  templateUrl: './channel-on-display.component.html',
  styleUrls: ['./channel-on-display.component.scss'],
})
export class ChannelOnDisplayComponent implements OnInit, OnChanges, OnDestroy {
  imageInsertedSubscription!: Subscription;
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

  sanitizeHtmlWithImageSize(html: string): SafeHtml {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;

    const images = wrapper.querySelectorAll('img');

    images.forEach((image: HTMLImageElement) => {
      image.style.maxHeight = '200px';
    });
    const sanitizedHtml = this.sanitizer.bypassSecurityTrustHtml(wrapper.innerHTML);
    return sanitizedHtml;
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
    this.imageInsertedSubscription.unsubscribe();
  }

  async ngOnInit() {
    this.editor = new Editor();
    let { channelName, channelId } = await this.displayChannelNameAndID();
    this.displayChannelName();
    this.messages = this.channelService.fetchMessagesFromFirebase(channelId);
    this.imageInsertedSubscription = this.channelService.imageInsertedSubject.subscribe((url) => {
      this.insertImageToEditor(url);
    });

    this.router.events.subscribe(async (event) => {
      if (event instanceof NavigationEnd) {
        let { channelName, channelId } = await this.displayChannelNameAndID();
        this.messages =
          this.channelService.fetchMessagesFromFirebase(channelId);
      }
    });
  }

  insertImageToEditor(url: string) {
    this.messageText += `<img src="${url}" alt="Uploaded Image">`;
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
