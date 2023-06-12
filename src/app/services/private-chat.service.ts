import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  doc,
  DocumentData,
  Firestore,
  orderBy,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import {
  BehaviorSubject,
  concatMap,
  map,
  Observable,
  take,
} from 'rxjs';
import { UsersService } from './users.service';
import { User } from '../../models/user.model';
import { PrivateChat, privateMessage } from '../../models/private-chat';
import { ChannelService } from './channel.service';

@Injectable({
  providedIn: 'root',
})
export class PrivateChatService {
  private myChatsSubject = new BehaviorSubject<any[]>([]);

  setMyChats(chats: any[]) {
    this.myChatsSubject.next(chats);
  }

  constructor(
    private firestore: Firestore,
    private userService: UsersService,
    private channelService: ChannelService
  ) {}

  get myChats$(): Observable<PrivateChat[]> {
    const ref = collection(this.firestore, 'chats');
    return this.userService.currentUserProfile$.pipe(
      concatMap((user) => {
        const myQuery = query(
          ref,
          where('userIds', 'array-contains', user?.['uid'])
        );
        return collectionData(myQuery, { idField: 'id' }).pipe(
          map((chats: DocumentData[]) => this.addChatNameAndPic(typeof user?.['uid'] === 'string' ? user?.['uid'] : undefined, chats.map(chat => chat as PrivateChat)))
        ) as Observable<PrivateChat[]>;
      })
    );
  }

  createChat(otherUser: User): Observable<string> {
    const ref = collection(this.firestore, 'chats');
    return this.userService.currentUserProfile$.pipe(
      take(1),
      concatMap((user) =>
        addDoc(ref, {
          userIds: [user?.['uid'], otherUser?.uid],
          users: [
            {
              displayName: user?.['displayName'] ?? '',
              photoURL: user?.['photoURL'] ?? '',
            },
            {
              displayName: otherUser.displayName ?? '',
              photoURL: otherUser.photoURL ?? '',
            },
          ],
        })
      ),
      map((ref) => ref.id)
    );
  }

  isExistingChat(otherUserId: string): Observable<string | null> {
    return this.myChats$.pipe(
      take(1),
      map((chats) => {
        for (let i = 0; i < chats.length; i++) {
          if (chats[i].userIds.includes(otherUserId)) {
            return chats[i].id;
          }
        }

        return null;
      })
    );
  }

  addChatMessage(chatId: string, message: string): Observable<any> {
    const ref = collection(this.firestore, 'chats', chatId, 'messages');
    const chatRef = doc(this.firestore, 'chats', chatId);
    const date = new Date();
    const formattedDate = this.channelService.getFormattedDate(date);
    return this.userService.currentUserProfile$.pipe(
      take(1),
      concatMap((user) =>
        addDoc(ref, {
          text: message,
          senderId: user?.['uid'],
          sentDate: formattedDate,
          displayName: user?.['displayName'],
          photoURL: user?.['photoURL']
        })
      ),
      concatMap(() =>
        updateDoc(chatRef, { lastMessage: message, lastMessageDate: formattedDate })
      )
    );
  }

  getChatMessages$(chatId: string): Observable<privateMessage[]> {
    const ref = collection(this.firestore, 'chats', chatId, 'messages');
    const queryAll = query(ref, orderBy('sentDate', 'asc'));
    return collectionData(queryAll) as Observable<privateMessage[]>;
  }

  addChatNameAndPic(
    currentUserId: string | undefined,
    chats: PrivateChat[]
  ): PrivateChat[] {
    chats.forEach((chat: PrivateChat) => {
      const otherUserIndex =
        chat.userIds.indexOf(currentUserId ?? '') === 0 ? 1 : 0;
      const { displayName, photoURL } = chat.users[otherUserIndex];
      chat.chatName = displayName;
      chat.chatPic = photoURL;
    });

    return chats;
  }
}
