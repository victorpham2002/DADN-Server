import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsEnum, IsInt, IsNotEmpty, Max, Min } from "class-validator";
import { DeviceTypes } from "../schemas/types/device.type";
import { TimeRepeatType } from "../types/time.type";
import { BaseDto } from "src/common/dtos/base.dto";

export class CreateTimeDto extends BaseDto{
    @Expose()
    @ApiProperty()
    @IsNotEmpty()
    @IsInt()
    @Min(0)
    @Max(23)
    hour: number;

    @Expose()
    @ApiProperty()
    @IsNotEmpty()
    @IsInt()
    @Min(0)
    @Max(59)
    minute: number;

    @Expose()
    @ApiProperty()
    @IsNotEmpty()
    @Min(0)
    limit: number;

    @Expose()
    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(TimeRepeatType, {each: true})
    repeat: TimeRepeatType;

}