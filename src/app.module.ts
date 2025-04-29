import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { GameModule } from './game/game.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 10000,
      limit: 5,
    }]),
    GameModule,
  ],
})
export class AppModule {}
