import { ReflectionService } from "@grpc/reflection";
import { ClientOptions, ClientProvider, ClientProviderOptions, ClientsModuleOptions, Transport } from "@nestjs/microservices";
import { join } from "path";
import { protobufPackage } from "hero-proto-definition/hero";
import { Logger } from "@nestjs/common";
import { InterceptingCall, Metadata, Requester } from "@grpc/grpc-js";

export const c: ClientsModuleOptions = {
    clients: [
        {
            name: 'HERO_PACKAGE_NAME',
            transport: Transport.GRPC,
            options: {
                channelOptions: {
                    interceptors: []
                },
                package: protobufPackage,
                protoPath: join(__dirname, 'hero.proto')
            }
        }
    ]
};

export const grpcClientOptions: ClientOptions = {
    transport: Transport.GRPC,
    //Only runtime
    options: {
        channelOptions : {
            interceptors: [
                (options, nextCall) => {
                    const logger: Logger = new Logger('GRPC Intercept');

                    logger.verbose('-------------------------------------- GRPC CALL ----------------------------------');
                    logger.warn('Options: ' + JSON.stringify(options));

                    let requester: Requester = {
                        start: (metadata: Metadata, listener, next) => {
                            metadata.add('x-banana-id', '123456789');
                            logger.warn('--Metadata: ' + JSON.stringify(metadata));
                            next(metadata, listener);
                        }
                    };
                    
                    const interceptingCall = new InterceptingCall(
                        nextCall(options),
                        requester
                    );

                    return interceptingCall;
                },
            ],
        },
        package: protobufPackage,
        protoPath: join('./node_modules/hero-proto-definition/dist/src/proto/hero.proto'),
        onLoadPackageDefinition: (pkg, server) => {
            new ReflectionService(pkg).addToServer(server);
        }
    } 
}