import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'
import { OpenAIApi, Configuration } from 'openai';
import { MessageDto, MessagesDto } from './dto/Messages.dto';
import { TextWithTokenCountDto } from './dto/TextWithTokenCount.dto';

@Injectable()
export class OpenaiService {
    constructor(private configService: ConfigService) {}
    private config: Configuration = new Configuration({ apiKey: this.configService.get<string>('OPENAI_API_KEY') });
    private openai: OpenAIApi = new OpenAIApi(this.config);
    private readonly scenario: MessageDto[] = [{role: 'system', content: `당신은 추리 게임의 관리자입니다. 탐정이 'TALKTO' 명령어를 사용하면, 해당 용의자는 탐정의 질문을 대기합니다. 탐정는 한 가지 씩만 질문할 수 있고, 용의자도 한 가지만 대답한 뒤, 다음 질문을 대기합니다. 탐정이 'INV' 명령어를 사용하면, 범죄 현장을 조사할 수 있습니다. 당신은 범죄 현장을 피해자의 신체와 범죄 현장 주변의 있을 법한 구성요소로 분리합니다. 탐정의 질문을 통해 각 구성요소를 살펴보면서 범죄에 대한 단서를 발견하면, 증거 목록을 저장해 유지하세요. 탐정이 'EVIDENCE' 명령어를 사용하면, 조사를 통해 알게된 모든 단서를 나열하세요. 탐정만이 질문할 수 있습니다.`},
                                                {role: 'user', content: `저는 탐정입니다. 제가 조사할 미해결 범죄 사건을 만드세요. 무작위 범죄 사건의 스토리를 생성해, 여러 명의 용의자를 만들고, 스토리와 용의자를 나열하세요. 제가 한 가지 씩 질문하면, 당신은 그에 대해 답변합니다. 제가 명령어를 통해 조사하면, 정답을 추리할 수 있는 단서가 제공되어야 합니다. 제가 사건을 조사하기 전에는 단서를 알려주지 마세요.`}];
    private logger: Logger = new Logger(OpenaiService.name);

    /**
     * 새로운 게임을 생성합니다.
     * @returns {Promise<TextWithTokenCountDto>} 생성된 게임 설명문
     */
    async generateNewGame(): Promise<TextWithTokenCountDto> {
        return await this.generateChat(this.scenario);
    }

    /**
     * 게임 내에서의 조사를 실시하고, 결과를 반환합니다.
     * @return {Promise<TextWithTokenCountDto>} 조사 결과
     */
    async inquiry(messagesData: MessagesDto): Promise<TextWithTokenCountDto> {
        const messages: MessageDto[] = [...this.scenario, ...messagesData.messages];
        return await this.generateChat(messages);
    }

    /**
     * OpenAI API에 접근해 대화를 생성하는 함수입니다.
     * @param messages - 대화에 사용될 메시지 배열입니다.
     * @returns {Promise<string>} 생성된 대화문입니다.
     * @throws 대화 생성에 실패한 경우 'Failed to generate chat.', 토큰을 전부 사용했을 경우 `텍스트 입력이 최대 토큰 수를 초과했습니다.` 예외가 발생합니다.
     */
    async generateChat(messages: MessageDto[]): Promise<TextWithTokenCountDto> {
        try {
            const response = await this.openai.createChatCompletion({
                model: 'gpt-3.5-turbo',
                messages: messages,
            });
            const responseObject: TextWithTokenCountDto = {
                content: response.data.choices[0].message.content,
                token_count: response.data.usage.total_tokens,
            }
            return responseObject;
        } catch (err) {
            this.logger.error('Error occurred:', err);
            if (err.message === 'Request failed with status code 400') {
                throw new BadRequestException('텍스트 입력이 최대 토큰 수를 초과했습니다.');
            } else {
                throw new Error('대화 생성에 실패했습니다.');
            }
        }
    }
}