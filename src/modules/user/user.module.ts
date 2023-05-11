import { Inject, Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { MongooseModule, getModelToken } from "@nestjs/mongoose";
import { User, UserFactory, UserSchema, UserSchemaFactory } from "./schemas/user.schema";
import { HttpModule } from "@nestjs/axios";
import { Garden, GardenFactory, GardenSchema, GardenSchemaFactory } from "src/modules/setting/schemas/garden.schema";
import { Model } from "mongoose";
import { NextFunction } from "express";
import { SettingModule } from "../setting/setting.module";
import { SettingFactory } from "../setting/schemas/setting.schema";

@Module({
    imports: [
        MongooseModule.forFeatureAsync([
            UserFactory,
        ]),
        HttpModule,
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})

export class UserModule{
    
}