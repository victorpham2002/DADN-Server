import { BaseDto } from "src/common/dtos/base.dto";
import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { IsNotEmpty,Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

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
    @ApiProperty()
    @Expose()
    @IsNotEmpty()
    username: string;

    @ApiProperty()
    @Expose()
    @IsNotEmpty()
    @Length(8, 20)
    password: string;

    @ApiProperty()
    @Expose()
    @IsNotEmpty()
    adafruitToken: string;

    @Expose()
    refreshToken: string;
}

export class UpdateUserDto extends BaseDto{
    @ApiProperty()
    @Expose()
    password: string;

    @ApiProperty()
    @Expose()
    adafruitToken: string;

    @Expose()
    refreshToken: string;
}

