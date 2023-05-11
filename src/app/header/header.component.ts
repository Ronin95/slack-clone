import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogUserInfoComponent } from './dialog-user-info/dialog-user-info.component';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  dataRef!: Observable<any>;
  uid!: string;

  constructor(private router: Router, public dialog: MatDialog, private firestore: AngularFirestore) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!this.uid) {
      this.router.navigate(['/'])
    } else {
      this.dataRef = this.firestore.doc('users/' + this.uid).valueChanges();
    }
    // this.uid = user.uid;

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
