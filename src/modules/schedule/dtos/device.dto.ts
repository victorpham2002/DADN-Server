import { Expose } from "class-transformer";
import { IsEnum, IsNotEmpty } from "class-validator";
import { BaseDto } from "src/common/dtos/base.dto";
import { DeviceModeTypes, DeviceTypes } from "../schemas/types/device.type";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateDeviceDto extends BaseDto{
    @Expose()
    @IsNotEmpty()
    @IsEnum(DeviceTypes, {each: true})
    @ApiProperty()
    type: DeviceTypes;

    @Expose()
    @IsNotEmpty()
    @IsEnum(DeviceModeTypes, {each: true})
    @ApiProperty()
    mode: DeviceModeTypes;
}

export class ResponseDeviceDto extends BaseDto{
    @Expose()
    @IsNotEmpty()
    @IsEnum(DeviceTypes, {each: true})
    type: DeviceTypes;

    @Expose()
    @IsNotEmpty()
    @IsEnum(DeviceModeTypes, {each: true})
    mode: DeviceModeTypes;
}