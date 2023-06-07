import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ChannelService } from '../services/channel.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ThreadsService } from '../services/threads.service';
import { Editor, Toolbar } from 'ngx-editor';


@Component({
  selector: 'app-threads',
  templateUrl: './threads.component.html',
  styleUrls: ['./threads.component.scss']
})
export class ThreadsComponent implements OnInit {
  messageText: string = '';
  editor!: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic', 'underline', 'strike', 'code', 'blockquote'],
  ];

  constructor(
    private threadsService: ThreadsService, 
    public channelService: ChannelService
  ) { }

  ngOnInit() {
    this.editor = new Editor();
  }

  insertImageToEditor(url: string) {
    this.messageText += `<img src="${url}" alt="Uploaded Image">`;
  }

  sendMessage() {
    console.log('Test - 1');
  }

  onCloseIconClick() {
    this.threadsService.closeThread();
  }
}
