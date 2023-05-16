import { Component, OnInit } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { ChannelService } from '../services/channel.service';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-channel-on-display',
  templateUrl: './channel-on-display.component.html',
  styleUrls: ['./channel-on-display.component.scss'],
})
export class ChannelOnDisplayComponent implements OnInit {
  channelArray: any[] = [];
  channelName: string = '';
  snapshotParam!: any;
  subscribedParam!: any;

  constructor(
    public channelService: ChannelService,
    private route: ActivatedRoute,
    private firestore: AngularFirestore
  ) {
    this.getAllChannelsAsArray();
  }

  getAllChannelsAsArray(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.channelService.getAllChannels().subscribe(
        (channel) => {
          this.channelArray.push(channel); // On each emission, push the emitted item into the array
        },
        (error) => {
          reject(error); // On error, reject the Promise
        },
        () => {
          resolve(this.channelArray); // On completion, resolve the Promise
        }
      );
      console.log(this.channelArray);
    });
  }

  ngOnInit(): void {
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

}