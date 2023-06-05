import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class PrivateChatService {
  subscribedParam!: any;

  constructor(
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    private auth: AuthService
  ) {}

  saveMessageToFirebase(message: string, selectedUserId: string) {
    const loggedInUserId = this.auth.userData.uid;
    const messageId = this.firestore.createId();
    // Create message object
    const newMessage = {
      messageId: messageId,
      senderId: loggedInUserId,
      receiverId: selectedUserId,
      content: message,
      timestamp: new Date().toISOString(),
    };

    // Path to save message for logged user
    const loggedInUserPath = `users/${loggedInUserId}/privateMessages`;
    // Path to save message for selected user
    const selectedUserPath = `users/${selectedUserId}/privateMessages`;

    this.saveMessageForLoggedUser(loggedInUserPath, newMessage, messageId);
    this.saveMessageForSelectedUser(selectedUserPath, newMessage, messageId);
  }

  saveMessageForLoggedUser(
    loggedInUserPath: string,
    newMessage: any,
    messageId: string
  ) {
    //save message for logged user
    this.firestore
      .collection(loggedInUserPath)
      .doc(messageId)
      .set(newMessage)
      .then(() => {
        console.log('Saved message for logged user successful');
      })
      .catch((error) => {
        console.error(
          'Saved message for logged user was failed:',
          error
        );
      });
  }

  saveMessageForSelectedUser(
    selectedUserPath: string,
    newMessage: any,
    messageId: string
  ) {
    // save message for selected user
    this.firestore
      .collection(selectedUserPath)
      .doc(messageId)
      .set(newMessage)
      .then(() => {
        console.log('Saved message for selected user successful');
      })
      .catch((error) => {
        console.error(
          'Saved message for selected user was failed:',
          error
        );
      });
  }
}
