import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Challenge extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ default: Date.now })
    readonly c_at: Date;
}

export const ChallengeSchema = SchemaFactory.createForClass(Challenge);