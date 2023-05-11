import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-dialog-user-info',
  templateUrl: './dialog-user-info.component.html',
  styleUrls: ['./dialog-user-info.component.scss'],
})
export class DialogUserInfoComponent {
  public file: any = [];
  uploadProgress!: number;
  onDisplay = true;
  uid!: string;

  constructor(
    public authService: AuthService,
    public dialogRef: MatDialogRef<DialogUserInfoComponent>,
    private storage: AngularFireStorage,
    private firestore: AngularFirestore
  ) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.uid = user.uid;
  }

  uploadFile(event: Event, uid: string) {
    const element = event.target as HTMLInputElement;
    const file = element.files ? element.files[0] : null;

    if (file) {
      const filePath = `images/${new Date().getTime()}_${file.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);

      // get notified when the download URL is available
      task
        .snapshotChanges()
        .pipe(
          finalize(() =>
            fileRef.getDownloadURL().subscribe((url) => {
              // Update the user's photoURL in Firestore
              this.firestore
                .collection('users')
                .doc(uid)
                .update({
                  photoURL: url,
                })
                .then(() => {
                  console.log(`URL ${url} saved to Firestore for user ${uid}`);
                })
                .catch((error: any) => {
                  console.error(`Error saving URL to Firestore: ${error}`);
                });
            })
          )
        )
        .subscribe();
    }

    // Delete capability to upload a new image
    this.onDisplay = false;

  }
}
