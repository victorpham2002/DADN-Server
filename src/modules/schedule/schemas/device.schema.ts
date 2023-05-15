import { MongooseModule, Prop, Schema, SchemaFactory, getModelToken } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Model } from "mongoose";
import { Setting } from "src/modules/setting/schemas/setting.schema";
import { DeviceModeTypes, DeviceTypes } from "./types/device.type";
import { Time, TimeFactory } from "./time.schema";
import { triggerArrayToRegex } from "src/common/utilities/setting.utility";
import { NextFunction } from "express";
import { BaseSchema } from "src/common/schemas/base.schema";
import { Garden } from "src/modules/setting/schemas/garden.schema";


@Schema({timestamps: true})
export class Device extends BaseSchema{
    @Prop({type: String, enum: DeviceTypes, required: true, default: DeviceTypes.FAN})
    type: DeviceTypes;

    @Prop({type: String, enum: DeviceModeTypes, required: true, default: DeviceModeTypes.CUSTOMIZE})
    mode: DeviceModeTypes;

    @Prop({type: mongoose.Types.ObjectId, ref: 'Setting'})
    setting: Setting;
}

export type DeviceDocument = HydratedDocument<Device>;
export const DeviceSchema = SchemaFactory.createForClass(Device);


export const DeviceSchemaFactory = async (timeModel: Model<Time>) => {
    const deviceSchema = DeviceSchema;
    const deleteTriggers = ['deleteMany', 'findOneAndDelete'];
    const createTrigger = ['save'];

    Device.registerHooks(() => {
        deviceSchema.pre(triggerArrayToRegex(deleteTriggers), async function(next: NextFunction){
            try{
                const deletedData = await this.model.find(this.getFilter());
                const deletedDataIds = deletedData.map(data => data._id);
                await timeModel.deleteMany({device: {$in: deletedDataIds}})
                return next();
            }
            catch(err){
                console.log(err);
            }    
    
        })
    }, Device)

    

    return deviceSchema;
}

export const DeviceFactory = {
    name: Device.name,
    useFactory: DeviceSchemaFactory,
    imports: [MongooseModule.forFeatureAsync([TimeFactory])],
    inject: [getModelToken(Time.name)]

}