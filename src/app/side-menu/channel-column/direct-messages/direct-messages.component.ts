import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-direct-messages',
  templateUrl: './direct-messages.component.html',
  styleUrls: ['./direct-messages.component.scss']
})
export class DirectMessagesComponent implements OnInit {
  ngOnInit(): void {}

  openMenu: boolean = false;

  toggleDirectMessages() {
    this.openMenu = !this.openMenu;
  }
}
