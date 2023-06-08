import { Test, TestingModule } from '@nestjs/testing';
import { OpenaiController } from './openai.controller';
import { OpenaiService } from './openai.service';
import { ConfigService } from '@nestjs/config';

describe('OpenaiController', () => {
  let controller: OpenaiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OpenaiController],
      providers: [OpenaiService, ConfigService],
    }).compile();

    controller = module.get<OpenaiController>(OpenaiController);
  });

  it('객체가 정의되어야 합니다', () => {
    expect(controller).toBeDefined();
  });
});
