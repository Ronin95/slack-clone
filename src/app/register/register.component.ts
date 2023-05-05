import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { User } from 'src/models/user.class';
import { Firestore, collection, doc, setDoc } from '@angular/fire/firestore';

// import { AuthService } from '../services/auth.service';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
	firestore: Firestore = inject(Firestore);
	user: User = new User();

	ngOnInit(): void {}

	public registerForm: FormGroup;

	// , public authService: AuthService
	constructor(
		private formBuilder: FormBuilder,
		public dialogRef: MatDialogRef<RegisterComponent>,
		public dialog: MatDialog /* public authService: AuthService */
	) {
		this.registerForm = this.formBuilder.group({
			displayName: ['', [Validators.required], []],
			email: ['', [Validators.required, Validators.email], []],
			password: ['', [Validators.required], []],
		});
	}

	closeDialog() {
		this.dialogRef.close();
		this.dialog.open(LoginComponent);
	}

	registerUser() {
		this.user.toJSON();
		console.log(this.user);
		const aCollection = collection(this.firestore, 'users'); //? collection() creates a reference to the collection 'users' in the database 'firestore
		const aDoc = doc(aCollection); //? Creates a reference to a document in a collection
		setDoc(aDoc, this.user.toJSON()); //? setDoc() sets the data to the document
	}
}
