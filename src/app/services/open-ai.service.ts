import { Injectable } from '@angular/core';
import { Configuration, OpenAIApi, CreateChatCompletionRequest, ChatCompletionRequestMessageRoleEnum } from 'openai';
import { from, Observable, throwError } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OpenAiService {
  readonly configuration = new Configuration({
    apiKey: environment.openAIToken
  });

  readonly openai = new OpenAIApi(this.configuration);

  constructor() { }

  /**
   * The `getDataFromOpenAI` method in the `OpenAiService` class is responsible for making a request to the OpenAI API to
   * generate a response based on the given input text.
   * 
   * @method
   * @name getDataFromOpenAI
   * @kind method
   * @memberof OpenAiService
   * @param {string} text
   * @returns {Observable<string>}
   */
  getDataFromOpenAI(text: string): Observable<string> {
    // Check if the user has exceeded the API call limit
    const apiCallData = JSON.parse(localStorage.getItem('apiCallData') || '{}');
    const now = new Date().getTime();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;

    if (apiCallData.timestamp && apiCallData.timestamp > oneDayAgo) {
      if (apiCallData.count >= 10) {
        return throwError('You have exceeded the maximum number of API calls within 24 hours.');
      } else {
        apiCallData.count += 1;
      }
    } else {
      apiCallData.timestamp = now;
      apiCallData.count = 1;
    }

    localStorage.setItem('apiCallData', JSON.stringify(apiCallData));

    const messages = [
      {role: ChatCompletionRequestMessageRoleEnum.System, content: "You are a helpful assistant."},
      {role: ChatCompletionRequestMessageRoleEnum.User, content: text}
    ];

    const requestPayload: CreateChatCompletionRequest = {
      model: "gpt-3.5-turbo",
      messages: messages,
      max_tokens: 150
    };

    return from(this.openai.createChatCompletion(requestPayload)).pipe(
      filter(resp => !!resp && !!resp.data && !!resp.data.choices && resp.data.choices.length > 0),
      filter(resp => !!resp.data.choices[0].message),
      map(resp => resp.data.choices[0].message?.content.trim()),
      filter((responseContent): responseContent is string => responseContent !== undefined)
    );
  }
}
