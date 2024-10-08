import { Controller, Get, Inject, Logger, OnModuleInit, Param, UseGuards } from '@nestjs/common';
import { Hero, HERO_PACKAGE_NAME, HERO_SERVICE_NAME, HeroServiceClient } from 'hero-proto-definition/hero';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
//import { jwtAuthGuard } from 'common-hero-package';

@Controller('hero')

export class HeroController implements OnModuleInit {
   private readonly logger = new Logger('HeroController')
   
    private heroService:HeroServiceClient

    constructor (@Inject(HERO_PACKAGE_NAME) private readonly client:ClientGrpc){}

    onModuleInit() {
        this.heroService = this.client.getService<HeroServiceClient>(HERO_SERVICE_NAME)
    }

 
   // @UseGuards(jwtAuthGuard)
    @Get(':id')
    getById(@Param('id') id:string):Observable<Hero>{
        this.logger.log(`Fetching hero with id ${id}`)
        return this.heroService.findOne({id: +id});
    }
}
