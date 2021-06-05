import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { AccountRepository } from 'src/repositories/account.repository';
import { Account, AccountSchema } from 'src/entities/account.entity';
import { RabbitMQAppModule } from 'src/provider/rabbitmq.module';

@Module({
  imports: [MongooseModule.forFeature([{name: Account.name, schema: AccountSchema}]), RabbitMQAppModule],
  controllers: [ AccountController ],
  providers: [ AccountService, AccountRepository ],
  exports: [ AccountService ]
})
export class AccountModule {}
