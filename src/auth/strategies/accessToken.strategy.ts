import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import jwtConfig from 'src/configs/jwt/jwt.config';
import { JwtPayload } from '../types/jwtPayload.type';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt'){
    constructor(){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: jwtConfig.access
        });
    }

    validate(payload: JwtPayload){
        return payload;
    }
}