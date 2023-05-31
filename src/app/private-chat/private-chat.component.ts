import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-private-chat',
  templateUrl: './private-chat.component.html',
  styleUrls: ['./private-chat.component.scss'],
})
export class PrivateChatComponent {
  subscribedParam!: any;
  userName: string = '';
  messages!: any[];
  messageText: string = '';

  constructor(
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    private auth: AuthService
  ) {
    this.displayUserName();
  }

  sendMessage(message: string) {
    const loggedInUserId = this.auth.userData.uid;
    const selectedUserId = this.subscribedParam; // UID des ausgewählten Benutzers aus der URL

    // Überprüfen, ob der eingeloggte Benutzer vorhanden ist
    if (!loggedInUserId) {
      console.error('Eingeloggter Benutzer nicht gefunden.');
      return;
    }

    // Nachrichtenobjekt erstellen
    const newMessage = {
      senderId: loggedInUserId,
      receiverId: selectedUserId,
      content: message,
      timestamp: new Date().toISOString(),
    };

    // Pfad zur Speicherung der Nachricht für den eingeloggten Benutzer
    const loggedInUserPath = `users/${loggedInUserId}/privateMessages`;
    // Pfad zur Speicherung der Nachricht für den ausgewählten Benutzer
    const selectedUserPath = `users/${selectedUserId}/privateMessages`;

    // Nachricht für den eingeloggten Benutzer speichern
    this.firestore
      .collection(loggedInUserPath)
      .add(newMessage)
      .then(() => {
        console.log('Nachricht für den Absender erfolgreich gespeichert');
        // Hier können Sie weitere Aktionen ausführen, wie das Leeren des Textbereichs usw.
      })
      .catch((error) => {
        console.error(
          'Fehler beim Speichern der Nachricht für den Absender:',
          error
        );
      });

    // Nachricht für den ausgewählten Benutzer speichern
    this.firestore
      .collection(selectedUserPath)
      .add(newMessage)
      .then(() => {
        console.log('Nachricht für den Empfänger erfolgreich gespeichert');
        // Hier können Sie weitere Aktionen ausführen, wie das Leeren des Textbereichs usw.
      })
      .catch((error) => {
        console.error(
          'Fehler beim Speichern der Nachricht für den Empfänger:',
          error
        );
      });
  }

  displayUserName() {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          this.subscribedParam = params.get('id');
          return this.firestore
            .collection('users')
            .doc(this.subscribedParam)
            .valueChanges();
        })
      )
      .subscribe((user: any) => {
        if (user) {
          this.userName = user.displayName;
          console.log(this.userName);
        }
      });
  }
}
