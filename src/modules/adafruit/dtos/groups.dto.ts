import { Expose, Type } from "class-transformer";
import { IsNotEmpty } from "class-validator";
import { BaseDto } from "src/common/dtos/base.dto";


export class FeedDto extends BaseDto{
    @Expose()
    @IsNotEmpty()
    id: string;

    @Expose()
    @IsNotEmpty()
    key: string;

    @Expose()
    @IsNotEmpty()
    name: string;

    @Expose()
    @IsNotEmpty()
    last_value: number;

}


export class GroupDto extends BaseDto{
    @Expose()
    @IsNotEmpty()
    id: string;

    @Expose()
    @IsNotEmpty()
    key: string;

    @Expose()
    @IsNotEmpty()
    name: string;

    @Expose()
    @IsNotEmpty()
    @Type(() => FeedDto)
    feeds: FeedDto[];
}