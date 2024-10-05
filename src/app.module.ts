
import { Module } from '@nestjs/common';
import { HeroModule } from './hero/hero.module';
import { DatabaseModule } from 'common-hero-package';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    HeroModule,
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: "mongodb://localhost:27017/hero", // Use environment variable
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}