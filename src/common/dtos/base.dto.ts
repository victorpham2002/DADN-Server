import { plainToInstance, ClassConstructor, Expose } from "class-transformer"
import mongoose, { mongo } from "mongoose";
// import {ClassConstructor} from '@nestjs/common';

export class BaseDto {
    constructor(data?: any) {
        if (data) {
          Object.assign(this, data);
        }
    }

    static plainToInstance(obj: Object | Object[]) : any | any[] {
        return plainToInstance(this, obj, {excludeExtraneousValues: true});
    }
}