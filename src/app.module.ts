
import { Module } from '@nestjs/common';
import { HeroModule } from './hero/hero.module';

import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    HeroModule,
    ConfigModule.forRoot({
      isGlobal: true,
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}