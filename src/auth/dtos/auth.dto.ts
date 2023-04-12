import { BaseDto } from "src/common/dtos/base.dto";
import { Expose } from "class-transformer";
import { IsNotEmpty } from "class-validator";

export class SignInDto extends BaseDto{
    @Expose()
    @IsNotEmpty()
    username: string;

    @Expose()
    @IsNotEmpty()
    password: string;
}