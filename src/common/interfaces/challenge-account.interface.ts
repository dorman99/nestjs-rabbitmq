import { Types } from "mongoose";

export interface ChallengeAccountInterface {
    _id: Types.ObjectId,
    name: string,
    status: boolean
}