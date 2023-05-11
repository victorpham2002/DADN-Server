import { Expose } from "class-transformer";
import { IsNotEmpty } from "class-validator";
import { BaseDto } from "src/common/dtos/base.dto";

export class CreateGardenDto extends BaseDto{
    @Expose()
    @IsNotEmpty()
    name: string;

    @Expose()
    @IsNotEmpty()
    key: string;
}

export class DeleteGardenDto extends BaseDto{
    @Expose()
    @IsNotEmpty()
    key: string;
}

export class RepsonseGardenDto extends BaseDto{
    @Expose()
    name: string; 

    @Expose()
    key: string; 

    @Expose()
    user: string;
}

export class MapGardenDto extends BaseDto{
    @Expose()
    @IsNotEmpty()
    name: string;

    @Expose()
    @IsNotEmpty()
    key: string;
}