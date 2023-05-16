import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogUserInfoComponent } from './dialog-user-info/dialog-user-info.component';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  uid!: string;
  photoURL!: string;
  userData$!: Observable<any>;

  constructor(
    public dialog: MatDialog,
    private afs: AngularFirestore,
    public authService: AuthService,
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit() {
    this.afAuth.user.subscribe((user) => {
      if (user) {
        const userDoc: AngularFirestoreDocument<any> = this.afs
          .collection('users')
          .doc(user.uid);
        this.userData$ = userDoc.valueChanges();

        this.userData$.subscribe((userData) => {
          if (userData) {
            this.uid = user.uid;
            this.photoURL = userData['photoURL'];
          } else {
            console.log('User data not found in Firestore');
          }
        });
      }
    });
  }

  openUserDialog(): void {
    this.dialog.open(DialogUserInfoComponent, {
      width: '250px',
      position: { right: '10px', top: '45px' },
    });
  }
}
