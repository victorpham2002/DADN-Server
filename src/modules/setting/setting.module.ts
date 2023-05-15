import { Module } from "@nestjs/common";
import { SettingController } from "./setting.controller";
import { SettingService } from "./setting.service";
import { MongooseModule } from "@nestjs/mongoose";
import { SettingFactory } from "./schemas/setting.schema";
import { GardenFactory } from "./schemas/garden.schema";
import { ConditionFactory } from "./schemas/condition.schema";
import { DeviceFactory } from "../schedule/schemas/device.schema";

@Module({
    imports: [
        MongooseModule.forFeatureAsync([
            GardenFactory,
            SettingFactory,
            ConditionFactory,
        ])
    ],
    providers: [SettingService],
    controllers: [SettingController],
    exports: [SettingService],
})
export class SettingModule{

}