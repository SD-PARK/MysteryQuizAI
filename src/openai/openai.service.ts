import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'
import { OpenAIApi, Configuration } from 'openai';
import { MessageDto, MessagesDto } from './dto/Messages.dto';
import { TextWithTokenCountDto } from './dto/TextWithTokenCount.dto';

@Injectable()
export class OpenaiService {
    constructor(private configService: ConfigService) {}
    private config: Configuration = new Configuration({ apiKey: this.configService.get<string>('OPENAI_API_KEY') });
    private openai: OpenAIApi = new OpenAIApi(this.config);
    private readonly scenario: MessageDto[] = [{role: 'system', content: `당신은 추리 게임의 게임 마스터입니다. 유저가 'TALKTO' 명령어를 사용하면, 해당 용의자와 대화할 수 있습니다. 유저가 한 가지를 질문하면, 용의자가 한 가지를 대답하고, 다음 질문을 대기합니다. 유저가 'INV' 명령어를 사용하면, 범죄 현장을 조사할 수 있습니다. 범죄 현장을 신체, 머리, 눈 또는 책상, 서랍 상자와 같은 여러 개의 구성 요소로 분리합니다. 유저의 질문을 통해 각 구성 요소를 살펴보면서 범죄에 대한 단서들을 발견하면, 증거 목록을 저장해 유지하세요. 유저가 'EVIDENCE' 명령어를 사용하면, 조사를 통해 알게된 모든 단서를 나열하세요. 유저가 먼저 질문합니다.`},
                                               {role: 'user', content: `저는 유저입니다. 범죄 추리 게임을 만들어보세요. 무작위 사건을 구체적으로 생성해, 용의자 목록과 함께 나열하세요. 우리는 한 번씩 번갈아가며 사건에 대해 질문하고 답변할 것입니다. 여러 명의 용의자를 만들고, 용의자의 목록을 한국어로 나열하세요. 제가 명령어를 이용해 사건을 조사하기 전에는 단서를 알려주지 마세요.`}];
    private logger: Logger = new Logger(OpenaiService.name);

    /**
     * 새로운 게임을 생성합니다.
     * @returns {Promise<TextWithTokenCountDto>} 생성된 게임 설명문
     */
    async generateNewGame(): Promise<TextWithTokenCountDto> {
        return await this.createChatCompletion(this.scenario);
    }

    /**
     * 게임 내에서의 조사를 실시하고, 결과를 반환합니다.
     * @return {Promise<TextWithTokenCountDto>} 조사 결과
     */
    async inquiry(messagesData: MessagesDto): Promise<TextWithTokenCountDto> {
        const messages: MessageDto[] = [...this.scenario, ...messagesData.messages];
        return await this.createChatCompletion(messages);
    }

    /**
     * OpenAI API에 접근해 대화를 생성하는 함수입니다.
     * @param messages - 대화에 사용될 메시지 배열입니다.
     * @returns {Promise<string>} 생성된 대화문입니다.
     * @throws 대화 생성에 실패한 경우 'Failed to generate chat.', 토큰을 전부 사용했을 경우 `텍스트 입력이 최대 토큰 수를 초과했습니다.` 예외가 발생합니다.
     */
    async createChatCompletion(messages: MessageDto[]): Promise<TextWithTokenCountDto> {
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
            if (err.message === 'Request failed with status code 400') { throw new HttpException('텍스트 입력이 최대 토큰 수를 초과했습니다.', HttpStatus.BAD_REQUEST); }
            else { throw new Error('대화 생성에 실패했습니다.'); }
        }
    }
}