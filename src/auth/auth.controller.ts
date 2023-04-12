import {Body, Controller, HttpCode, HttpStatus, Post, UseGuards, Get} from '@nestjs/common';
import { SignInDto } from './dtos/auth.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { GetUser } from './decorators/getUser.decorator';
import { User, UserDocument } from 'src/user/schemas/user.schema';
import { CreateUserDto, ResponeUserDto } from 'src/user/dtos/user.dto';
import { JwtPayload, JwtRefreshTokenPayload } from './types/jwtPayload.type';

@Controller('auth')
export class AuthController{
    constructor(
        private readonly authService: AuthService,
    ){}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    @UseGuards(AuthGuard('local'))
    signIn(@GetUser() user: UserDocument){
        return this.authService.signIn(user);
    }

    @Post('signup')
    signUp(@Body() createUserDto: CreateUserDto): Promise<any>{
        return this.authService.signUp(createUserDto);
    }

    @Post('logout')
    @UseGuards(AuthGuard('jwt'))
    logOut(@GetUser() userPayload: JwtPayload){
        const user = this.authService.logout(userPayload.sub);
        return new ResponeUserDto(user);
    }

    @Get('refresh')
    @UseGuards(AuthGuard('jwt-refresh'))
    refreshToken(@GetUser() userPayload: JwtRefreshTokenPayload): Promise<any> {
        return this.authService.refreshToken(userPayload.sub, userPayload.refreshToken);
    }
}