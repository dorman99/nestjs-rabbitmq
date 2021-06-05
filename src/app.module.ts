import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './config/app/config.module';
import { AccountModule } from './modules/account/account.module';
import { MongoConfigModule } from './config/database/mongo/config.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoConfigService } from './config/database/mongo/config.service';
import { ChallengeModule } from './modules/challenge/challenge.module';
import { ChallengeAccountModule } from './modules/challenge_account/challenge_account.module';
import { ChallengeAccountPubsubModule } from './modules/challenge-account-pubsub/challenge-account-pubsub.module';

@Module({
  imports: [ 
    AppConfigModule, 
    MongoConfigModule, 
    AccountModule, 
    ChallengeModule,
    ChallengeAccountModule,
    ChallengeAccountPubsubModule,
    MongooseModule.forRootAsync({
      inject: [MongoConfigService],
      useFactory: async (mongoConfigService: MongoConfigService) => mongoConfigService.getConfig() 
  }) ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
