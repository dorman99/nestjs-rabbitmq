import { AmqpConnection, Nack, RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";
import { Types } from "mongoose";
import { ChallengeAccountInterface } from "src/common/interfaces/challenge-account.interface";
import constant from "src/common/utils/constant";
import { Challenge } from "src/entities/challenge.entity";
import { AccountService } from "../account/account.service";
import { ChallengeService } from "../challenge/challenge.service";
import { ChallengeAccountService } from "../challenge_account/challenge_account.service";
import { ChallengeMessagePubSub } from "./dto/interface/challenge-message.interface";

@Injectable()
export class ChallengeAccountPubSubService {
    constructor(
        private readonly accountService: AccountService,
        private readonly challengeService: ChallengeService,
        private challengeAccountService: ChallengeAccountService,
        private amqpConnection: AmqpConnection
    ) {}

    @RabbitSubscribe({
        exchange: constant.exchanges.user.register.name,
        routingKey: constant.exchanges.user.register.routingKeys,
        queue: constant.exchanges.user.register.queue
    })
    public async pubSubNewRegister(msg: {accountId: Types.ObjectId}) {
        console.log("Incoming New User To Map Challenges");
        try {
            const account = await this.accountService.find(msg.accountId);
            const challenges = await this.challengeService.findAll(100, 0);
            if (!account) {
                return new Nack(true);
            }
            const insertDto = this._dtoCreate(account.id, challenges);
            await this.challengeAccountService.insert(insertDto);
            return new Nack();
        } catch (err) {
            if (err) {
                console.log(err);
                return new Nack(true);
            }
            return new Nack();
        };
    }

    _dtoCreate(accountId, challenges): {accountId: Types.ObjectId, challenges: ChallengeAccountInterface[]} {
        return {
            accountId,
            challenges: challenges.map(el => {
                let challenge: ChallengeAccountInterface;
                challenge = {
                    _id: el._id,
                    name: el.name,
                    status: false
                }
                return challenge;
            })
        }
    }

    @RabbitSubscribe({
        exchange: constant.exchanges.challenge.create.name,
        routingKey: constant.exchanges.challenge.create.routingKeys,
        queue: constant.exchanges.challenge.create.queue
    })
    public async pubSubCreateChallenge(msg: {challenge: Challenge, limit?: number, skip?: number, totalAccount?: number} ) {
        console.log("Create New Challenges ---- ");
        const limit = msg.limit || 1000;
        const skip = msg.skip || 0;
        const cl: ChallengeAccountInterface = {
            _id: Types.ObjectId(msg.challenge._id),
            name: msg.challenge.name,
            status: false
        }
        let maxNumOfAccount = msg.totalAccount || 0;
        if (!msg.totalAccount) {
            maxNumOfAccount = await this.accountService.totalAccount();
        }
        const accounts = await this.accountService.findAll(limit, skip);
        if (accounts.length == 0) {
            return new Nack();
        }
        for(let i = 0; i < accounts.length; i++) {
            let challengeUser = await this.challengeAccountService.findByAccount(accounts[i]._id);
            if (!challengeUser) {
                this.amqpConnection.publish(constant.exchanges.user.register.name, "", {accountId: accounts[i]._id})
                continue;
            } else if (challengeUser) {
                challengeUser.challenges.unshift(cl);
                await this.challengeAccountService.update(challengeUser);
            }
        }
        let routes = constant.exchanges.challenge.create.routingKeys;
        let routing = routes[Math.floor(Math.random() * routes.length)];
        let newMsg = Object.assign(msg, {limit: limit, skip: skip + limit, totalAccount: maxNumOfAccount})
        await this.amqpConnection.publish(constant.exchanges.challenge.create.name, routing, newMsg);
    }
    
    @RabbitSubscribe({
        exchange: constant.exchanges.challenge.remove.name,
        routingKey: constant.exchanges.challenge.remove.routingKeys,
        queueOptions: {
            durable: false
        }
    })
    public async pubSubRemoveChallenge(msg: ChallengeMessagePubSub) {
        console.log("Removing Challenge From Accounts...");
        const limit = msg.limit || 1000;
        const skip = msg.skip || 0;
        let maxAmountOfAccount = msg.maxAmountOfAccount || 0;
        // harus dikasih stop == maxAmountOfAccount
        if (maxAmountOfAccount == 0) {
            maxAmountOfAccount = await this.challengeAccountService.findTotalDocument();
        }
        const challengeAccount = await this.challengeAccountService.findAll({limit, skip});
        
        if (challengeAccount.length == 0) {
            return new Nack();
        }

        for(let i = 0; i < challengeAccount.length; i++) {
            let account = challengeAccount[i];
            let idx = account.challenges.findIndex(c => {
                return c._id == msg.id;
            });

            if (idx > -1) {
                account.challenges.splice(idx, 1);
                await this.challengeAccountService.update(account);
            }
        }
        let routes = constant.exchanges.challenge.remove.routingKeys;
        let routing = routes[Math.floor(Math.random() * routes.length)];
        this.amqpConnection.publish(constant.exchanges.challenge.remove.name, routing, {id: msg.id, limit: limit, skip: limit + skip, maxAmountOfAccount});
    }

    @RabbitSubscribe({
        exchange: constant.exchanges.challenge.update.name,
        routingKey: constant.exchanges.challenge.update.routingKeys
    })
    public async pubSubUpdateChallenge(msg: ChallengeMessagePubSub) {
        console.log("Update Challenge Incoming ....");
        const limit = msg.limit || 10;
        const skip = msg.skip || 0;
        let maxAmountOfAccount = msg.maxAmountOfAccount || 0;
        if (maxAmountOfAccount == 0) {
            maxAmountOfAccount = await this.challengeAccountService.findTotalDocument();
        }
        if (skip > maxAmountOfAccount) {
            return new Nack();
        }
        
        const challengeAccount = await this.challengeAccountService.findAll({limit, skip});
        const challenge = await this.challengeService.find(msg.id);
        if (challengeAccount.length == 0) {
            return new Nack();
        }
        for(let i = 0; i < challengeAccount.length; i++) {
            const account = challengeAccount[i];
            let challenges = account.challenges;
            challenges.forEach(c => {
                if(c._id == challenge._id) {
                    c.name = challenge.name
                }
            });
            await this.challengeAccountService.update(account);
        }
        let routes = constant.exchanges.challenge.update.routingKeys;
        let routing = routes[Math.floor(Math.random() * routes.length)];
        const newMsg: ChallengeMessagePubSub = {
            id: challenge.id,
            limit: limit,
            skip: limit + skip,
            maxAmountOfAccount: maxAmountOfAccount
        };
        await this.amqpConnection.publish(constant.exchanges.challenge.update.name, routing, newMsg);
        return new Nack(false);
    }
}