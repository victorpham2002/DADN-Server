import { Schema, Prop, SchemaFactory, MongooseModule, getModelToken } from "@nestjs/mongoose";
import { NextFunction } from "express";
import { HydratedDocument, Model } from "mongoose";
import { triggerArrayToRegex } from "src/common/utilities/setting.utility";
import { Garden, GardenFactory, GardenSchema } from "src/modules/setting/schemas/garden.schema";

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
export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);

export const  UserSchemaFactory = async (gardenModel: Model<Garden> ) => {
 
    const userSchema = UserSchema;
    const deleteTriggers = ['findOneAndDelete'];

    userSchema.pre(triggerArrayToRegex(deleteTriggers), async function(next: NextFunction) {
        try{
            const user = await this.model.findOne(this.getFilter());
            await gardenModel.deleteMany({user: user._id});
            return next();
        }
        catch(err){
            console.log(err);
        }   
    });

    
    return userSchema;
}

export const UserFactory = {
    name: User.name,
    useFactory: UserSchemaFactory,
    imports: [MongooseModule.forFeatureAsync([
        GardenFactory,
    ])],
    inject: [getModelToken(Garden.name)],
}
