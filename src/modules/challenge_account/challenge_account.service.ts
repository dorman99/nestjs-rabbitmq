import { Injectable } from "@nestjs/common";
import { Types } from "mongoose";
import { ChallengeAccountInterface } from "src/common/interfaces/challenge-account.interface";
import { ChallengeAccount } from "src/entities/challenge_account.entity";
import { ChallengesAccountsRepository } from "src/repositories/challenges_accounts.repository";
// import { AccountService } from "../account/account.service";
// import { ChallengeService } from "../challenge/challenge.service";

@Injectable()
export class ChallengeAccountService {
    constructor(
        private readonly challengesAccountsRepository: ChallengesAccountsRepository
        ) {}

    async findByAccount(id: Types.ObjectId): Promise<ChallengeAccount> {
        return await this.challengesAccountsRepository.findByAccount(id);
    }

    async insert(insertDto: {accountId: Types.ObjectId, challenges: ChallengeAccountInterface[]}): Promise<ChallengeAccount> {
        try {
            let insert = await this.challengesAccountsRepository.insert(insertDto);
            return Promise.resolve(insert);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    async update(challengeAccount: ChallengeAccount) {
        try {
            return await this.challengesAccountsRepository.update({accountId: challengeAccount.accountId, challenges: [...challengeAccount.challenges]});
        } catch (err) {
            return Promise.reject(err);
        }
    }

    async findAll(findDto: {limit: number, skip: number}): Promise<ChallengeAccount[]> {
        return await this.challengesAccountsRepository.findAll({limit: findDto.limit, skip: findDto.skip});
    }

    async findTotalDocument():Promise<number> {
        return await this.challengesAccountsRepository.findTotalDocument();
    }
}