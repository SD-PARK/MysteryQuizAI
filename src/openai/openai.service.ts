import { Injectable } from '@nestjs/common';
import { OpenAIApi, Configuration } from 'openai';
import { Message } from 'src/types/Message';

@Injectable()
export class OpenaiService {
    private config: Configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
    private openai: OpenAIApi = new OpenAIApi(this.config);
    private messages: Message[] = [];

    async generateNewQuiz(): Promise<string> {
        this.messages.push(new Message('user', '추리 퀴즈 하나 만들어줘.'));
        this.messages.push(new Message('system', '너는 추리 퀴즈의 출제자야.'));
        try {
            const response = await this.openai.createChatCompletion({
                model: 'gpt-3.5-turbo',
                messages: this.messages
            });

            const content = response.data.choices[0].message.content;
            return content;
        } catch (err) {
            console.error('Error:', err);
            return null;
        }
    }
}