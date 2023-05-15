import { Inject, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DeviceFactory } from "./schemas/device.schema";
import { TimeFactory } from "./schemas/time.schema";
import { ScheduleController } from "./schedule.controller";
import { ScheduleService } from "./schedule.service";
import { Model } from "mongoose";
import { SettingModule } from "../setting/setting.module";

@Module({
    imports: [
        MongooseModule.forFeatureAsync([
            DeviceFactory,
            TimeFactory
        ]),
        SettingModule,
    ],
    providers: [ScheduleService],
    controllers: [ScheduleController],
    exports: [ScheduleService]
})
export class ScheduleModule{}