import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, DocumentData, Firestore, orderBy, query, where } from '@angular/fire/firestore';
import { BehaviorSubject, concatMap, map, Observable, take } from 'rxjs';
import { UsersService } from './users.service';
import { User } from '../../models/user.model';
import { PrivateChat, privateMessage } from '../../models/private-chat';
import { ChannelService } from './channel.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';

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
    private afs: AngularFirestore,
    private userService: UsersService,
    private channelService: ChannelService
  ) {}

  /**
   * The `get myChats$(): Observable<PrivateChat[]>` is a getter method that returns an observable of type `PrivateChat[]`.
   * It retrieves the private chats of the current user by querying the Firestore collection 'chats' and filtering the chats
   * based on the current user's ID. It also adds the chat name and profile picture to each private chat object before
   * returning the observable.
   * 
   * @method
   * @name (get) myChats$
   * @kind property
   * @memberof PrivateChatService
   * @returns {$: Observable<PrivateChat[]>}
   */
  get myChats$(): Observable<PrivateChat[]> {
    const ref = collection(this.firestore, 'chats');
    return this.userService.currentUserProfile$.pipe(
      concatMap((user) => {
        const myQuery = query(
          ref,
          where('userIds', 'array-contains', user?.['uid'])
        );
        return collectionData(myQuery, { idField: 'id' }).pipe(
          map((chats: DocumentData[]) =>
            this.addChatNameAndPic(
              typeof user?.['uid'] === 'string' ? user?.['uid'] : undefined,
              chats.map((chat) => chat as PrivateChat)
            )
          )
        ) as Observable<PrivateChat[]>;
      })
    );
  }

  /**
   * The `createChat` method in the `PrivateChatService` class is used to create a new private chat between the current user
   * and another user. It takes an `otherUser` parameter of type `User`, which represents the other user involved in the
   * chat.
   * 
   * @method
   * @name createChat
   * @kind method
   * @memberof PrivateChatService
   * @param {User} otherUser
   * @returns {Observable<string>}
   */
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
            },
          ],
        })
      ),
      map((ref) => ref.id)
    );
  }

  /**
   * The `isExistingChat` method in the `PrivateChatService` class is used to check if there is an existing chat between the
   * current user and another user. It takes an `otherUserId` parameter of type `string`, which represents the ID of the
   * other user.
   * 
   * @method
   * @name isExistingChat
   * @kind method
   * @memberof PrivateChatService
   * @param {string} otherUserId
   * @returns {Observable<string | null>}
   */
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

  /**
   * The `addChatMessage` method in the `PrivateChatService` class is used to add a new message to a specific private chat.
   * It takes two parameters: `chatId` of type `string`, which represents the ID of the chat, and `message` of type `string`,
   * which represents the content of the message.
   * 
   * @method
   * @name addChatMessage
   * @kind method
   * @memberof PrivateChatService
   * @param {string} chatId
   * @param {string} message
   * @returns {Observable<any>}
   */
  addChatMessage(chatId: string, message: string): Observable<any> {
    const ref = this.afs.collection('chats').doc(chatId).collection('messages');
    const date = new Date();
    const formattedDate = this.channelService.getFormattedDate(date);
    const messageId = this.afs.createId();
    return this.userService.currentUserProfile$.pipe(
      take(1),
      concatMap((user) =>
        ref.doc(messageId).set({
          text: message,
          messageId: messageId,
          senderId: user?.['uid'],
          sentDate: new Date(),
          displayName: user?.['displayName'],
          photoURL: user?.['photoURL'],
        })
      )
    );
  }

  /**
   * The `deleteChatMessage` method in the `PrivateChatService` class is an asynchronous method that is used to delete a
   * specific chat message from a private chat. It takes two parameters: `messageId` of type `string`, which represents the
   * ID of the message to be deleted, and `chatId` of type `string`, which represents the ID of the chat where the message
   * belongs.
   * 
   * @async
   * @method
   * @name deleteChatMessage
   * @kind method
   * @memberof PrivateChatService
   * @param {string} messageId
   * @param {string} chatId
   * @returns {Promise<void>}
   */
  async deleteChatMessage(messageId: string, chatId: string) {
    const sfRef = this.afs
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .doc(messageId);
    await sfRef.delete();
  }

  /**
   * The `getChatMessages$` method in the `PrivateChatService` class is used to retrieve the messages of a specific private
   * chat. It takes a `chatId` parameter of type `string`, which represents the ID of the chat.
   * 
   */
  getChatMessages$(chatId: string): Observable<privateMessage[]> {
    const ref = collection(this.firestore, 'chats', chatId, 'messages');
    const queryAll = query(ref, orderBy('sentDate', 'asc'));
    return collectionData(queryAll) as Observable<privateMessage[]>;
  }

  /**
   * The `addChatNameAndPic(` method in the `PrivateChatService` class is used to add the chat name and profile picture to
   * each private chat object in the `chats` array.
   * 
   * @method
   * @name addChatNameAndPic
   * @kind method
   * @memberof PrivateChatService
   * @param {string | undefined} currentUserId
   * @param {PrivateChat[]} chats
   * @returns {PrivateChat[]}
   */
  addChatNameAndPic(
    currentUserId: string | undefined,
    chats: PrivateChat[]
  ): PrivateChat[] {
    chats.forEach((chat: PrivateChat) => {
      const otherUserIndex =
        chat.userIds.indexOf(currentUserId ?? '') === 0 ? 1 : 0;
      const { displayName } = chat.users[otherUserIndex];
      chat.chatName = displayName;
    });

    return chats;
  }
}
