import { Schema, Prop, SchemaFactory, MongooseModule, getModelToken } from "@nestjs/mongoose";
import mongoose, { Document, HydratedDocument, Model } from "mongoose";
import { User } from "src/modules/user/schemas/user.schema";
import { Setting, SettingFactory, SettingSchema } from "./setting.schema";
import { NextFunction } from "express";
import { triggerArrayToRegex } from "src/common/utilities/setting.utility";
import { BaseSchema } from "src/common/schemas/base.schema";

@Schema({timestamps: true})
export class Garden extends BaseSchema{

    @Prop({type: String, required: true, default: ''})
    name: String;

    @Prop({type: String, required: true, default: ''})
    key: String;

    @Prop({type: mongoose.Types.ObjectId, ref: 'User'})
    user: User;
}
export type GardenDocument = HydratedDocument<Garden>;
export const GardenSchema = SchemaFactory.createForClass(Garden);

export const GardenSchemaFactory = async (settingModel: Model<Setting>) => {
    const gardenSchema = GardenSchema;
    const deleteTriggers = ['deleteMany', 'findOneAndDelete'];
    const createTrigger = ['save'];

    Garden.registerHooks(() => {
        gardenSchema.pre(triggerArrayToRegex(deleteTriggers), async function(next: NextFunction) {
            try{
                const deletedData = await this.model.find(this.getFilter());
                const deletedDataIds = deletedData.map(data => data._id);
                await settingModel.deleteMany({garden: {$in: deletedDataIds}})
                return next();
            }
            catch(err){
                console.log(err);
            }   
        })
    
        gardenSchema.post(triggerArrayToRegex(createTrigger), async function(doc: GardenDocument, next: NextFunction){
            try{
                await settingModel.create({garden: doc._id});
                return next();
                
            }
            catch(err){
                console.log(err);
            }   
        })
    }, Garden);
    return gardenSchema;
}

export const GardenFactory = {
    name: Garden.name,
    useFactory: GardenSchemaFactory,
    imports: [MongooseModule.forFeatureAsync([SettingFactory])],
    inject: [getModelToken(Setting.name)],
}