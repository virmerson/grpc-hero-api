
import { Module } from '@nestjs/common';
import { HeroModule } from './hero/hero.module';
import { DatabaseModule } from "common-hero-package"
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    HeroModule,
    DatabaseModule, 
    ConfigModule.forRoot({
      isGlobal: true,
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}