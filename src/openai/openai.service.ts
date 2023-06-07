import { Injectable, Logger } from '@nestjs/common';
import { OpenAIApi, Configuration } from 'openai';
import { MessageDto } from './dto/message.dto';

@Injectable()
export class OpenaiService {
    private config: Configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
    private openai: OpenAIApi = new OpenAIApi(this.config);
    private readonly system: MessageDto = {role: 'system', content:
    `You are Gamemaster.
    Create a murder mystery game.
    You can create a random scenario for me to investigate.
    Create several suspects, and let me ask them questions through this chat.
    When I use the command TALKTO I would like to talk to that character. I will ask 1 question, and the character will give 1 answer, and then wait for the next question. We will go back and forth, 1 question at a time.
    When I use INV I want to investigate the scene of the crime. Separate the crime scene into several nested modules like body, head, eyes or desk, drawer, box in drawer. As I move through each module, add more information that is relevant to the investigation.
    As I discover clues for the crime keep a list of the evidence. When I use the command EVIDENCE, recite all the clues we have learned through our investigation.`};
    private logger: Logger = new Logger(OpenaiService.name);

    /**
     * 새로운 게임을 생성합니다.
     * @returns {Promise<string>} 생성된 게임 설명문
     */
    async generateNewGame(): Promise<string> {
        const messages: MessageDto[] = [];
        messages.push(this.system);
        messages.push({role: 'user', content: '한국어로 게임 만들어줘.'});
        console.log(messages.length);
        try {
            const response = await this.openai.createChatCompletion({
                model: 'gpt-3.5-turbo',
                messages: messages
            });

            const content: string = response.data.choices[0].message.content;
            return content;
        } catch (err) {
            this.logger.error('Error occurred:', err);
            throw new Error('Failed to generate new game.');
        }
    }

    /**
     * 게임 내에서의 조사를 실시하고, 결과를 반환합니다.
     * @return {Promise<string>} 조사 결과
     */
    async inquiry(messagesData: MessageDto[]): Promise<string> {
        const messages: MessageDto[] = [...messagesData];
        messages.push(this.system);
        console.log(messages.length);
        try {
            const response = await this.openai.createChatCompletion({
                model: 'gpt-3.5-turbo',
                messages: messages
            });

            const content: string = response.data.choices[0].message.content;
            return content;
        } catch (err) {
            this.logger.error('Error occurred:', err);
            throw new Error('Failed to generate new game.');
        }
    }
}