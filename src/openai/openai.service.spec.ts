import { Test, TestingModule } from '@nestjs/testing';
import { OpenaiService } from './openai.service';
import { TextWithTokenCountDto } from './dto/TextWithTokenCount.dto';
import { ConfigService } from '@nestjs/config';
import { MessagesDto } from './dto/Messages.dto';
import { HttpException } from '@nestjs/common';

describe('OpenaiService', () => {
  let service: OpenaiService;

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OpenaiService, {
        provide: ConfigService,
        useValue: {
          get: jest.fn((Key: string, DefaultValue: string) => {
            switch (Key) {
              case 'OPENAI_API_KEY':
                return DefaultValue;
              default:
                return DefaultValue;
            }
          }),
        },
      }],
    }).compile();

    service = module.get<OpenaiService>(OpenaiService);
  });

  it('객체가 정의되어야 합니다', () => {
    expect(service).toBeDefined();
  });

  describe('generateNewGame', () => {
    let result: TextWithTokenCountDto;

    it('60초 안에 응답해야 합니다.', async () => {
      result = await service.generateNewGame();
      expect(result).toBeDefined();
    }, 60000);

    it('객체가 반환되어야 합니다.', () => {
      expect(result).toBeInstanceOf(Object);
    });
  });

  describe('inquiry', () => {
    let result: TextWithTokenCountDto;
    const messagesData: MessagesDto = { messages: [{role: 'system', content: '예/아니오로만 대답하세요'}, {role: 'user', content: '저와 대화를 나눌 준비가 되셨나요?'}] };

    it('20초 안에 응답해야 합니다.', async () => {
      result = await service.inquiry(messagesData);
      expect(result).toBeDefined();
    }, 20000);

    it('객체가 반환되어야 합니다.', () => {
      expect(result).toBeInstanceOf(Object);
    });

    it(`최대 토큰 수를 초과했을 경우, '텍스트 입력이 최대 토큰 수를 초과했습니다.' 예외를 반환해야 합니다`, async () => {
      const tokenFill: string = Array(5000).fill('hi ai ').join('');
      const tokenOverMessagesData: MessagesDto = { messages: [{role: 'user', content: tokenFill}]}
      try {
        await service.inquiry(tokenOverMessagesData);
      } catch(e) {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.message).toEqual(`텍스트 입력이 최대 토큰 수를 초과했습니다.`);
      }
    }, 30000);
  });
});
