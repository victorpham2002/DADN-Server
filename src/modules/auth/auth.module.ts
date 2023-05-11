import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserModule } from "src/modules/user/user.module";
import { JwtModule } from "@nestjs/jwt";
import jwtConfig from "src/configs/jwt/jwt.config";
import { LocalStrategy } from "./strategies/local.strategy";
import { AccessTokenStrategy } from "./strategies/accessToken.strategy";
import { RefreshTokenStrategy } from "./strategies/refreshToken.strategy";
import { StoreModule } from "src/modules/store/store.module";
import { HttpModule } from "@nestjs/axios";

@Module({
    imports: [
        UserModule,
        JwtModule.register({
            // global: true,
            // secret: jwtConfig.secret,
            // signOptions: { expiresIn: '1 days' },
        }),
        StoreModule.register({
            dirname: './src/modules/store/online_user_list',
            filename: 'online_user_list.json'
        }),
        HttpModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, AccessTokenStrategy, RefreshTokenStrategy],
    exports: [AuthService]
})
export class AuthModule{}