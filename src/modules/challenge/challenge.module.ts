import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Challenge, ChallengeSchema } from "src/entities/challenge.entity";
import { ChallengeRepository } from "src/repositories/challenge.repository";
import { ChallengeService } from "./challenge.service";
import { ChallengeController } from "./challenge.controller";
import { RabbitMQAppModule } from "src/provider/rabbitmq.module";
import { AccountModule } from "../account/account.module";
@Module({
    imports: [
            MongooseModule.forFeature([{name: Challenge.name, schema: ChallengeSchema}]), 
            RabbitMQAppModule, 
            AccountModule
        ],
    controllers: [ ChallengeController ],
    providers: [ ChallengeService, ChallengeRepository ],
    exports: [ ChallengeService ]
})
export class ChallengeModule {};