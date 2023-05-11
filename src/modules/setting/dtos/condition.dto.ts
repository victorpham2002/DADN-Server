import { Expose } from "class-transformer";
import { IsEnum, IsNotEmpty } from "class-validator";
import { BaseDto } from "src/common/dtos/base.dto";
import { ConditionOptionTypes, ConditionTypes } from "../schemas/types/condition.types";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateConditionDto extends BaseDto{
    @Expose()
    @IsNotEmpty()
    @IsEnum(ConditionTypes, {each: true})
    @ApiProperty()
    type: ConditionTypes;

    @Expose()
    @IsNotEmpty()
    @IsEnum(ConditionOptionTypes, {each: true})
    @ApiProperty()
    option: ConditionOptionTypes;

    @Expose()
    @IsNotEmpty()
    @ApiProperty()
    from: number;

    @Expose()
    @IsNotEmpty()
    @ApiProperty()
    to: number;
} 

export class ResponseConditionDto extends BaseDto{
    @Expose()
    @IsNotEmpty()
    type: ConditionTypes;

    @Expose()
    @IsNotEmpty()
    option: ConditionOptionTypes;

    @Expose()
    @IsNotEmpty()
    from: number;

    @Expose()
    @IsNotEmpty()
    to: number;
}