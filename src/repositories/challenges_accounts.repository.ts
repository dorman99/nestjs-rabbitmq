import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { ChallengeAccountInterface } from "src/common/interfaces/challenge-account.interface";
import { ChallengeAccount } from "src/entities/challenge_account.entity";

export class ChallengesAccountsRepository {
    constructor(
        @InjectModel(ChallengeAccount.name) private readonly challengesAccountsModel: Model<ChallengeAccount>
    ){}

    async findByAccount(id: Types.ObjectId) {
        return await this.challengesAccountsModel.findOne({accountId: id});
    }

    async insert(insertDto: {accountId: Types.ObjectId, challenges: ChallengeAccountInterface[]}) {
        const challengesAccounts = new this.challengesAccountsModel({
            accountId: insertDto.accountId,
            challenges: insertDto.challenges
        });
        try {
            await challengesAccounts.save();
            return Promise.resolve(challengesAccounts);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    async update(updateDto: {accountId: Types.ObjectId, challenges: any[]}) {
        return await this.challengesAccountsModel.updateOne({accountId: updateDto.accountId}, {$set: {challenges: updateDto.challenges}})
    }

    async findAll(findDto: {limit: number, skip: number}): Promise<ChallengeAccount[]> {
        return await this.challengesAccountsModel.find().limit(findDto.limit).skip(findDto.skip).exec();
    }

    async findTotalDocument(): Promise<number> {
        return await this.challengesAccountsModel.countDocuments().exec();
    }
}