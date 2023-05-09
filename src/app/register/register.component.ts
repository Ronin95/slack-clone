import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { User } from 'src/models/user.class';
import {
  Firestore,
  collection,
  doc,
  setDoc,
  getDocs,
} from '@angular/fire/firestore';
import { AuthService } from '../services/auth.service';
import { VerifyEmailComponent } from '../verify-email/verify-email.component';

// import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  firestore: Firestore = inject(Firestore);

  user: User = new User();
  allUsers: any[] = [];

  async ngOnInit() {
    // await this.getUsers();
    // console.table(this.allUsers);
  }

  public registerForm: FormGroup;

  // , public authService: AuthService
  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<RegisterComponent>,
    public dialog: MatDialog /* public authService: AuthService */ /* private firestore: AngularFirestore */,
    public authService: AuthService
  ) {
    this.registerForm = this.formBuilder.group({
      displayName: ['', [Validators.required], []],
      email: ['', [Validators.required, Validators.email], []],
      password: ['', [Validators.required], []],
    });
  }

  closeDialog() {
    if (this.authService.errorMsgRegister) {
      this.dialogRef.close();
      this.dialog.open(VerifyEmailComponent);
    }
  }

  /**
   * Registers a new user
   */
  // registerUser() {
  // this.user.toJSON();
  // console.log(this.user);
  // const aCollection = collection(this.firestore, 'users'); //? collection() creates a reference to the collection 'users' in the database 'firestore
  // const aDoc = doc(aCollection); //? Creates a reference to a document in a collection
  // setDoc(aDoc, this.user.toJSON()); //? setDoc() sets the data to the document
  // }

  /**
   * Gets all users from the database
   */
  async getUsers() {
    const querySnapshot = await getDocs(collection(this.firestore, 'users'));
    querySnapshot.forEach((doc) => {
      this.allUsers.push(doc.data());
    });
  }

  //hier weiter
  doubleEntry() {}
}
