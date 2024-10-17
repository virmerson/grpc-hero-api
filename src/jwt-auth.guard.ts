import {
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable,
    Logger,
    UnauthorizedException,
  } from '@nestjs/common';
  import { ClientProxy } from '@nestjs/microservices';
  import { Reflector } from '@nestjs/core';
  import { catchError, map, Observable, of, tap } from 'rxjs';
  import { AUTH_SERVICE } from 'common-hero-package';
  import { UserDto } from 'common-hero-package';
  
  @Injectable()
  export class JwtAuthGuard implements CanActivate {
    private readonly logger = new Logger(JwtAuthGuard.name);
  
    constructor(
      @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
      private readonly reflector: Reflector,
    ) {

      console.log('JwtAuthGuard has been loaded');
    }
  
    canActivate(
      context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
      const cookies = context.switchToHttp().getRequest().cookies;
      const headers = context.switchToHttp().getRequest().headers;
     
      const jwt =
        cookies?.Authentication ||
        headers?.authentication ||
        headers?.cookie?.split('=')[1];
        
      if (!jwt) {
        
        return false;
      }
  
      const roles = this.reflector.get<string[]>('roles', context.getHandler());
  
      return this.authClient
        .send<UserDto>('authenticate', {
          Authentication: jwt,
        })
        .pipe(
          tap((res) => {
            if (roles) {
              for (const role of roles) {
                if (!res.roles?.includes(role)) {
                  this.logger.error('The user does not have valid roles.');
                  throw new UnauthorizedException();
                }
              }
            }
            context.switchToHttp().getRequest().user = res;
          }),
          map(() => true),
          catchError((err) => {
            this.logger.error(err);
            return of(false);
          }),
        );
    }
  }