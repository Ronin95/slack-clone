import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogUserInfoComponent } from './dialog-user-info/dialog-user-info.component';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  dataRef: Observable<any>;

  constructor(public dialog: MatDialog, private firestore: AngularFirestore) {
    this.dataRef = this.firestore.doc('users/6Z02CMKUf1S9u2gcaVrx0VM0kUt1').valueChanges();
  }

  openUserDialog(): void {
    this.dialog.open(DialogUserInfoComponent, {
      width: '250px',
      position: { right: '10px', top: '45px' },
    });
  }
}

export interface userImg {
  photoURL: string;
}
