import { Component, OnInit } from '@angular/core';
import { OpenAiService } from '../../services/open-ai.service';
import { ChannelService } from '../../services/channel.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-chatgpt',
  templateUrl: './chatgpt.component.html',
  styleUrls: ['./chatgpt.component.scss']
})
export class ChatgptComponent implements OnInit {
  messages: { role: string; content: string; includesImage?: boolean }[] = [];
  inputText: string = "";
  error: string | undefined;
  public buttonClicked = false;
  isLoading = false;

  constructor(private openaiservice: OpenAiService, public channelService: ChannelService, public authService: AuthService) {
    this.messages.push({role: 'system', content: 'You are a helpful assistant.'});
  }
  
  ngOnInit() { }

  callOpenAiApi(text: string) {
    this.isLoading = true;
    this.buttonClicked = true;
    console.log('callOpenAiApi function has been called with text:', text);
    this.openaiservice.getDataFromOpenAI(text).subscribe(
      (data: string | undefined) => {
        this.isLoading = false;
        this.error = undefined;
        if (data) {
          this.messages.push({role: 'user', content: text, includesImage: true}); // Include image with user's message
          this.messages.push({role: 'assistant', content: data, includesImage: false}); // Do not include image with assistant's message
          this.inputText = '';
        }
      },
      (error) => {
        this.isLoading = false;
        this.error = error;
      }
    );
  }
  
}
