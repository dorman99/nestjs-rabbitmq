import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { HttpException, Injectable } from "@nestjs/common";
import { Types } from "mongoose";
import constant from "src/common/utils/constant";
import { Challenge } from "src/entities/challenge.entity";
import { ChallengeRepository } from "src/repositories/challenge.repository";
import { ChallengeMessagePubSub } from "../challenge-account-pubsub/dto/interface/challenge-message.interface";
import { UpdateDto } from "./dto/update.dto";

@Injectable()
export class ChallengeService {
    constructor(
        private readonly challengeRepository: ChallengeRepository, 
        private amqpConnection: AmqpConnection
        ) {}

    async create(createChellangeDTO: {name: string}) {
        try {
            let routes = constant.exchanges.challenge.create.routingKeys;
            let routing = routes[Math.floor(Math.random() * routes.length)];
            let challenge = await this.challengeRepository.create(createChellangeDTO);
            await this.amqpConnection.publish(constant.exchanges.challenge.create.name, routing, {limit: 1000, skip: 0, challenge});
            return Promise.resolve(challenge);
        } catch (err) {
            throw new HttpException('Bad request', 4)
            // return Promise.reject(err);
        }
    }

    async findAll(limit: number, skip: number): Promise< any [] > {
        // await 1
        let x = false;
        if (!x) {
            throw new HttpException('not found', 404)
        } 
        // await 2
        throw new HttpException("bad request", 400);
        // return this.challengeRepository.findAll(limit, skip);
    }

    async find(id: Types.ObjectId): Promise<Challenge> {
        return await this.challengeRepository.find(id);
    }

    async remove(id: Types.ObjectId) {
        let routes = constant.exchanges.challenge.remove.routingKeys;
        let routing = routes[Math.floor(Math.random() * routes.length)];
        try {
            await this.amqpConnection.publish(constant.exchanges.challenge.remove.name, routing, {id: id}, {persistent: true});
            return true;
        } catch (err) {
            console.log(err);
            return Promise.reject(err);
        }
    }

    async update(id: Types.ObjectId, updateDto: UpdateDto): Promise<Challenge> {
        try {
            let challenge = await this.challengeRepository.update(id, updateDto);
            let routes = constant.exchanges.challenge.update.routingKeys;
            let routing = routes[Math.floor(Math.random() * routes.length)];
            const msg: ChallengeMessagePubSub = {
                id: challenge.id
            };
            await this.amqpConnection.publish(constant.exchanges.challenge.update.name, routing, msg);
            return Promise.resolve(challenge);
        } catch (err) {
            return Promise.reject(err);
        }
    }
}