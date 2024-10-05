
import { Module } from '@nestjs/common';
import { HeroModule } from './hero/hero.module';
import { DatabaseModule } from "common-hero-package"

@Module({
  imports: [
    HeroModule,
    DatabaseModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}