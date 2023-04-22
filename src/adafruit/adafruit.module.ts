import { Module } from "@nestjs/common";
import { AdafruitController } from "./adafruit.controller";
import { HttpModule } from "@nestjs/axios";
import { AuthModule } from "src/auth/auth.module";
import { AccessTokenStrategy } from "src/auth/strategies/accessToken.strategy";
import { AdafruitService } from "./adafruit.service";

@Module({
    imports: [
        HttpModule,
        AuthModule
    ],
    controllers: [AdafruitController],
    providers: [AdafruitService],
})
export class AdafruitModule{}