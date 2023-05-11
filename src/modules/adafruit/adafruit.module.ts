import { Module } from "@nestjs/common";
import { AdafruitController } from "./adafruit.controller";
import { HttpModule } from "@nestjs/axios";
import { AuthModule } from "src/modules/auth/auth.module";
import { AccessTokenStrategy } from "src/modules/auth/strategies/accessToken.strategy";
import { AdafruitService } from "./adafruit.service";
import { SettingModule } from "../setting/setting.module";

@Module({
    imports: [
        HttpModule,
        AuthModule,
        SettingModule,
    ],
    controllers: [AdafruitController],
    providers: [AdafruitService],
})
export class AdafruitModule{}