import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, SchemaTypes, Types } from "mongoose";
import { ChallengeAccountInterface } from "src/common/interfaces/challenge-account.interface";

@Schema()
export class ChallengeAccount extends Document {
    @Prop({type: SchemaTypes.ObjectId, ref: "Accounts" })
    accountId: Types.ObjectId;

    @Prop({default: []})
    challenges: ChallengeAccountInterface[];
    
    @Prop({ default: Date.now })
    c_at: Date;
}

export const ChallengesAccountSchema = SchemaFactory.createForClass(ChallengeAccount);