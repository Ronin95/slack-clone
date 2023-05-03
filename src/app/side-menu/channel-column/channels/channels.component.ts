import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.scss'],
})
export class ChannelsComponent implements OnInit {
  ngOnInit(): void {}

  openMenu: boolean = false;

  toggleChannels() {
    this.openMenu = !this.openMenu;
  }
}
