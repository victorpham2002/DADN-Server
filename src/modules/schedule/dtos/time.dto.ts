import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform } from "class-transformer";
import { IsEnum, IsInt, IsNotEmpty, Max, Min } from "class-validator";
import { DeviceTypes } from "../schemas/types/device.type";
import { TimeRepeatType } from "../types/time.type";
import { BaseDto } from "src/common/dtos/base.dto";
import mongoose from "mongoose";
import { TimeActivatedType } from "../schemas/types/time.type";

export class CreateTimeDto extends BaseDto{
    @Expose()
    @ApiProperty()
    @IsNotEmpty()
    @IsInt()
    @Min(0)
    @Max(23)
    @Transform(({ value }) => parseInt(value, 10))
    hour: number;

    @Expose()
    @ApiProperty()
    @IsNotEmpty()
    @IsInt()
    @Min(0)
    @Max(59)
    @Transform(({ value }) => parseInt(value, 10))
    minute: number;

    @Expose()
    @ApiProperty()
    @IsNotEmpty()
    @Min(0)
    @Transform(({ value }) => parseInt(value, 10))
    limit: number;
    
    @Expose()
    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(TimeActivatedType, {each: true})
    activated: TimeActivatedType;

    @Expose()
    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(TimeRepeatType, {each: true})
    repeat: TimeRepeatType;

}

export class TimeQuerryDto extends BaseDto{
    @Expose()
    @IsNotEmpty()
    key: string;

    @Expose()
    @IsNotEmpty()
    @IsEnum(DeviceTypes, {each: true})
    deviceType: DeviceTypes;
}

export class UpdateTimeDto extends BaseDto{
    @Expose()
    @ApiProperty()
    @IsNotEmpty()
    @IsInt()
    @Min(0)
    @Max(23)
    @Transform(({ value }) => parseInt(value, 10))
    hour: number;

    @Expose()
    @ApiProperty()
    @IsNotEmpty()
    @IsInt()
    @Min(0)
    @Max(59)
    @Transform(({ value }) => parseInt(value, 10))
    minute: number;

    @Expose()
    @ApiProperty()
    @IsNotEmpty()
    @Min(0)
    @Transform(({ value }) => parseInt(value, 10))
    limit: number;

    @Expose()
    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(TimeActivatedType, {each: true})
    activated: TimeActivatedType;

    @Expose()
    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(TimeRepeatType, {each: true})
    repeat: TimeRepeatType;
}

export class ResponseTimeDto extends BaseDto{
    @Expose()
    @IsNotEmpty()
    id: mongoose.Types.ObjectId;

    @Expose()
    @IsNotEmpty()
    hour: number;

    @Expose()
    @IsNotEmpty()
    minute: number;

    @Expose()
    @IsNotEmpty()
    limit: number;

    @Expose()
    @IsNotEmpty()
    @IsEnum(TimeRepeatType, {each: true})
    repeat: TimeRepeatType;

    @Expose()
    @IsNotEmpty()
    @IsEnum(TimeActivatedType, {each: true})
    activated: TimeActivatedType;
}