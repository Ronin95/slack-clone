import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import Quill from 'quill';
import BlotFormatter from 'quill-blot-formatter';
Quill.register('modules/blotFormatter', BlotFormatter);
import 'quill-emoji/dist/quill-emoji.js';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
	selector: 'app-text-editor',
	templateUrl: './text-editor.component.html',
	styleUrls: ['./text-editor.component.scss'],
})
export class TextEditorComponent implements OnInit {
	templateForm: FormGroup;
	quillEditorModules = {};
	modules = {};

	@Input() control!: FormControl;

	ngOnInit() {
		this.control = this.control ?? new FormControl();
	}

	constructor(private db: AngularFirestore) {
		this.templateForm = new FormGroup({ textEditor: new FormControl('') });
		this.quillEditorModules = { blotFormatter: {} };
	}

	sendMessage() {
		const textInput = this.control.value as string;
		console.log(textInput);
	}
}
