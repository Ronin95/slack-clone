import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ChannelService } from '../services/channel.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ThreadsService } from '../services/threads.service';


@Component({
  selector: 'app-threads',
  templateUrl: './threads.component.html',
  styleUrls: ['./threads.component.scss']
})
export class ThreadsComponent implements OnInit {
  constructor(private threadsService: ThreadsService) { }

  ngOnInit() {}

  onCloseIconClick() {
    this.threadsService.closeThread();
  }
}
