import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, combineLatest, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { PrivateChatService } from '../../services/private-chat.service';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { User } from '../../../models/user.model';
import { ChatListControlService } from '../../services/chat-list-control.service';

@Component({
  selector: 'app-direct-messages',
  templateUrl: './direct-messages.component.html',
  styleUrls: ['./direct-messages.component.scss'],
})
export class DirectMessagesComponent implements OnInit {
  users$!: Observable<any[]>;
  openMenu: boolean = true;
  loggedInUser: any;
  user$ = this.userService.currentUserProfile$;
  myChats$ = this.privateChatService.myChats$;

  ngOnInit() {
    this.afAuth.authState.subscribe((user) => {
      this.loggedInUser = user;
    });
  }

  constructor(
    firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private privateChatService: PrivateChatService,
    private userService: UsersService,
    public chatListControlService: ChatListControlService
  ) {
    // access the users collection in firestore
    this.users$ = firestore
      .collection('users')
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...(data as object) };
          })
        )
      );
  }

  createChat(user: User) {
    this.privateChatService
    .isExistingChat(user.uid)
    .pipe(
      switchMap((chatId) => {
        if (!chatId) {
          return this.privateChatService.createChat(user);
        } else {
          return of(chatId);
        }
      })
    )
    .subscribe((chatId) => {
      this.chatListControlService.chatListControl.setValue([chatId]);
    });
  }

  toggleDirectMessages() {
    this.openMenu = !this.openMenu;
  }
}
