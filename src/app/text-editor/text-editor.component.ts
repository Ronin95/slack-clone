import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChannelService } from '../services/channel.service';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss']
})
export class TextEditorComponent implements OnInit {
  ngOnInit() {}
  @Input() data = '';
  @Output() dataChange = new EventEmitter<string>();

  constructor(private channelService: ChannelService) { }

  public Editor = ClassicEditor;
  public config = {
    toolbar: {
      items: [
        'undo', 'redo',
        '|',
        'bold', 'italic', 'strikethrough',
        '|',
        'link', 'imageUpload', 'bulletedList', 'numberedList',
        '|',
        'outdent', 'indent'
      ],
      removeItems: ['heading', 'mediaEmbed'],
      shouldNotGroupWhenFull: false
    },
    ckfinder: {
      uploadUrl: '/path/to/your/connector'
    },
    simpleUpload: {
      // The URL that the images are uploaded to.
      uploadUrl: '',
    }
  };


  onEditorChange() {
    const dataWithoutTags = this.data.replace(/<[^>]*>?/gm, '');
    this.dataChange.emit(dataWithoutTags);
    this.data = "";
  }
}
