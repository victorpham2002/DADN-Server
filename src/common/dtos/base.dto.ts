import { plainToInstance, plainToClass, ClassConstructor, Expose } from "class-transformer"
import mongoose, { mongo } from "mongoose";
// import {ClassConstructor} from '@nestjs/common';

export class BaseDto {
    
    constructor(obj: Object){
        return plainToInstance(this.constructor as any, obj, {excludeExtraneousValues: true});
    }
}