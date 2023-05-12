import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogUserInfoComponent } from './dialog-user-info/dialog-user-info.component';
import {
  AngularFirestore,
  AngularFirestoreModule,
} from '@angular/fire/compat/firestore';
import { Observable, Subscription  } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  dataRef!: Observable<any>;
  uid!: string;
  private dataSubscription: Subscription

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private firestore: AngularFirestore,
  ) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.uid = user.uid;
    // this.dataRef = this.firestore.doc('users/' + this.uid).valueChanges()
    // console.log(this.dataRef);
    this.dataSubscription = this.firestore.doc('users/' + this.uid).valueChanges().subscribe(data => {
      // Hier kannst du den erhaltenen Datenwert (data) verwenden
      console.log(data); // Beispiel: Ausgabe der Daten in der Konsole
      
      // Weitere Verarbeitung der Daten ...
      
      // Am Ende solltest du das Abonnement beenden
      this.dataSubscription.unsubscribe();
    });
    
    
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
