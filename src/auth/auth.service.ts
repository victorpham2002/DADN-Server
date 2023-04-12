import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from "src/user/schemas/user.schema";
import { JwtPayload } from "./types/jwtPayload.type";
import jwtConfig from "src/configs/jwt/jwt.config";
import bcryptConfig from "src/configs/bcrypt/bcrypt.config";
import { CreateUserDto, UpdateUserDto } from "src/user/dtos/user.dto";

@Injectable()
export class AuthService{
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        
    ){}

    async signUp(createUserDto: CreateUserDto){
        const user = await this.userService.createNewUser(createUserDto);
        const tokens = await this.getTokens(user._id as unknown as string, user.username as unknown as string)
        await this.updateRefreshToken(user._id as unknown as string, tokens.refreshToken);
        return tokens;
    }

    async signIn(user: UserDocument): Promise<any>{
        const payload = { username: user.username as string, sub: user._id as unknown as string} as JwtPayload;
        const tokens =  await this.getTokens(payload.sub, payload.username);
        await this.updateRefreshToken(payload.sub, tokens.refreshToken)
        return tokens;
    }

    async getTokens(userId: string, username: string): Promise<any>{
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                {
                    sub: userId,
                    username: username
                } as JwtPayload,
                {
                    secret: jwtConfig.access,
                    expiresIn: jwtConfig.expiresIn.access,
                }
            ),

            this.jwtService.signAsync(
                {
                    sub: userId,
                    username: username
                } as JwtPayload,
                {
                    secret: jwtConfig.refresh,
                    expiresIn: jwtConfig.expiresIn.refresh,
                }
            )
        ]);

        return {accessToken, refreshToken};
    }

    async logout(userId: string) {
        return this.userService.updateUser(userId, { refreshToken: null } as UpdateUserDto);
    }
    
    async updateRefreshToken(userId: string, refreshToken: string){
        const hashedRefreshToken = await bcrypt.hash(refreshToken, bcryptConfig.rounds);
        return this.userService.updateUser(userId, { refreshToken: hashedRefreshToken } as UpdateUserDto);
    }

    async validateUser(username: string, password: string): Promise<any>{
        return this.userService.validateUser(username, password);
    }

    async refreshToken(userId: string, refreshToken: string): Promise<any>{
        const user = await this.userService.getUserById(userId);
        if(!user || !user.refreshToken){
            throw new HttpException('Access denied', HttpStatus.FORBIDDEN);
        }

        if(!bcrypt.compare(refreshToken, user.refreshToken)){
            throw new HttpException('Access denied', HttpStatus.FORBIDDEN);           
        }

        const tokens = this.getTokens(userId, user.username as unknown as string);
        await this.updateRefreshToken(userId, refreshToken);

        return tokens;
    }
}