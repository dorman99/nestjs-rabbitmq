import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { CreateAccountDto } from "src/modules/account/dto/create-account.dto";
import { Account } from "../entities/account.entity";

export class AccountRepository {
    constructor(@InjectModel(Account.name) private readonly accountModel: Model<Account>) {}

    //bisa di update make inteface ga buat result nya ?
    async findAll(limit: number, skip: number) {
        const users = await this.accountModel.find().limit(limit).skip(skip).exec();
        return Promise.resolve(users);
    }

    async create(createAccountDto: CreateAccountDto) {
        const exist = await this.findByUserName(createAccountDto.username);
        if (exist) {
            return Promise.reject({code: 409, message: "Duplicated Account"});
        }

        const newAccount = new this.accountModel({
            name: createAccountDto.name,
            username: createAccountDto.username 
        });
        try {
            newAccount.save();
            return Promise.resolve(newAccount);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    async findByUserName(username: string) {
        return await this.accountModel.findOne({username: username}).exec();
    }

    async find(id: Types.ObjectId): Promise<Account> {
        return await this.accountModel.findOne({_id: id});
    }


    async totalAccount(): Promise<number> {
        return await this.accountModel.countDocuments().exec();
    }
}