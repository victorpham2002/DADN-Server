import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform } from "class-transformer";
import { IsInt, IsNotEmpty, Max, Min } from "class-validator";
import { BaseDto } from "src/common/dtos/base.dto";

export class CreateDataDto extends BaseDto{
    @ApiProperty()
    @Expose()
    @IsNotEmpty()
    value: number;

}

export class ResponseDataDto extends BaseDto{
    @Expose()
    id: string;

    @Expose()
    @IsNotEmpty()
    value: number;

    @Expose()
    feed_id: number;

    @Expose()
    feed_key: string;

    @Expose()
    expiration: Date;

}

export class ChangeFanSpeedDto extends BaseDto{
    @ApiProperty()
    @Expose()
    @IsNotEmpty()
    @IsInt()
    @Min(0)
    @Max(100)
    @Transform(({ value }) => parseInt(value, 10))
    value: number;
}