import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ChannelService } from '../services/channel.service';
import { ActivatedRoute, NavigationEnd, Router, UrlTree } from '@angular/router';
import { ThreadsService } from '../services/threads.service';
import { Editor, Toolbar } from 'ngx-editor';
import { Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-threads',
  templateUrl: './threads.component.html',
  styleUrls: ['./threads.component.scss']
})
export class ThreadsComponent implements OnInit {
  private paramsSubscription!: Subscription;
  channel!: Observable<any>;
  thread!: Observable<any>;
  messageText: string = '';
  editor!: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic', 'underline', 'strike', 'code', 'blockquote'],
  ];
  router: any;

  constructor(
    private route: ActivatedRoute,
    private firestoreDB: AngularFirestore,
    private threadsService: ThreadsService,
    public channelService: ChannelService
  ) { }

  ngOnInit() {
    this.editor = new Editor();
    this.paramsSubscription = this.route.params.subscribe(params => {
      this.threadsService.accessSelectedMessage();
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
    console.log('Test - 1');
  }

  onCloseIconClick() {
    this.threadsService.closeThread();
  }
}
