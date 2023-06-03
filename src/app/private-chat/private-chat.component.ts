import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Editor, Toolbar } from 'ngx-editor';
import { DomSanitizer } from '@angular/platform-browser';
import { ChannelService } from '../services/channel.service';

@Component({
  selector: 'app-private-chat',
  templateUrl: './private-chat.component.html',
  styleUrls: ['./private-chat.component.scss'],
})
export class PrivateChatComponent implements OnInit, OnDestroy {
  subscribedParam!: any;
  userName: string = '';
  messages!: any[];
  messageText: string = '';
  editor!: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    ['image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  constructor(
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    private auth: AuthService,
    private sanitizer: DomSanitizer,
    public channelService: ChannelService
  ) {
    this.displayUserName();
  }

  sanitizeHtml(html: string) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  ngOnInit(): void {
    this.editor = new Editor();
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

    this.messageText = '';
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
