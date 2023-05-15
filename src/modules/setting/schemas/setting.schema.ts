import { Schema, Prop, SchemaFactory, MongooseModule, getModelToken } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Model, Mongoose } from "mongoose";
import { Garden } from "./garden.schema";
import { Condition, ConditionFactory, ConditionSchema } from "./condition.schema";
import { NextFunction } from "express";
import { triggerArrayToRegex } from "src/common/utilities/setting.utility";
import { ConditionTypes } from "./types/condition.types";
import { Device, DeviceFactory, DeviceSchemaFactory } from "src/modules/schedule/schemas/device.schema";
import { DeviceModeTypes, DeviceTypes } from "src/modules/schedule/schemas/types/device.type";
import { BaseSchema } from "src/common/schemas/base.schema";

@Schema({timestamps: true})
export class Setting extends BaseSchema{
    // static isRegisteredHooks = false;

    @Prop({type: mongoose.Types.ObjectId, ref: 'Garden'})
    garden: Garden;
}
export type SettingDocument = HydratedDocument<Setting>;
export const SettingSchema = SchemaFactory.createForClass(Setting);

export const SettingSchemaFactory = async (conditionModel: Model<Condition>, deviceModel: Model<Device>) => {
    const settingSchema = SettingSchema;
    const deleteTriggers = ['deleteMany', 'findOneAndDelete'];
    const createTrigger = ['save'];        
        Setting.registerHooks(() => {
            settingSchema.pre(triggerArrayToRegex(deleteTriggers), async function(next: NextFunction) {
                try{
                    const deletedData = await this.model.find(this.getFilter());
                    const deletedDataIds = deletedData.map(data => data._id);
                    await Promise.all([
                        conditionModel.deleteMany({setting: {$in: deletedDataIds}}),
                        deviceModel.deleteMany({setting: {$in: deletedDataIds}})
                    ])
                    return next();
                }
                catch(err){
                    console.log(err);
                }    
            })

            settingSchema.post(triggerArrayToRegex(createTrigger), async function(doc: SettingDocument, next: NextFunction){
                try{

                    await Promise.all([
                        conditionModel.create({setting: doc._id, type: ConditionTypes.AIRHUMIDITY}),
                        conditionModel.create({setting: doc._id, type: ConditionTypes.TEMPERATURE}),
                        conditionModel.create({setting: doc._id, type: ConditionTypes.SOILMOISTRURE}),
                        deviceModel.create({setting: doc._id, type: DeviceTypes.FAN}),
                        deviceModel.create({setting: doc._id, type: DeviceTypes.PUMP}),
                    ]);
                }
                catch(err){
                    console.log(err);
                }   
            })
        }, Setting)

    return settingSchema;
}

export const SettingFactory = {
    name: Setting.name,
    useFactory: SettingSchemaFactory,
    imports: [MongooseModule.forFeatureAsync([ConditionFactory, DeviceFactory])],
    inject: [getModelToken(Condition.name), getModelToken(Device.name)],
}