import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Challenge } from "src/entities/challenge.entity";
import { UpdateDto } from "src/modules/challenge/dto/update.dto";

export class ChallengeRepository {
    constructor(@InjectModel(Challenge.name) private readonly challengeModel: Model<Challenge>) {}

    async findAll(limit: number, skip: number): Promise<any[]> {
        const challenges = await this.challengeModel.find().limit(limit).skip(skip).sort({c_at: -1}).exec();
        return Promise.resolve(challenges);
    }

    async create(challengeDTO: {name: string}) {
        const newChallenge = new this.challengeModel({
            name: challengeDTO.name
        });
        try {
            await newChallenge.save();
            return Promise.resolve(newChallenge);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    async find(id: Types.ObjectId): Promise<Challenge> {
        return await this.challengeModel.findOne({_id: id});
    }

    async update(id: Types.ObjectId, updateDto: UpdateDto): Promise<Challenge> {
        return await this.challengeModel.findOneAndUpdate({_id: id}, {$set: updateDto}, {new: true}).exec();
    }
}