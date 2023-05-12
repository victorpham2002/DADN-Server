import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { ConditionOptionTypes, ConditionTypes } from "./types/condition.types";
import { Setting } from "./setting.schema";

@Schema({timestamps: true})
export class Condition{

    @Prop({type: String, enum: ConditionTypes, required: true, default: ConditionTypes.TEMPERATURE})
    type: ConditionTypes;

    @Prop({type: String, enum: ConditionOptionTypes, required: true, default: ConditionOptionTypes.CUSTOMIZE})
    option: ConditionOptionTypes;

    @Prop({type: Number, required: true, default: 0})
    from: number;

    @Prop({type: Number, required: true, default: 1, validate: {
        validator: function(val: number){
            return val >= this.get('from');
        },
        message: () => '"to" field must be greater than or equal "from" field!'
    }})
    to: number;

    @Prop({type: mongoose.Types.ObjectId, ref: 'Setting'})
    setting: Setting;
}
export type ConditionDocument = HydratedDocument<Condition>;
export const ConditionSchema = SchemaFactory.createForClass(Condition);

export const ConditionFactory = {
    name: Condition.name,
    useFactory: async () => { 
        const conditionSchema = ConditionSchema;
        return conditionSchema;
    }
}