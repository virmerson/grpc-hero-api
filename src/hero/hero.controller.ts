import { Controller, Get, Inject, OnModuleInit, Param } from '@nestjs/common';
import { Hero, HERO_PACKAGE_NAME, HERO_SERVICE_NAME, HeroServiceClient, HeroServiceControllerMethods } from '../proto/interfaces/hero';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';


@Controller('hero')

export class HeroController implements OnModuleInit {

   
    private heroService:HeroServiceClient

    constructor (@Inject(HERO_PACKAGE_NAME) private readonly client:ClientGrpc){}

    onModuleInit() {
        this.heroService = this.client.getService<HeroServiceClient>(HERO_SERVICE_NAME)
        /*
        HERO_SERVICE_NAME needs to match with the name of the service in the proto file 
        service HeroService {
            rpc FindOne(HeroById) returns (Hero) {}
        }
         */
    }
 
    
    @Get(':id')
    getById(@Param('id') id:string):Observable<Hero>{
        return this.heroService.findOne({id: +id});
    }
}
