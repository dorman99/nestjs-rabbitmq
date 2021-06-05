import { Module } from '@nestjs/common';
import { RabbitMQAppModule } from 'src/provider/rabbitmq.module';
import { AccountModule } from '../account/account.module';
import { ChallengeModule } from '../challenge/challenge.module';
import { ChallengeAccountPubSubService } from './challenge-account-pubsub.service';
import { ChallengeAccountModule } from '../challenge_account/challenge_account.module';

@Module({
    imports: [
        ChallengeModule,
        AccountModule, 
        ChallengeAccountModule, 
        RabbitMQAppModule
    ],
    providers: [ ChallengeAccountPubSubService ],
    exports: [ ChallengeAccountPubSubService ]
})
export class ChallengeAccountPubsubModule {}
