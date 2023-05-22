import { Component, OnInit } from '@angular/core';
import { ChannelService } from 'src/app/services/channel.service';

@Component({
  selector: 'app-single-message',
  templateUrl: './single-message.component.html',
  styleUrls: ['./single-message.component.scss']
})
export class SingleMessageComponent implements OnInit {
  constructor(public channelService: ChannelService) { }

  ngOnInit() {
    this.channelService.getUserNameAndImgFromFirebase();
    this.setTimeStampInHTML();
  }

  setTimeStampInHTML() {
    // Get the formatted date from localStorage
    const formattedDate = localStorage.getItem('ChannelMessageDate');
    // Select the span element by its class name
    const spanElement = document.querySelector('.time-stamp');
    // Check if the span element exists and the formattedDate is not null
    if (spanElement && formattedDate) {
        // Set the span element's text content to the formatted date
        spanElement.textContent = formattedDate;
    }
  }

}
