import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Controller, Get, Post, Body, Query, Res } from '@nestjs/common';
import { AppResponse } from 'src/common/response.base';
import constant from 'src/common/utils/constant';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';

@Controller('accounts')
export class AccountController {
  constructor(
    private readonly accountsService: AccountService,
    private amqpCon: AmqpConnection
    ) {}

  @Post()
  async create(@Res() res, @Body() createAccountDto: CreateAccountDto): Promise<AppResponse> {
    try {
      const account = await this.accountsService.create(createAccountDto);
      const route = constant.exchanges.user.register.routingKeys[Math.floor(Math.random() * constant.exchanges.user.register.routingKeys.length)];
      await this.amqpCon.publish(constant.exchanges.user.register.name, route, {accountId: account._id});
      return AppResponse.ok(res, account);
    } catch (err) {
      if (err.code === 409) {
        return AppResponse.duplicated(res, [{username: 'Duplicated Username'}]);
      }
      return AppResponse.badRequest(res, null);
    }
  }

  @Get()
  async findAll(@Query('limit') limit, @Query('skip') skip, @Res() res): Promise<AppResponse>
   {
    try {
      let results = await this.accountsService.findAll(parseInt(limit || 10), parseInt(skip || 0));
      let pagination = {results: results, count: results.length}
      return AppResponse.ok(res, pagination);
    } catch (e) {
      return AppResponse.badRequest(res, [{data: ["not valid data"]}]);
    }
  }
}
