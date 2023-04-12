import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema({timestamps: true})
export class User{
    @Prop({type: String, required: true, default: '', unique: true})
    username: String;

    @Prop({type: String, required: true, default: ''})
    password: String;

    @Prop({type: String, required: true, default: ''})
    adafruitToken: String;

    @Prop({type: String, default: null})
    refreshToken: string;
}
export type UserDocument = HydratedDocument<User>
export const UserSchema = SchemaFactory.createForClass(User)