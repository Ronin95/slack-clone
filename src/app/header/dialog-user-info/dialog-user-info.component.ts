import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-dialog-user-info',
  templateUrl: './dialog-user-info.component.html',
  styleUrls: ['./dialog-user-info.component.scss'],
})
export class DialogUserInfoComponent {
  public file: any = [];
  uploadProgress!: number;

  constructor(
    public authService: AuthService,
    public dialogRef: MatDialogRef<DialogUserInfoComponent>,
    private storage: AngularFireStorage
  ) {}

  uploadFile(event: Event) {
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
            fileRef.getDownloadURL().subscribe((url) => console.log(url))
          )
        )
        .subscribe();
    }
  }
}
