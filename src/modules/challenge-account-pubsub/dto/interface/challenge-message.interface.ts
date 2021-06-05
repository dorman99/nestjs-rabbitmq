import { Types } from "mongoose";

export interface ChallengeMessagePubSub {
    id: Types.ObjectId,
    limit?: number,
    skip?: number,
    maxAmountOfAccount?: number
}