import { Body, Controller, Get, Post } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { MessagesDto } from './dto/Messages.dto';
import { TextWithTokenCountDto } from './dto/TextWithTokenCount.dto';

/**
 * OpenAI API와 관련된 기능을 제공합니다.
 * 새로운 게임을 생성하고, 사용자와 AI 간의 대화를 관리합니다.
 */
@Controller('openai')
export class OpenaiController {
    constructor(private readonly openaiService:OpenaiService) {}

    @Get()
    async generateNewGame(): Promise<TextWithTokenCountDto> {
        return await this.openaiService.generateNewGame();
    }

    @Post('inquiry')
    async inquiry(@Body() messagesData: MessagesDto): Promise<TextWithTokenCountDto> {
        return await this.openaiService.inquiry(messagesData);
    }
}
