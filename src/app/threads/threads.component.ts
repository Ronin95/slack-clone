import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ChannelService } from '../services/channel.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-threads',
  templateUrl: './threads.component.html',
  styleUrls: ['./threads.component.scss']
})
export class ThreadsComponent implements OnInit {
  @Output() closeEvent = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {}

  onCloseIconClick() {
    console.log('onCloseIconClick');
    this.closeEvent.emit();
  }
}
