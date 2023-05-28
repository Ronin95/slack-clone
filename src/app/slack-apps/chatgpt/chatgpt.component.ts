import { Component } from '@angular/core';
import { OpenAiService } from '../../services/open-ai.service';

@Component({
  selector: 'app-chatgpt',
  templateUrl: './chatgpt.component.html',
  styleUrls: ['./chatgpt.component.scss']
})
export class ChatgptComponent {
  openAiResponse: string | undefined;
  inputText: string = "";

  constructor(private openaiservice: OpenAiService) {} // Inject your service

  callOpenAiApi(text: string) {
    this.openaiservice.getDataFromOpenAI(text).subscribe((data: string | undefined) => {
      this.openAiResponse = data;
    });
  }
}
