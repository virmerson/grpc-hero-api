import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { grpcClientOptions } from '../grpc-client-options';
import { HeroController } from './hero.controller';
import { HERO_PACKAGE_NAME } from 'hero-proto-definition/hero';
import { HeroService } from './hero.service';
import { ConfigService } from '@nestjs/config';
import { AUTH_SERVICE } from 'common-hero-package';



@Module({
    imports: [

        //comunicate with the auth service

        //Comunicate with the hero service grcp-hero
        ClientsModule.register(
            [{
                name: HERO_PACKAGE_NAME,
                ...grpcClientOptions,
            }]),
        ClientsModule.registerAsync([
            {
                name: AUTH_SERVICE,
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.TCP,
                    options: {
                        host: configService.get('AUTH_HOST'),
                        port: configService.get('AUTH_PORT'),
                    },
                }),
                inject: [ConfigService],

            }
        ])
    ],
    controllers: [HeroController],
    providers: [HeroService],
    exports: [],
})
export class HeroModule { }
