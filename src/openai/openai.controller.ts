import { Controller, Get } from '@nestjs/common';
import { OpenaiService } from './openai.service';

@Controller('openai')
export class OpenaiController {
    constructor(private readonly openaiService:OpenaiService) {}

    @Get()
    async generateNewQuiz(): Promise<string> {
        return await this.openaiService.generateNewQuiz();
    }
}
