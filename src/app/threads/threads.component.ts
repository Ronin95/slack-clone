import { Component, OnInit } from '@angular/core';
import { ChannelService } from '../services/channel.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-threads',
  templateUrl: './threads.component.html',
  styleUrls: ['./threads.component.scss']
})
export class ThreadsComponent implements OnInit {
  threadId!: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id === null) {
        // Handle the error. For example, you might navigate to a 'not found' page
        console.error('Thread ID is missing from route');
      } else {
        this.threadId = id;
        // Now you can load the thread based on this.threadId...
      }
    });

  }
}
