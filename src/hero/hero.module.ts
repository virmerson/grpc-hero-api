import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { grpcClientOptions } from '../grpc-client-options';
import { HeroController } from './hero.controller';
import { HERO_PACKAGE_NAME } from 'hero-proto-definition/hero';
import { HeroService } from './hero.service';




@Module({
    imports: [
      

        ClientsModule.register(
        [{
        name: HERO_PACKAGE_NAME,  // this name needs to match the package name in the proto file
      
        ...grpcClientOptions}])
    ],
    controllers: [HeroController],
    providers: [HeroService],
    exports: [],
})
export class HeroModule { }
