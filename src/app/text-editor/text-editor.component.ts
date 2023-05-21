import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import Quill from 'quill';
import BlotFormatter from 'quill-blot-formatter';
Quill.register('modules/blotFormatter', BlotFormatter);
import 'quill-emoji/dist/quill-emoji.js';
import { ActivatedRoute } from '@angular/router';

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
    private route: ActivatedRoute
  ) {
    this.templateForm = new FormGroup({ textEditor: new FormControl('') });
    this.quillEditorModules = {
      blotFormatter: {}, // keeps the image scalable
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ 'list': 'ordered' },
        { 'list': 'bullet' }],
        ['image'],                  // link and image, video
      ]
    };
  }
}
