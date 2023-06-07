import { Injectable, Logger } from '@nestjs/common';
import { OpenAIApi, Configuration } from 'openai';
import { MessageDto, MessagesDto } from './dto/message.dto';

@Injectable()
export class OpenaiService {
    private config: Configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
    private openai: OpenAIApi = new OpenAIApi(this.config);
    private readonly scenario: MessageDto[] = [{role: 'system', content: `당신은 게임 마스터입니다.`},
                                             {role: 'user', content: `범죄 추리 게임을 만들어보세요. 제가 조사할 무작위 시나리오를 생성하세요. 여러 명의 용의자를 만들고, 이 채팅을 통해 질문하겠습니다. 제가 'TALKTO' 명령어를 사용하면, 해당 캐릭터와 대화할 수 있습니다. 제가 'TALKTO' 명령어를 통해 한 가지를 질문하면, 캐릭터가 한 가지를 대답하고, 다음 질문을 대기합니다. 우리는 번갈아가며 하나씩 질문하고 답변할 것입니다. 제가 'INV' 명령어를 사용하면, 범죄 현장을 조사할 수 있습니다. 범죄 현장을 신체, 머리, 눈 또는 책상, 서랍 상자와 같은 여러 개의 구성 요소로 분리합니다. 각 구성 요소를 살펴보면서, 조사와 관련된 정보를 추가해주세요. 범죄에 대한 단서들을 발견하면, 증거 목록을 저장해 유지해주세요. 제가 'EVIDENCE' 명령어를 사용하면, 조사를 통해 알게된 모든 단서를 나열해주세요.`}];
    private logger: Logger = new Logger(OpenaiService.name);

    /**
     * 새로운 게임을 생성합니다.
     * @returns {Promise<string>} 생성된 게임 설명문
     */
    async generateNewGame(): Promise<string> {
        return await this.createChatCompletion(this.scenario);
    }

    /**
     * 게임 내에서의 조사를 실시하고, 결과를 반환합니다.
     * @return {Promise<string>} 조사 결과
     */
    async inquiry(messagesData: MessagesDto): Promise<string> {
        const messages: MessageDto[] = [...this.scenario, ...messagesData.messages];
        console.log(messages.length);

        return await this.createChatCompletion(messages);
    }

    /**
     * OpenAI API에 접근해 대화를 생성하는 함수입니다.
     * @param messages - 대화에 사용될 메시지 배열입니다.
     * @returns {Promise<string>} 생성된 대화문입니다.
     * @throws 대화 생성에 실패한 경우 'Failed to generate new game.' 예외가 발생합니다.
     */
    async createChatCompletion(messages: MessageDto[]): Promise<string> {
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