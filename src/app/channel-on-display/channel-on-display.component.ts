import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ChannelService } from '../services/channel.service';

@Component({
	selector: 'app-channel-on-display',
	templateUrl: './channel-on-display.component.html',
	styleUrls: ['./channel-on-display.component.scss'],
})
export class ChannelOnDisplayComponent {
  channelArray: any[] = [];

  constructor(public channelService: ChannelService) {
    this.getAllChannelsAsArray();
  }

  getAllChannelsAsArray(): Promise<any[]> {
    return new Promise((resolve, reject) => {
    this.channelService.getAllChannels().subscribe(
      channel => {
        this.channelArray.push(channel); // On each emission, push the emitted item into the array
      },
      error => {
        reject(error); // On error, reject the Promise
      },
      () => {
        resolve(this.channelArray); // On completion, resolve the Promise
      });
      console.log(this.channelArray);
    });
  }



}
