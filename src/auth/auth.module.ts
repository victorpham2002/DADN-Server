import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserModule } from "src/user/user.module";
import { JwtModule } from "@nestjs/jwt";
import jwtConfig from "src/configs/jwt/jwt.config";
import { LocalStrategy } from "./strategies/local.strategy";
import { AccessTokenStrategy } from "./strategies/accessToken.strategy";
import { RefreshTokenStrategy } from "./strategies/refreshToken.strategy";

@Module({
    imports: [
        UserModule,
        JwtModule.register({
            // global: true,
            // secret: jwtConfig.secret,
            // signOptions: { expiresIn: '1 days' },
        })
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, AccessTokenStrategy, RefreshTokenStrategy]
})
export class AuthModule{}