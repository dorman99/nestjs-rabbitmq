import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import configuration from "./configuration";
import * as Joi from "joi";
import { MongoConfigService } from "./config.service";

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({
            load: [configuration],
            validationSchema: Joi.object({
                url: Joi.string().default('mongodb://127.0.0.1:27017/explore-may-2021')
            })
        })
    ],
    providers: [ MongoConfigService ],
    exports: [ MongoConfigService ]
})
export class MongoConfigModule{}