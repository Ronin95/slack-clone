import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import Quill from 'quill';
import BlotFormatter from 'quill-blot-formatter';
Quill.register('modules/blotFormatter', BlotFormatter);

@Component({
	selector: 'app-text-editor',
	templateUrl: './text-editor.component.html',
	styleUrls: ['./text-editor.component.scss'],
})
export class TextEditorComponent implements OnInit {
	templateForm: FormGroup;
	quillEditorModules = {};
	ngOnInit(): void {}

	constructor() {
		this.templateForm = new FormGroup({
			textEditor: new FormControl(''),
		});
		this.quillEditorModules = {
			blotFormatter: {},
		};
	}

	testEditorContent() {
		alert(this.templateForm.get('textEditor')!.value);
	}
}
