import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Setting } from "src/modules/setting/schemas/setting.schema";
import { Device } from "./device.schema";
import { TimeRepeatType } from "../types/time.type";
import { TimeActivatedType } from "./types/time.type";


@Schema({timestamps: true})
export class Time{
    @Prop({type: Number, required: true, default: 0, validate: {
        validator: function(val: number){
            return 0 <= val && val < 23;
        },
        message: () => '"hour" must in range 0 to 23'
    }})
    hour: number;

    @Prop({type: Number, required: true, default: 0, validate: {
        validator: function(val: number){
            return 0 <= val && val < 59;
        },
        message: () => '"minute" must in range 0 to 59'
    }})
    minute: number;

    @Prop({type: Number, required: true, default: 0})
    limit: number;

    @Prop({type: String, enum: TimeRepeatType, required: true, default: TimeRepeatType.ONCE})
    repeat: TimeRepeatType;

    @Prop({type: String, enum: TimeActivatedType, required: true, default: TimeActivatedType.ON})
    activated: TimeActivatedType;

    @Prop({type: mongoose.Types.ObjectId, ref: 'Device'})
    device: Device;
}

export type TimeDocument = HydratedDocument<Time>;
export const TimeSchema = SchemaFactory.createForClass(Time);

export const TimeFactory = {
    name: Time.name,
    useFactory: () => {
        const timeSchema = TimeSchema;
        return timeSchema;
    }
}