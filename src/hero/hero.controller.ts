import { Controller, Get, Inject, Logger, OnModuleInit, Param, UseGuards, UseInterceptors } from '@nestjs/common';
import { Hero, HERO_PACKAGE_NAME, HERO_SERVICE_NAME, HeroServiceClient } from 'hero-proto-definition/hero';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { CurrentUser, UserDto } from 'common-hero-package';
import { GrpcMetadataInterceptor } from 'src/interceptors/grpc-metada.interceptor';
import { Metadata } from "@grpc/grpc-js";
import { GrpcMetadata } from 'src/decorator/grpc-metadata.decorator';
import { JwtAuthGuard } from 'src/jwt-auth.guard';


@Controller('hero')
@UseInterceptors(GrpcMetadataInterceptor)
export class HeroController implements OnModuleInit {
   private readonly logger = new Logger('HeroController')
   
    private heroService:HeroServiceClient

    constructor (@Inject(HERO_PACKAGE_NAME) private readonly client:ClientGrpc){

        this.logger.log('Client created '+ client )
    }

    onModuleInit() {
        this.heroService = this.client.getService<HeroServiceClient>(HERO_SERVICE_NAME)
    }

    @UseGuards(JwtAuthGuard) 
    @Get(':id')
    getById(
        @Param('id') id:number ,
        @CurrentUser() user:UserDto, 
        @GrpcMetadata() metadata: Metadata):Observable<Hero>{

        this.logger.log(`Fetching hero with id ${id}`)
        this.logger.log(`User Authenticated ${JSON.stringify(user)}`)

      
        this.logger.log(`User in metadata ${JSON.stringify(metadata.getMap())}`)

        const hero=   this.heroService.findOne({id: +id}, metadata );
        return hero
    }
}
