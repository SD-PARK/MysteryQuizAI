import { Body, Controller, Get, Post } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { MessageDto } from './dto/message.dto';

/**
 * OpenAI API와 관련된 기능을 제공합니다.
 * 새로운 게임을 생성하고, 사용자와 AI 간의 대화를 관리합니다.
 */
@Controller('openai')
export class OpenaiController {
    constructor(private readonly openaiService:OpenaiService) {}

    @Get()
    async generateNewGame(): Promise<string> {
        return await this.openaiService.generateNewGame();
    }

    @Post('inquiry')
    async inquiry(@Body() messagesData: MessageDto[]): Promise<string> {
        console.log(messagesData);
        return 'good';
    }
}
