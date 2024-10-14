import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Metadata } from '@grpc/grpc-js';

@Injectable()
export class GrpcMetadataInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const call = context.switchToRpc().getContext();
    let metadata = call.metadata as Metadata;

    
    if (!metadata) {
      metadata = new Metadata();
      call.metadata = metadata;
    }

 
    const user = context.switchToHttp().getRequest().user;
    if (user) {
      metadata.add('user-id', user._id.toString());
      metadata.add('user-email', user.email);
    }

    //for the annotation @GrpcMethodMetadata
    const request = context.switchToHttp().getRequest();
    request.metadata = metadata;

     // Log metadata before sending the request
     console.log('Client Metadata:', metadata.getMap());
     
     console.log('Equals metadata', call.metadata === metadata);
     
    return next.handle().pipe(
      tap(() => {
        // here we can do something after the response is sent
      }),
    );
  }
}