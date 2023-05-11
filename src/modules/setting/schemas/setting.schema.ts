import { Schema, Prop, SchemaFactory, MongooseModule, getModelToken } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Model, Mongoose } from "mongoose";
import { Garden } from "./garden.schema";
import { Condition, ConditionFactory, ConditionSchema } from "./condition.schema";
import { NextFunction } from "express";
import { triggerArrayToRegex } from "src/common/utilities/setting.utility";
import { ConditionTypes } from "./types/condition.types";

@Schema({timestamps: true})
export class Setting{

    @Prop({type: mongoose.Types.ObjectId, ref: 'Garden'})
    garden: Garden;
}
export type SettingDocument = HydratedDocument<Setting>;
export const SettingSchema = SchemaFactory.createForClass(Setting);

export const SettingSchemaFactory = async (conditionModel: Model<Condition>) => {
    const settingSchema = SettingSchema;
    const deleteTriggers = ['deleteMany', 'findOneAndDelete'];
    const createTrigger = ['save'];
    settingSchema.pre(triggerArrayToRegex(deleteTriggers), async function(next: NextFunction) {
        try{
            const deletedData = await this.model.find(this.getFilter());
            const deletedDataIds = deletedData.map(data => data._id);
            await conditionModel.deleteMany({setting: {$in: deletedDataIds}})
            return next();
        }
        catch(err){
            console.log(err);
        }    

    })
    
    settingSchema.post(triggerArrayToRegex(createTrigger), async function(doc: SettingDocument, next: NextFunction){
        try{
            const AirHumiConditon = conditionModel.create({setting: doc._id, type: ConditionTypes.AIRHUMIDITY});
            const TempCondition = conditionModel.create({setting: doc._id, type: ConditionTypes.TEMPERATURE});
            const SoilCondition = conditionModel.create({setting: doc._id, type: ConditionTypes.SOILMOISTRURE});
            await Promise.all([AirHumiConditon, TempCondition, SoilCondition]);
        }
        catch(err){
            console.log(err);
        }   
    })

    return settingSchema;
}

export const SettingFactory = {
    name: Setting.name,
    useFactory: SettingSchemaFactory,
    imports: [MongooseModule.forFeatureAsync([ConditionFactory])],
    inject: [getModelToken(Condition.name)]
}