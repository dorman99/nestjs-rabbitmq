import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { Account } from 'src/entities/account.entity';
import { AccountRepository } from 'src/repositories/account.repository';
import { CreateAccountDto } from './dto/create-account.dto';

@Injectable()
export class AccountService {
  constructor(private readonly accountRepository: AccountRepository) {};

  create(createAccountDto: CreateAccountDto) {
      return this.accountRepository.create(createAccountDto);
  }

  async findAll(limit: number, skip: number) {
    return await this.accountRepository.findAll(limit, skip);
  }

  async find(id: Types.ObjectId): Promise<Account> {
    return await this.accountRepository.find(id);
  }

  remove(id: number) {
    return `This action removes a #${id} account`;
  }

  totalAccount(): Promise<number> {
    return this.accountRepository.totalAccount();
  }
}