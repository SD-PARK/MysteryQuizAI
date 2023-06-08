import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { OpenaiModule } from './openai/openai.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [OpenaiModule,
            ConfigModule.forRoot({
              cache: true,
              isGlobal: true,
            }),],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}