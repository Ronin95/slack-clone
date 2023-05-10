import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import Quill from 'quill';
import BlotFormatter from 'quill-blot-formatter';
Quill.register('modules/blotFormatter', BlotFormatter);
import 'quill-emoji/dist/quill-emoji.js';

@Component({
	selector: 'app-text-editor',
	templateUrl: './text-editor.component.html',
	styleUrls: ['./text-editor.component.scss'],
})
export class TextEditorComponent implements OnInit {
	templateForm: FormGroup;
	quillEditorModules = {};

	modules = {};
	content = '';

	blured = false;
	focused = false;

	ngOnInit(): void {}

	constructor() {
		this.templateForm = new FormGroup({
			textEditor: new FormControl(''),
		});
		this.quillEditorModules = {
			blotFormatter: {},
		};

		this.modules = {
			'emoji-shortname': true,
			'emoji-textarea': true,
			'emoji-toolbar': true,
			toolbar: [
				['bold', 'italic', 'underline', 'strike'], // toggled buttons
				['blockquote', 'code-block'],

				[{ header: 1 }, { header: 2 }], // custom button values
				[{ list: 'ordered' }, { list: 'bullet' }],
				[{ script: 'sub' }, { script: 'super' }], // superscript/subscript
				[{ indent: '-1' }, { indent: '+1' }], // outdent/indent
				[{ direction: 'rtl' }], // text direction

				[{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
				[{ header: [1, 2, 3, 4, 5, 6, false] }],

				[{ color: [] }, { background: [] }], // dropdown with defaults from theme
				[{ font: [] }],
				[{ align: [] }],

				['clean'], // remove formatting button

				['link', 'image', 'video'], // link and image, video
				['emoji'],
			],
		};
	}

	testEditorContent() {
		alert(this.templateForm.get('textEditor')!.value);
	}
}
