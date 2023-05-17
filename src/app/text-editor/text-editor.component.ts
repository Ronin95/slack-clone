import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import Quill from 'quill';
import BlotFormatter from 'quill-blot-formatter';
Quill.register('modules/blotFormatter', BlotFormatter);
import 'quill-emoji/dist/quill-emoji.js';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { switchMap, take } from 'rxjs';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss'],
})
export class TextEditorComponent implements OnInit {
  templateForm: FormGroup;
  quillEditorModules = {};
  modules = {};
  subscribedParam!: any;
  @Input() control!: FormControl;

  ngOnInit() {
    this.control = this.control ?? new FormControl();
  }

  constructor(
    private firestore: AngularFirestore,
    private route: ActivatedRoute
  ) {
    this.templateForm = new FormGroup({ textEditor: new FormControl('') });
    this.quillEditorModules = { blotFormatter: {} };
  }

  sendMessage() {
	this.route.paramMap
	  .pipe(
		switchMap((params) => {
		  this.subscribedParam = params.get('id');
		  return this.firestore
			.collection('channels')
			.doc(this.subscribedParam)
			.valueChanges()
			.pipe(take(1));
		})
	  )
	  .subscribe((channel: any) => {
		const message = {
		  text: this.control.value as string,
		  timestamp: new Date(),
		};
		const channelRef: AngularFirestoreDocument<any> = this.firestore
		  .collection('channels')
		  .doc(this.subscribedParam);
  
		updateDoc(channelRef.ref, {
		  channelChat: [...channel.channelChat, message],
		})
		  .then(() => {
			console.log('Nachricht gesendet und gespeichert.');
		  })
		  .catch((error) => {
			console.error('Fehler beim Speichern der Nachricht:', error);
		  });
	  });
  }
}
