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
  callCount: number = 0;


  constructor(private openaiservice: OpenAiService, public channelService: ChannelService, public authService: AuthService) {
    this.messages.push({role: 'system', content: 'You are a helpful assistant.'});
  }
  
  ngOnInit() { }

  /**
   * The `callOpenAiApi(text: string)` method is a function that is called when the user wants to send a message to the
   * OpenAI API. It takes a `text` parameter, which is the message text entered by the user.
   * 
   * @method
   * @name callOpenAiApi
   * @kind method
   * @memberof ChatgptComponent
   * @param {string} text
   * @returns {void}
   */
  callOpenAiApi(text: string) {
    this.checkFunctionCall();
    
    this.isLoading = true;
    this.buttonClicked = true;
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

  checkFunctionCall() {
    // Retrieve the count from localStorage
    let apiCallData = JSON.parse(localStorage.getItem('apiCallData') || '{}');
    this.callCount = apiCallData.count || 0;

    // Increment the count
    this.callCount++;

    // Store the updated count in localStorage
    apiCallData.count = this.callCount;
    localStorage.setItem('apiCallData', JSON.stringify(apiCallData));
  }
  
}
