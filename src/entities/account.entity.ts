import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Account extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true })
    username: string;

    @Prop({ default: Date.now })
    c_at: Date;
}

export const AccountSchema = SchemaFactory.createForClass(Account);