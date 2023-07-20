import { Component, OnInit } from '@angular/core';
import { OpenAiService } from '../../services/open-ai.service';
import { ChannelService } from '../../services/channel.service';

@Component({
  selector: 'app-chatgpt',
  templateUrl: './chatgpt.component.html',
  styleUrls: ['./chatgpt.component.scss']
})
export class ChatgptComponent implements OnInit {
  messages: { role: string, content: string }[] = [];
  inputText: string = "";
  error: string | undefined;
  

  constructor(private openaiservice: OpenAiService, public channelService: ChannelService) {
    this.messages.push({role: 'system', content: 'You are a helpful assistant.'});
  }
  
  ngOnInit() { }

  callOpenAiApi(text: string) {
    console.log('callOpenAiApi function has been called with text:', text);
    this.openaiservice.getDataFromOpenAI(text).subscribe(
      (data: string | undefined) => {
        this.error = undefined;
        if (data) {
          this.messages.push({role: 'user', content: text});
          this.messages.push({role: 'assistant', content: data});
          this.inputText = '';
        }
      },
      (error) => {
        this.error = error;
      }
    );
  }
}
