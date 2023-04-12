import { BaseDto } from "src/common/dtos/base.dto";
import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { IsNotEmpty,Length } from "class-validator";

export class UserDto extends BaseDto {
    @Expose()
    username: string;

    @Expose()
    adafruitToken: string;
        
    @Expose()
    id: string;
    
    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;

    @Expose()
    password: string;
}

export class ResponeUserDto extends BaseDto{
    @Expose()
    username: string;

    @Expose()
    adafruitToken: string;
        
    @Expose()
    id: string;
    
    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;

    // @Expose()
    // password: string;
}

export class CreateUserDto extends BaseDto{
    @Expose()
    @IsNotEmpty()
    username: string;

    @Expose()
    @IsNotEmpty()
    @Length(8, 20)
    password: string;

    @Expose()
    @IsNotEmpty()
    adafruitToken: string;

    @Expose()
    refreshToken: string;
}

export class UpdateUserDto extends BaseDto{
    @Expose()
    password: string;

    @Expose()
    adafruitToken: string;

    @Expose()
    refreshToken: string;
}

