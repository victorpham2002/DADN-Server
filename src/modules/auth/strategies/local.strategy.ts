import { Injectable } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";
import { UserService } from "src/modules/user/user.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
    constructor(
        private readonly authService : AuthService
    ){
        super();
    }

    validate(username: string, password: string){
        return this.authService.validateUser(username, password);
    }

}