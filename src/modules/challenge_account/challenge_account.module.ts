import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ChallengeAccount, ChallengesAccountSchema } from "src/entities/challenge_account.entity";
import { ChallengesAccountsRepository } from "src/repositories/challenges_accounts.repository";
import { AccountModule } from "../account/account.module";
import { ChallengeModule } from "../challenge/challenge.module";
import { ChallengeAccountController } from "./challenge_account.controller";
import { ChallengeAccountService } from "./challenge_account.service";

@Module({
    imports: [
        MongooseModule.forFeature([{name: ChallengeAccount.name, schema: ChallengesAccountSchema}]), 
        AccountModule, 
        ChallengeModule
    ], 
    controllers: [ ChallengeAccountController ],
    providers: [ ChallengeAccountService, ChallengesAccountsRepository ],
    exports: [ ChallengeAccountService ]
})
export class ChallengeAccountModule {}