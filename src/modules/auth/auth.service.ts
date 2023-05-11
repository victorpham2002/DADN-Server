import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { UserService } from "src/modules/user/user.service";
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from "src/modules/user/schemas/user.schema";
import { JwtPayload } from "./types/jwtPayload.type";
import jwtConfig from "src/configs/jwt/jwt.config";
import bcryptConfig from "src/configs/bcrypt/bcrypt.config";
import { CreateUserDto, UpdateUserDto } from "src/modules/user/dtos/user.dto";
import { StoreService } from "src/modules/store/store.service";
import { HttpService } from "@nestjs/axios";
import AdafruitConfig from "src/configs/adafruit/adafruit.config";
import { catchError, firstValueFrom } from "rxjs";
import { AxiosError } from "axios";
@Injectable()
export class AuthService{
    onlineUserList : Map<string, any>;

    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly storeService: StoreService,
        private readonly httpService: HttpService
    ){
        this.onlineUserList = new Map(Object.entries(storeService.load() as Object));
    }

    async signUp(createUserDto: CreateUserDto){
        const user = await this.userService.createNewUser(createUserDto);
        const tokens = await this.getTokens(user._id as unknown as string, user.username as unknown as string)
        await this.updateRefreshToken(user._id as unknown as string, tokens.refreshToken);
        
        await this.addOnlineUser(user._id.toString(), user.adafruitToken as string);
        return tokens;
    }

    async signIn(user: UserDocument): Promise<any>{
        const payload = { username: user.username as string, sub: user._id as unknown as string} as JwtPayload;
        const tokens =  await this.getTokens(payload.sub, payload.username);
        await this.updateRefreshToken(payload.sub, tokens.refreshToken);
        
        await this.addOnlineUser(user._id.toString(), user.adafruitToken as string);
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
        this.deleteOnlineUser(userId);
        return this.userService.updateUser(userId, { refreshToken: null } as UpdateUserDto);
    }
    
    private async updateRefreshToken(userId: string, refreshToken: string){
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

        if(!bcrypt.compareSync(refreshToken, user.refreshToken)){
            throw new HttpException('Access denied', HttpStatus.FORBIDDEN);           
        }

        const tokens = this.getTokens(userId, user.username as unknown as string);
        await this.updateRefreshToken(userId, refreshToken);

        return tokens;
    }

    private async addOnlineUser(userId: string, adafruitToken: string){
    
        const url = `${AdafruitConfig.url}${AdafruitConfig.api.getUserInfo}?${AdafruitConfig.XAioKey}=${adafruitToken}`;
        let res = await firstValueFrom(
            this.httpService.get(url)
                .pipe(
                    catchError((error: AxiosError) => {
                        throw new HttpException('AdafruitToken does not exist', HttpStatus.UNAUTHORIZED);
                    })
                )
        );
        const adafruitUsername = res.data.user.username;
        this.onlineUserList.set(userId, {adafruitToken, adafruitUsername});
        this.storeService.save(Object.fromEntries(this.onlineUserList));
    
    }

    private deleteOnlineUser(userId: string){
        if(this.onlineUserList.has(userId)){
            this.onlineUserList.delete(userId);
            this.storeService.save(this.onlineUserList);
        }
    }

    getOnlineUser(userId: string){
        return this.onlineUserList.get(userId);
    }
}