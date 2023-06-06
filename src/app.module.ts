import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { OpenaiModule } from './openai/openai.module';

@Module({
  imports: [OpenaiModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}