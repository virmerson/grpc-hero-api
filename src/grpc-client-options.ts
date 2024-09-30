import { ReflectionService } from "@grpc/reflection";
import { ClientOptions, Transport } from "@nestjs/microservices";
import { join } from "path";
import { protobufPackage } from "hero-proto-definition/interfaces/hero"


export const grpcClientOptions:ClientOptions = {
    transport: Transport.GRPC,
    //Only runtime
    options:{
        package: protobufPackage,
        protoPath:join (__dirname ,  'node_modules/hero-proto-definition/proto/hero.proto'),
        onLoadPackageDefinition: (pkg, server)=>{
            new ReflectionService (pkg).addToServer(server);
        }
    }
}